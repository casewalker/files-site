import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  StorageClass,
} from "@aws-sdk/client-s3";
import type { ListObjectsV2CommandInput } from "@aws-sdk/client-s3";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  TransactWriteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { QueryCommandInput, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  DIR_ID_INDEX,
  FILE_SYSTEM_TABLE,
  PRESIGNED_URL_EXPIRATION_SECONDS,
  REGION,
  S3_FILES_BUCKET,
} from "#util/constants.ts";
import type { DirectoryRecord, FileSystemRecord } from "#util/types.ts";

export interface S3ObjectSummary {
  key: string;
  size?: number;
  lastModified?: string;
}

const s3Client = new S3Client({ region: REGION });
const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

// S3

export const getPresignedS3DownloadLink = async (
  s3Key: string,
  fileName: string,
): Promise<string> => {
  const presignedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: S3_FILES_BUCKET,
      Key: s3Key,
      ResponseContentDisposition: `attachment; filename=${encodeURIComponent(fileName)}`,
    }),
    { expiresIn: PRESIGNED_URL_EXPIRATION_SECONDS },
  );
  console.info(`awsUtils: Presigned download URL created for ${s3Key}`);
  return presignedUrl;
};

export const getPresignedS3UploadLink = async (s3Key: string): Promise<string> => {
  const presignedUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: S3_FILES_BUCKET,
      Key: s3Key,
      StorageClass: StorageClass.INTELLIGENT_TIERING,
    }),
    { expiresIn: PRESIGNED_URL_EXPIRATION_SECONDS },
  );
  console.info(`awsUtils: Presigned upload URL created for ${s3Key}`);
  return presignedUrl;
};

/** Returns the object's size, or undefined if no object exists at the key. */
export const headS3Object = async (s3Key: string): Promise<{ size?: number } | undefined> => {
  try {
    const output = await s3Client.send(
      new HeadObjectCommand({ Bucket: S3_FILES_BUCKET, Key: s3Key }),
    );
    return { size: output.ContentLength };
  } catch (error) {
    if (error instanceof Error && (error.name === "NotFound" || error.name === "NoSuchKey")) {
      return undefined;
    }
    throw error;
  }
};

export const deleteS3Object = async (s3Key: string): Promise<void> => {
  await s3Client.send(new DeleteObjectCommand({ Bucket: S3_FILES_BUCKET, Key: s3Key }));
};

export const listAllS3Objects = async (): Promise<S3ObjectSummary[]> => {
  const commandInput: ListObjectsV2CommandInput = { Bucket: S3_FILES_BUCKET };
  const allObjects: S3ObjectSummary[] = [];

  do {
    const output = await s3Client.send(new ListObjectsV2Command(commandInput));
    if (output.Contents != null) {
      const objects: S3ObjectSummary[] = output.Contents.filter((obj) => obj.Key != null).map(
        (obj) => ({
          key: obj.Key!,
          size: obj.Size,
          lastModified: obj.LastModified?.toISOString(),
        }),
      );
      allObjects.push(...objects);
    }
    commandInput.ContinuationToken = output.IsTruncated ? output.NextContinuationToken : undefined;
  } while (commandInput.ContinuationToken != null);

  return allObjects;
};

// DynamoDB — single FileSystem table, parent-ID adjacency (pk = parentDirId, sk = name)

export const getFileSystemRecord = async (
  parentDirId: string,
  name: string,
): Promise<FileSystemRecord | undefined> => {
  const output = await dynamoDbClient.send(
    new GetCommand({
      TableName: FILE_SYSTEM_TABLE,
      Key: { parentDirId, name },
    }),
  );
  return output.Item as FileSystemRecord | undefined;
};

/** Looks up a directory's own record by its immutable ID via the sparse GSI. */
export const getDirectoryById = async (dirId: string): Promise<DirectoryRecord | undefined> => {
  const output = await dynamoDbClient.send(
    new QueryCommand({
      TableName: FILE_SYSTEM_TABLE,
      IndexName: DIR_ID_INDEX,
      KeyConditionExpression: "dirId = :dirId",
      ExpressionAttributeValues: { ":dirId": dirId },
      Limit: 1,
    }),
  );
  return output.Items?.[0] as DirectoryRecord | undefined;
};

