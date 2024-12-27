import * as cdk from "aws-cdk-lib";
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
    });

    const functionName = `ListFiles-${canonicalStageName}`;
    const logGroup = new logs.LogGroup(this, "listFiles-LogGroup", {
      logGroupName: `/aws/lambda/${functionName}`,
    });

    const listFilesLambda = new njs.NodejsFunction(this, "listFilesFunction", {
      functionName,
      entry: "../api/src/listFiles.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 766,
      logGroup,
      environment: {
        FILES_BUCKET_NAME: filesBucket.bucketName,
      },
    });

    filesBucket.grantReadWrite(listFilesLambda);
  }
}
