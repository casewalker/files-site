import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

/** Sentinel `parentDirId` for items at the top level of the file system. */
export const ROOT_DIR_ID = "ROOT";

interface BaseRecord {
  /** `dirId` of the containing directory (`ROOT_DIR_ID` at the top level). Partition key. */
  parentDirId: string;
  /** Item name within the parent directory. Sort key. */
  name: string;
  createdDate: string;
}

export interface FileRecord extends BaseRecord {
  recordType: "FILE";
  /** Opaque S3 object key. Never derived from the file's name or path. */
  s3Key: string;
  size: number;
  modifiedDate: string;
}

export interface DirectoryRecord extends BaseRecord {
  recordType: "DIRECTORY";
  /** Immutable ID; children reference it as their `parentDirId`. Never changes across rename/move. */
  dirId: string;
}

export type FileSystemRecord = FileRecord | DirectoryRecord;

export type ApiGatewayEvent = APIGatewayProxyEventV2WithJWTAuthorizer;

export type ApiHandler<TData> = (
  event: ApiGatewayEvent,
) => Promise<{ data: TData } | APIGatewayProxyStructuredResultV2>;

export interface UploadUrlData {
  url: string;
  s3Key: string;
  willOverwrite: boolean;
}

export interface DownloadUrlData {
  url: string;
}

export interface ListDirectoryData {
  items: FileSystemRecord[];
}

export interface CreateDirectoryData {
  directory: DirectoryRecord;
}

export interface ConfirmUploadData {
  file: FileRecord;
}

export interface MoveItemData {
  item: FileSystemRecord;
}

export interface DeleteItemData {
  deletedCount: number;
}
