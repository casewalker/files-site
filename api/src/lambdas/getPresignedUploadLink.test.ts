import { randomUUID } from "node:crypto";
import { makeApiGatewayProxyEvent } from "#__tests__/factories.ts";
import { handler } from "#lambdas/getPresignedUploadLink.ts";
import {
  createFileDetailsRecord,
  deleteFileDetailsRecord,
  getPresignedS3UploadLink,
} from "#util/awsUtils.ts";

vi.mock("node:crypto");
vi.mock("#util/awsUtils.ts");
vi.useFakeTimers().setSystemTime(1700000000000);

afterEach(vi.resetAllMocks);

describe(handler, () => {
  beforeEach(() => {
    vi.mocked(randomUUID).mockReturnValue("0123-456-789-abc-def");
  });

  it("returns a presigned upload link", async () => {
    vi.mocked(getPresignedS3UploadLink).mockResolvedValue("https://example.com/fakeUpload");
    const event = makeApiGatewayProxyEvent({ fileName: "test.jpg", filePath: "dir1/" });

    const output = await handler(event);
    assert("data" in output, "Output should contain the presigned URL data");
    expect(output.data.url).toBe("https://example.com/fakeUpload");
    expect(createFileDetailsRecord).toHaveBeenCalledWith({
      key: "1700000000000|0123-456-789-abc-def",
      createdDate: "2023-11-14T22:13:20.000Z",
      fileName: "test.jpg",
      filePath: "dir1/",
    });
    expect(deleteFileDetailsRecord).not.toHaveBeenCalled();
  });

  it.each([
    ["there's no queryStringParameters", makeApiGatewayProxyEvent()],
    ["fileName is missing", makeApiGatewayProxyEvent({ filePath: "/" })],
    ["fileName is undefined", makeApiGatewayProxyEvent({ fileName: undefined, filePath: "/" })],
    ["fileName is blank", makeApiGatewayProxyEvent({ fileName: " ", filePath: "/" })],
    ["filePath is missing", makeApiGatewayProxyEvent({ fileName: "hi.txt" })],
    ["filePath is undefined", makeApiGatewayProxyEvent({ fileName: "a.c", filePath: undefined })],
    ["filePath is blank", makeApiGatewayProxyEvent({ fileName: "hi.txt", filePath: " " })],
  ])("returns a 400 error if %s", async (_testName, event) => {
    vi.mocked(getPresignedS3UploadLink).mockResolvedValue("https://example.com/fakeUpload");

    const output = await handler(event);
    assert("statusCode" in output, "Output should contain a statusCode");
    expect(output.statusCode).toBe(400);
    expect("error" in JSON.parse(output.body!)).toBe(true);
    expect(deleteFileDetailsRecord).not.toHaveBeenCalled();
  });

  it.each([
    [
      "if createFileDetailsRecord throws an error",
      (): void => {
        vi.mocked(createFileDetailsRecord).mockRejectedValue(new Error("DynamoDB error"));
        vi.mocked(getPresignedS3UploadLink).mockResolvedValue("https://example.com/fakeUpload");
      },
    ],
    [
      "if getPresignedS3UploadLink throws an error",
      (): void => {
        vi.mocked(getPresignedS3UploadLink).mockRejectedValue(new Error("S3 error"));
      },
    ],
    [
      "still, even if deleteFileDetailsRecord also throws an error",
      (): void => {
        vi.mocked(getPresignedS3UploadLink).mockRejectedValue(new Error("S3 error"));
        vi.mocked(deleteFileDetailsRecord).mockRejectedValue(new Error("DynamoDB error"));
      },
    ],
  ])("returns a 500 error %s", async (_testName, setupMocks) => {
    setupMocks();
    const event = makeApiGatewayProxyEvent({ fileName: "test.jpg", filePath: "dir1/" });

    const output = await handler(event);
    assert("statusCode" in output, "Output should contain a statusCode");
    expect(output.statusCode).toBe(500);
    expect("error" in JSON.parse(output.body!)).toBe(true);
    expect(deleteFileDetailsRecord).toHaveBeenCalledWith("1700000000000|0123-456-789-abc-def");
  });
});
