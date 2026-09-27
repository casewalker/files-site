import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

const requireEnvironmentVariable = (name: string): string => {
  const value = process.env[name];
  if (value == null || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const FILE_SYSTEM_TABLE = requireEnvironmentVariable("FILE_SYSTEM_TABLE");
export const S3_FILES_BUCKET = requireEnvironmentVariable("FILES_BUCKET_NAME");
export const REGION = requireEnvironmentVariable("REGION");

export const DIR_ID_INDEX = "DirIdIndex";
export const PRESIGNED_URL_EXPIRATION_SECONDS = 300;

export const makeErrorResponse = (
  statusCode: number,
  error: string,
  extraFields?: Record<string, unknown>,
): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  body: JSON.stringify({ error, ...extraFields }),
});