/** Lists a directory's immediate children (files and subdirectories) with a single Query. */
export const listDirectoryChildren = async (dirId: string): Promise<FileSystemRecord[]> => {
  const commandInput: QueryCommandInput = {
    TableName: FILE_SYSTEM_TABLE,
    KeyConditionExpression: "parentDirId = :dirId",
    ExpressionAttributeValues: { ":dirId": dirId },
  };
  const children: FileSystemRecord[] = [];

  do {
    const output = await dynamoDbClient.send(new QueryCommand(commandInput));
    if (output.Items != null) {
      children.push(...(output.Items as FileSystemRecord[]));
    }
    commandInput.ExclusiveStartKey = output.LastEvaluatedKey;
  } while (commandInput.ExclusiveStartKey != null);

  return children;
};

/** Full-table scan, used only by the nightly reconciliation job. */
export const scanAllFileSystemRecords = async (): Promise<FileSystemRecord[]> => {
  const commandInput: ScanCommandInput = { TableName: FILE_SYSTEM_TABLE };
  const allRecords: FileSystemRecord[] = [];

  do {
    const response = await dynamoDbClient.send(new ScanCommand(commandInput));
    if (response.Items != null) {
      allRecords.push(...(response.Items as FileSystemRecord[]));
    }
    commandInput.ExclusiveStartKey = response.LastEvaluatedKey;
  } while (commandInput.ExclusiveStartKey != null);

  return allRecords;
};

/**
 * Creates a record, failing with ConditionalCheckFailedException if an item with the same
 * parentDirId + name already exists.
 */
export const createFileSystemRecord = async (record: FileSystemRecord): Promise<void> => {
  await dynamoDbClient.send(
    new PutCommand({
      TableName: FILE_SYSTEM_TABLE,
      Item: record,
      ConditionExpression: "attribute_not_exists(parentDirId)",
    }),
  );
};

/**
 * Updates an existing file record in place after an overwrite upload. The condition guards against
 * the record having been deleted or replaced since `getUploadUrl` was issued.
 */
export const updateFileRecordAfterOverwrite = async (
  parentDirId: string,
  name: string,
  s3Key: string,
  size: number,
  modifiedDate: string,
): Promise<void> => {
  await dynamoDbClient.send(
    new UpdateCommand({
      TableName: FILE_SYSTEM_TABLE,
      Key: { parentDirId, name },
      UpdateExpression: "SET #size = :size, modifiedDate = :modifiedDate",
      ConditionExpression: "recordType = :file AND s3Key = :s3Key",
      ExpressionAttributeNames: { "#size": "size" },
      ExpressionAttributeValues: {
        ":size": size,
        ":modifiedDate": modifiedDate,
        ":file": "FILE",
        ":s3Key": s3Key,
      },
    }),
  );
};

export const deleteFileSystemRecord = async (parentDirId: string, name: string): Promise<void> => {
  await dynamoDbClient.send(
    new DeleteCommand({
      TableName: FILE_SYSTEM_TABLE,
      Key: { parentDirId, name },
    }),
  );
};

/**
 * Atomically moves/renames a record: conditional put at the destination + delete of the source in
 * one transaction. Never delete-then-put — a crash between them would lose the record. With
 * `overwriteFile`, the destination must already exist as a FILE (its blob is the caller's
 * responsibility to delete after the transaction succeeds).
 */
export const transactMoveRecord = async (
  record: FileSystemRecord,
  destParentDirId: string,
  destName: string,
  overwriteFile: boolean,
): Promise<FileSystemRecord> => {
  const movedRecord: FileSystemRecord = { ...record, parentDirId: destParentDirId, name: destName };
  await dynamoDbClient.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: FILE_SYSTEM_TABLE,
            Item: movedRecord,
            ConditionExpression: overwriteFile
              ? "attribute_exists(parentDirId) AND recordType = :file"
              : "attribute_not_exists(parentDirId)",
            ...(overwriteFile && { ExpressionAttributeValues: { ":file": "FILE" } }),
          },
        },
        {
          Delete: {
            TableName: FILE_SYSTEM_TABLE,
            Key: { parentDirId: record.parentDirId, name: record.name },
            ConditionExpression: "attribute_exists(parentDirId)",
          },
        },
      ],
    }),
  );
  return movedRecord;
};
