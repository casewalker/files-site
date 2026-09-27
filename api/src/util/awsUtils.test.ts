import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  TransactWriteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  createFileSystemRecord,
  deleteFileSystemRecord,
  deleteS3Object,
  getDirectoryById,
  getFileSystemRecord,
  getPresignedS3DownloadLink,
  getPresignedS3UploadLink,
  headS3Object,
  listAllS3Objects,
  listDirectoryChildren,
  scanAllFileSystemRecords,
  transactMoveRecord,
  updateFileRecordAfterOverwrite,
} from "#util/awsUtils.ts";
import type { DirectoryRecord, FileRecord } from "#util/types.ts";

const { mockDynamoSend, mockS3Send } = vi.hoisted(() => ({
  mockDynamoSend: vi.fn(),
  mockS3Send: vi.fn(),
}));

vi.mock("@aws-sdk/client-dynamodb", () => ({ DynamoDBClient: class {} }));

vi.mock("@aws-sdk/lib-dynamodb", () => {
  // Snapshots the input: the paginated helpers mutate one shared input object across
  // iterations, which the real SDK tolerates because it serializes at send time.
  class MockCommand {
    readonly input: Record<string, unknown>;
    constructor(input: Record<string, unknown>) {
      this.input = { ...input };
    }
  }
  return {
    DynamoDBDocumentClient: { from: (): { send: typeof mockDynamoSend } => ({ send: mockDynamoSend }) },
    GetCommand: class extends MockCommand {},
    PutCommand: class extends MockCommand {},
    DeleteCommand: class extends MockCommand {},
    QueryCommand: class extends MockCommand {},
    ScanCommand: class extends MockCommand {},
    UpdateCommand: class extends MockCommand {},
    TransactWriteCommand: class extends MockCommand {},
  };
});

vi.mock("@aws-sdk/client-s3", () => {
  // Snapshots the input: the paginated helpers mutate one shared input object across
  // iterations, which the real SDK tolerates because it serializes at send time.
  class MockCommand {
    readonly input: Record<string, unknown>;
    constructor(input: Record<string, unknown>) {
      this.input = { ...input };
    }
  }
  return {
    S3Client: class {
      send = mockS3Send;
    },
    GetObjectCommand: class extends MockCommand {},
    PutObjectCommand: class extends MockCommand {},
    DeleteObjectCommand: class extends MockCommand {},
    HeadObjectCommand: class extends MockCommand {},
    ListObjectsV2Command: class extends MockCommand {},
  };
});

vi.mock("@aws-sdk/s3-request-presigner", () => ({ getSignedUrl: vi.fn() }));

afterEach(vi.resetAllMocks);

const FILE_RECORD: FileRecord = {
  parentDirId: "ROOT",
  name: "budget.xlsx",
  recordType: "FILE",
  s3Key: "abc-123",
  size: 1024,
  createdDate: "2026-01-01T00:00:00.000Z",
  modifiedDate: "2026-01-02T00:00:00.000Z",
};

const DIRECTORY_RECORD: DirectoryRecord = {
  parentDirId: "ROOT",
  name: "reports",
  recordType: "DIRECTORY",
  dirId: "dir-1",
  createdDate: "2026-01-01T00:00:00.000Z",
};

describe(getFileSystemRecord, () => {
  it("gets the record by parentDirId and name", async () => {
    mockDynamoSend.mockResolvedValue({ Item: FILE_RECORD });

    const record = await getFileSystemRecord("ROOT", "budget.xlsx");
    expect(record).toEqual(FILE_RECORD);
    const command = mockDynamoSend.mock.calls[0][0] as GetCommand;
    expect(command).toBeInstanceOf(GetCommand);
    expect(command.input).toEqual({
      TableName: "FileSystemTable-test",
      Key: { parentDirId: "ROOT", name: "budget.xlsx" },
    });
  });

  it("returns undefined when there is no record", async () => {
    mockDynamoSend.mockResolvedValue({});
    expect(await getFileSystemRecord("ROOT", "nope.txt")).toBeUndefined();
  });
});

describe(getDirectoryById, () => {
  it("queries the DirIdIndex for the directory's own record", async () => {
    mockDynamoSend.mockResolvedValue({ Items: [DIRECTORY_RECORD] });

    const record = await getDirectoryById("dir-1");
    expect(record).toEqual(DIRECTORY_RECORD);
    const command = mockDynamoSend.mock.calls[0][0] as QueryCommand;
    expect(command).toBeInstanceOf(QueryCommand);
    expect(command.input).toEqual({
      TableName: "FileSystemTable-test",
      IndexName: "DirIdIndex",
      KeyConditionExpression: "dirId = :dirId",
      ExpressionAttributeValues: { ":dirId": "dir-1" },
      Limit: 1,
    });
  });

  it("returns undefined when the directory does not exist", async () => {
    mockDynamoSend.mockResolvedValue({ Items: [] });
    expect(await getDirectoryById("missing")).toBeUndefined();
  });
});

