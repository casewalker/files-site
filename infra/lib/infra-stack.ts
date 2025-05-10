import * as cdk from "aws-cdk-lib";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apiIntgrtn from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as njs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface StageConfig {
  accountId: string;
  region: string;
}

interface CustomStackProps extends cdk.StackProps {
  stageName: string;
  stageConfig: StageConfig;
}

export const DEPLOYMENT_STAGES: Record<string, StageConfig> = {
  pinskyPentagon: {
    accountId: "196478524922",
    region: "us-west-2",
  },
};

const FILES_BUCKET_NAME_PREFIX = "files-site-all-files";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);

    const canonicalStageName = props.stageName.toLowerCase();

    const filesBucket = new s3.Bucket(this, "AllFilesBucket", {
      bucketName: `${FILES_BUCKET_NAME_PREFIX}-${canonicalStageName}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      cors: [{
        allowedHeaders: ["*"],
        allowedMethods: [s3.HttpMethods.PUT],
        allowedOrigins: ["http://localhost:3000"],
      }],
    });

    const fileDetailsTable = new dynamodb.TableV2(this, "FileDetailsTable", {
      tableName: `FileDetails-${canonicalStageName}`,
      partitionKey: { name: "key", type: dynamodb.AttributeType.STRING },
      deletionProtection: true,
    });

    // TODO: Use this I guess? Creating directories is independent of creating files.
    const directoryDetailsTable = new dynamodb.TableV2(this, "DirectoryDetailsTable", {
      tableName: `DirectoryDetails-${canonicalStageName}`,
      partitionKey: { name: "directoryPath", type: dynamodb.AttributeType.STRING },
      deletionProtection: true,
    });

    const lambdaEnvironment = {
      FILE_DETAILS_TABLE: fileDetailsTable.tableName,
      DIRECTORY_DETAILS_TABLE: directoryDetailsTable.tableName,
      FILES_BUCKET_NAME: filesBucket.bucketName,
      REGION: props.stageConfig.region,
    };

    const functionNames = {
      listFiles: `ListFiles-${canonicalStageName}`,
      getPresignedDownloadLink: `getPresignedDownloadLink-${canonicalStageName}`,
      getPresignedUploadLink: `getPresignedUploadLink-${canonicalStageName}`,
    };

    const logGroupListFiles = new logs.LogGroup(this, "ListFiles-LogGroup", {
      logGroupName: `/aws/lambda/${functionNames.listFiles}`,
      retention: logs.RetentionDays.INFINITE,
    });

    const logGroupGetPresignedDownloadLink = new logs.LogGroup(this, "GetPresignedDownloadLink-LogGroup", {
      logGroupName: `/aws/lambda/${functionNames.getPresignedDownloadLink}`,
      retention: logs.RetentionDays.INFINITE,
    });

    const logGroupGetPresignedUploadLink = new logs.LogGroup(this, "GetPresignedUploadLink-LogGroup", {
      logGroupName: `/aws/lambda/${functionNames.getPresignedUploadLink}`,
      retention: logs.RetentionDays.INFINITE,
    });

    const lambdas = {
      listFilesLambda:
        new njs.NodejsFunction(this, "ListFilesFunction", {
          functionName: functionNames.listFiles,
          entry: "../api/src/lambdas/listFiles.ts",
          runtime: lambda.Runtime.NODEJS_20_X,
          memorySize: 766,
          logGroup: logGroupListFiles,
          environment: lambdaEnvironment,
        }),
      getPresignedDownloadLinkLambda:
        new njs.NodejsFunction(this, "GetPresignedDownloadLinkFunction", {
          functionName: functionNames.getPresignedDownloadLink,
          entry: "../api/src/lambdas/getPresignedDownloadLink.ts",
          runtime: lambda.Runtime.NODEJS_20_X,
          memorySize: 766,
          logGroup: logGroupGetPresignedDownloadLink,
          environment: lambdaEnvironment,
        }),
      getPresignedUploadLinkLambda:
        new njs.NodejsFunction(this, "GetPresignedUploadLinkFunction", {
          functionName: functionNames.getPresignedUploadLink,
          entry: "../api/src/lambdas/getPresignedUploadLink.ts",
          runtime: lambda.Runtime.NODEJS_20_X,
          memorySize: 766,
          logGroup: logGroupGetPresignedUploadLink,
          environment: lambdaEnvironment,
        }),
    };

    // The HTTP API, Cognito Authorizer, and parts required to connect Lambdas to the Authorizer
    const httpApi = new apigwv2.HttpApi(this, `HttpApi-for-FilesWebsite-${canonicalStageName}`, {
      corsPreflight: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "X-Amz-User-Agent",
          "X-Amzn-Trace-Id",
        ],
        allowMethods: [apigwv2.CorsHttpMethod.OPTIONS, apigwv2.CorsHttpMethod.GET],
        allowOrigins: ["*"],
      },
    });

    // const jwtIssuer = `https://cognito-idp.${props.stageConfig.region}.amazonaws.com/${undefined}`; // todo stuff?
    //
    // const cognitoAuthorizer = new apiAuthz.HttpJwtAuthorizer("CognitoAuthorizer", jwtIssuer, {
    //   authorizerName: "CognitoAuthorizer",
    //   jwtAudience: [], // TODO fill in
    //   identitySource: ["$request.header.Authorization"],
    // });

    httpApi.addRoutes({
      path: "/listFiles",
      // authorizer: cognitoAuthorizer,
      authorizer: new apigwv2.HttpNoneAuthorizer(),
      methods: [apigwv2.HttpMethod.GET],
      integration: new apiIntgrtn.HttpLambdaIntegration(
        "AuthorizerIntegration",
        lambdas.listFilesLambda,
      ),
    });

    httpApi.addRoutes({
      path: "/getPresignedDownloadLink",
      authorizer: new apigwv2.HttpNoneAuthorizer(),
      methods: [apigwv2.HttpMethod.GET],
      integration: new apiIntgrtn.HttpLambdaIntegration(
        "AuthorizerIntegration",
        lambdas.getPresignedDownloadLinkLambda,
      ),
    });

    httpApi.addRoutes({
      path: "/getPresignedUploadLink",
      authorizer: new apigwv2.HttpNoneAuthorizer(),
      methods: [apigwv2.HttpMethod.GET],
      integration: new apiIntgrtn.HttpLambdaIntegration(
        "AuthorizerIntegration",
        lambdas.getPresignedUploadLinkLambda,
      ),
    });

    for (const lambdaFunction of Object.values(lambdas)) {
      filesBucket.grantReadWrite(lambdaFunction);
      fileDetailsTable.grantReadWriteData(lambdaFunction);
      directoryDetailsTable.grantReadWriteData(lambdaFunction);
    }

    new cdk.CfnOutput(this, "ApiUrlOutput", {
      key: "ApiUrl",
      exportName: "ApiUrl",
      value: httpApi.url!,
    });
  }
}
