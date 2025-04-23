import type {FileDetails} from "@secure-cloud-files/src/util/awsUtils";
import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

export const FILE_DETAILS_TABLE = process.env.FILE_DETAILS_TABLE;
export const PRESIGNED_URL_EXPIRATION_SECONDS = 300;
export const REGION = process.env.REGION;
export const S3_FILES_BUCKET = process.env.FILES_BUCKET_NAME;

type PresignedUrlSuccessfulResponse = {
  data: { url: string; }
};

type PresignedUrlResponse = PresignedUrlSuccessfulResponse | APIGatewayProxyStructuredResultV2;

export type PresignedUrlApiGatewayHandler = (event: APIGatewayProxyEventV2WithJWTAuthorizer) => Promise<PresignedUrlResponse>;

type FileDetailsSuccessfulResponse = {
  data: { files: FileDetails[]; }
};

type FileDetailsResponse = FileDetailsSuccessfulResponse | APIGatewayProxyStructuredResultV2;

export type FileDetailsApiGatewayHandler = (event: APIGatewayProxyEventV2WithJWTAuthorizer) => Promise<FileDetailsResponse>;

export const makeErrorResponse =
  (statusCode: number, error: string): APIGatewayProxyStructuredResultV2 => ({
    statusCode,
    body: JSON.stringify({ error }),
  });