describe(listDirectoryChildren, () => {
  it("queries by parentDirId and follows pagination", async () => {
    mockDynamoSend
      .mockResolvedValueOnce({ Items: [DIRECTORY_RECORD], LastEvaluatedKey: { parentDirId: "x" } })
      .mockResolvedValueOnce({ Items: [FILE_RECORD] });

    const children = await listDirectoryChildren("ROOT");
    expect(children).toEqual([DIRECTORY_RECORD, FILE_RECORD]);
    expect(mockDynamoSend).toHaveBeenCalledTimes(2);
    const firstCommand = mockDynamoSend.mock.calls[0][0] as QueryCommand;
    expect(firstCommand).toBeInstanceOf(QueryCommand);
    expect(firstCommand.input).toMatchObject({
      TableName: "FileSystemTable-test",
      KeyConditionExpression: "parentDirId = :dirId",
      ExpressionAttributeValues: { ":dirId": "ROOT" },
    });
    const secondCommand = mockDynamoSend.mock.calls[1][0] as QueryCommand;
    expect(secondCommand.input).toMatchObject({ ExclusiveStartKey: { parentDirId: "x" } });
  });
});

describe(scanAllFileSystemRecords, () => {
  it("scans the whole table and follows pagination", async () => {
    mockDynamoSend
      .mockResolvedValueOnce({ Items: [FILE_RECORD], LastEvaluatedKey: { parentDirId: "x" } })
      .mockResolvedValueOnce({ Items: [DIRECTORY_RECORD] });

    const records = await scanAllFileSystemRecords();
    expect(records).toEqual([FILE_RECORD, DIRECTORY_RECORD]);
    expect(mockDynamoSend).toHaveBeenCalledTimes(2);
    expect(mockDynamoSend.mock.calls[0][0]).toBeInstanceOf(ScanCommand);
  });
});

describe(createFileSystemRecord, () => {
  it("puts the record guarded by an existence condition", async () => {
    await createFileSystemRecord(DIRECTORY_RECORD);

    const command = mockDynamoSend.mock.calls[0][0] as PutCommand;
    expect(command).toBeInstanceOf(PutCommand);
    expect(command.input).toEqual({
      TableName: "FileSystemTable-test",
      Item: DIRECTORY_RECORD,
      ConditionExpression: "attribute_not_exists(parentDirId)",
    });
  });
});

describe(updateFileRecordAfterOverwrite, () => {
  it("updates size and modifiedDate guarded on recordType and s3Key", async () => {
    await updateFileRecordAfterOverwrite("ROOT", "budget.xlsx", "abc-123", 2048, "2026-02-01T00:00:00.000Z");

    const command = mockDynamoSend.mock.calls[0][0] as UpdateCommand;
    expect(command).toBeInstanceOf(UpdateCommand);
    expect(command.input).toEqual({
      TableName: "FileSystemTable-test",
      Key: { parentDirId: "ROOT", name: "budget.xlsx" },
      UpdateExpression: "SET #size = :size, modifiedDate = :modifiedDate",
      ConditionExpression: "recordType = :file AND s3Key = :s3Key",
      ExpressionAttributeNames: { "#size": "size" },
      ExpressionAttributeValues: {
        ":size": 2048,
        ":modifiedDate": "2026-02-01T00:00:00.000Z",
        ":file": "FILE",
        ":s3Key": "abc-123",
      },
    });
  });
});

describe(deleteFileSystemRecord, () => {
  it("deletes the record by parentDirId and name", async () => {
    await deleteFileSystemRecord("ROOT", "budget.xlsx");

    const command = mockDynamoSend.mock.calls[0][0] as DeleteCommand;
    expect(command).toBeInstanceOf(DeleteCommand);
    expect(command.input).toEqual({
      TableName: "FileSystemTable-test",
      Key: { parentDirId: "ROOT", name: "budget.xlsx" },
    });
  });
});

describe(transactMoveRecord, () => {
  it("puts at the destination and deletes the source in one transaction", async () => {
    const moved = await transactMoveRecord(FILE_RECORD, "dir-1", "renamed.xlsx", false);

    expect(moved).toEqual({ ...FILE_RECORD, parentDirId: "dir-1", name: "renamed.xlsx" });
    const command = mockDynamoSend.mock.calls[0][0] as TransactWriteCommand;
    expect(command).toBeInstanceOf(TransactWriteCommand);
    expect(command.input).toEqual({
      TransactItems: [
        {
          Put: {
            TableName: "FileSystemTable-test",
            Item: { ...FILE_RECORD, parentDirId: "dir-1", name: "renamed.xlsx" },
            ConditionExpression: "attribute_not_exists(parentDirId)",
          },
        },
        {
          Delete: {
            TableName: "FileSystemTable-test",
            Key: { parentDirId: "ROOT", name: "budget.xlsx" },
            ConditionExpression: "attribute_exists(parentDirId)",
          },
        },
      ],
    });
  });

  it("requires the destination to be an existing FILE when overwriting", async () => {
    await transactMoveRecord(FILE_RECORD, "dir-1", "existing.xlsx", true);

    const command = mockDynamoSend.mock.calls[0][0] as TransactWriteCommand;
    expect(command.input).toMatchObject({
      TransactItems: [
        {
          Put: {
            ConditionExpression: "attribute_exists(parentDirId) AND recordType = :file",
            ExpressionAttributeValues: { ":file": "FILE" },
          },
        },
        { Delete: { Key: { parentDirId: "ROOT", name: "budget.xlsx" } } },
      ],
    });
  });
});

