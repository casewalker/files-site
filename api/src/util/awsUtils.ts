import { DynamoDBClient, ScanCommand, type ScanCommandInput } from "@aws-sdk/client-dynamodb";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  type ListObjectsV2CommandInput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  FILE_DETAILS_TABLE,
  PRESIGNED_URL_EXPIRATION_SECONDS,
  REGION,
  S3_FILES_BUCKET,
} from "@secure-cloud-files/api/src/util/constants";

interface PartialS3ObjectData {
  key: string;
  lastModified?: Date;
  size?: number;
}

interface FileDetailsRecord {
  key: string;
  createdDate: string;
  fileName: string;
  filePath: string;
}

export type FileDetails = FileDetailsRecord & PartialS3ObjectData;

const s3Client = new S3Client({ region: REGION });
const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient());

// S3

export const listAllS3Files = async (): Promise<PartialS3ObjectData[]> => {
  const commandInput: ListObjectsV2CommandInput = { Bucket: S3_FILES_BUCKET };
  const allFiles: PartialS3ObjectData[] = [];

  do {
    const output = await s3Client.send(new ListObjectsV2Command(commandInput));
    if (output.Contents != null) {
      const outputFiles: PartialS3ObjectData[] = output.Contents
        .filter((obj) => obj.Key != null)
        .map((obj) => ({ key: obj.Key!, size: obj.Size, lastModified: obj.LastModified }));
      allFiles.push(...outputFiles);
    }
    commandInput.ContinuationToken = output.IsTruncated ? output.NextContinuationToken : undefined;
  } while (commandInput.ContinuationToken != null);

  return allFiles;
};

export const getPresignedS3DownloadLink = async (objectName: string, fileName: string): Promise<string> => {
  const presignedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: S3_FILES_BUCKET,
      Key: objectName,
      ResponseContentDisposition: `attachment; filename=${encodeURIComponent(fileName)}`,
    }),
    { expiresIn: PRESIGNED_URL_EXPIRATION_SECONDS },
  );
  console.info(`awsUtils: Presigned download URL created for ${objectName}`);
  return presignedUrl;
};

export const getPresignedS3UploadLink = async (objectName: string): Promise<string> => {
  const presignedUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({ Bucket: S3_FILES_BUCKET, Key: objectName }),
    { expiresIn: PRESIGNED_URL_EXPIRATION_SECONDS },
  );
  console.info(`awsUtils: Presigned upload URL created for ${objectName}`);
  return presignedUrl;
};

// DynamoDB

export const createFileDetailsRecord = async (record: FileDetailsRecord): Promise<void> => {
  await dynamoDbClient.send(new PutCommand({
    TableName: FILE_DETAILS_TABLE,
    Item: record,
  }));
};

export const getFileDetailsRecord = async (key: string): Promise<FileDetailsRecord | undefined> => {
  const output = await dynamoDbClient.send(new GetCommand({
    TableName: FILE_DETAILS_TABLE,
    Key: { key },
  }));
  return output.Item as FileDetailsRecord;
};

export const scanAllFileDetailsRecords = async (): Promise<FileDetailsRecord[]> => {
  const commandInput: ScanCommandInput = { TableName: FILE_DETAILS_TABLE };
  const allRecords: FileDetailsRecord[] = [];

  do {
    const response = await dynamoDbClient.send(new ScanCommand(commandInput));
    if (response.Items != null) {
      allRecords.push(...(response.Items as unknown as FileDetailsRecord[]));
    }
    commandInput.ExclusiveStartKey = response.LastEvaluatedKey;
  } while (commandInput.ExclusiveStartKey != null);

  return allRecords;
};

export const deleteFileDetailsRecord = async (key: string): Promise<void> => {
  await dynamoDbClient.send(new DeleteCommand({
    TableName: FILE_DETAILS_TABLE,
    Key: { key },
  }));
};