describe(getPresignedS3DownloadLink, () => {
  it("presigns a GET with an attachment content disposition", async () => {
    vi.mocked(getSignedUrl).mockResolvedValue("https://example.com/download");

    const url = await getPresignedS3DownloadLink("abc-123", "budget.xlsx");
    expect(url).toBe("https://example.com/download");
    const [, command, options] = vi.mocked(getSignedUrl).mock.calls[0];
    expect(command).toBeInstanceOf(GetObjectCommand);
    expect(command.input).toEqual({
      Bucket: "files-bucket-test",
      Key: "abc-123",
      ResponseContentDisposition: "attachment; filename=budget.xlsx",
    });
    expect(options).toEqual({ expiresIn: 300 });
  });
});

describe(getPresignedS3UploadLink, () => {
  it("presigns a PUT for the object key", async () => {
    vi.mocked(getSignedUrl).mockResolvedValue("https://example.com/upload");

    const url = await getPresignedS3UploadLink("abc-123");
    expect(url).toBe("https://example.com/upload");
    const [, command, options] = vi.mocked(getSignedUrl).mock.calls[0];
    expect(command).toBeInstanceOf(PutObjectCommand);
    expect(command.input).toEqual({ Bucket: "files-bucket-test", Key: "abc-123" });
    expect(options).toEqual({ expiresIn: 300 });
  });
});

describe(headS3Object, () => {
  it("returns the object's size", async () => {
    mockS3Send.mockResolvedValue({ ContentLength: 1024 });

    expect(await headS3Object("abc-123")).toEqual({ size: 1024 });
    const command = mockS3Send.mock.calls[0][0] as HeadObjectCommand;
    expect(command).toBeInstanceOf(HeadObjectCommand);
    expect(command.input).toEqual({ Bucket: "files-bucket-test", Key: "abc-123" });
  });

  it("returns undefined when no object exists at the key", async () => {
    mockS3Send.mockRejectedValue(Object.assign(new Error("no such key"), { name: "NotFound" }));
    expect(await headS3Object("missing")).toBeUndefined();
  });

  it("rethrows other errors", async () => {
    mockS3Send.mockRejectedValue(Object.assign(new Error("denied"), { name: "AccessDenied" }));
    await expect(headS3Object("abc-123")).rejects.toThrow("denied");
  });
});

describe(deleteS3Object, () => {
  it("deletes the object by key", async () => {
    await deleteS3Object("abc-123");

    const command = mockS3Send.mock.calls[0][0] as DeleteObjectCommand;
    expect(command).toBeInstanceOf(DeleteObjectCommand);
    expect(command.input).toEqual({ Bucket: "files-bucket-test", Key: "abc-123" });
  });
});

describe(listAllS3Objects, () => {
  it("lists all objects and follows pagination", async () => {
    mockS3Send
      .mockResolvedValueOnce({
        Contents: [{ Key: "key-1", Size: 1, LastModified: new Date(1) }],
        IsTruncated: true,
        NextContinuationToken: "token",
      })
      .mockResolvedValueOnce({
        Contents: [{ Key: "key-2", Size: 2, LastModified: new Date(2) }],
      });

    const objects = await listAllS3Objects();
    expect(objects).toEqual([
      { key: "key-1", size: 1, lastModified: new Date(1).toISOString() },
      { key: "key-2", size: 2, lastModified: new Date(2).toISOString() },
    ]);
    expect(mockS3Send).toHaveBeenCalledTimes(2);
    expect(mockS3Send.mock.calls[0][0]).toBeInstanceOf(ListObjectsV2Command);
    const secondCommand = mockS3Send.mock.calls[1][0] as ListObjectsV2Command;
    expect(secondCommand.input).toMatchObject({ ContinuationToken: "token" });
  });

  it("skips entries without a key", async () => {
    mockS3Send.mockResolvedValue({ Contents: [{ Size: 1 }, { Key: "key-1", Size: 2 }] });

    const objects = await listAllS3Objects();
    expect(objects).toEqual([{ key: "key-1", size: 2, lastModified: undefined }]);
  });
});
