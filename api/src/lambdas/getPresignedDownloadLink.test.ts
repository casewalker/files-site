import { makeApiGatewayProxyEvent } from "@secure-cloud-files/src/__tests__/factories";
import { handler } from "@secure-cloud-files/src/lambdas/getPresignedDownloadLink";
import {
  getFileDetailsRecord,
  getPresignedS3DownloadLink,
} from "@secure-cloud-files/src/util/awsUtils";

const DUMMY_RECORD = {
  key: "1700000000000|0123-456-789-abc-def",
  createdDate: "2023-11-14T22:13:20.000Z",
  fileName: "test.jpg",
  filePath: "dir1/",
};

vi.mock("@secure-cloud-files/src/util/awsUtils");

afterEach(vi.resetAllMocks);

describe(handler, () => {
  it("returns a presigned download link", async () => {
    vi.mocked(getFileDetailsRecord).mockResolvedValue(DUMMY_RECORD);
    vi.mocked(getPresignedS3DownloadLink).mockResolvedValue("https://example.com/fakeDownload");
    const event = makeApiGatewayProxyEvent({ key: "test-file-key" });

    const output = await handler(event);
    assert("data" in output, "Output should contain the presigned URL data");
    expect(output.data.url).toBe("https://example.com/fakeDownload");
    expect(getFileDetailsRecord).toHaveBeenCalledWith("test-file-key");
  });

  it.each([
    ["there's no queryStringParameters" , makeApiGatewayProxyEvent()],
    ["'key' is missing" , makeApiGatewayProxyEvent({ somethingElse: "um, hi" })],
    ["'key' is undefined" , makeApiGatewayProxyEvent({ key: undefined  })],
    ["'key' is blank" , makeApiGatewayProxyEvent({ key: " " })],
  ])("returns a 400 error if %s", async (_testName, event) => {
    vi.mocked(getFileDetailsRecord).mockResolvedValue(DUMMY_RECORD);
    vi.mocked(getPresignedS3DownloadLink).mockResolvedValue("https://example.com/fakeDownload");

    const output = await handler(event);
    assert("statusCode" in output, "Output should contain a statusCode");
    expect(output.statusCode).toBe(400);
    expect("error" in JSON.parse(output.body!)).toBe(true);
  });

  it.each([
    [
      getFileDetailsRecord.name,
      () => {
        vi.mocked(getFileDetailsRecord).mockRejectedValue(new Error("DynamoDB error"));
        vi.mocked(getPresignedS3DownloadLink).mockResolvedValue("https://example.com/fakeDownload");
      },
    ],
    [
      getPresignedS3DownloadLink.name,
      () => {
        vi.mocked(getFileDetailsRecord).mockResolvedValue(DUMMY_RECORD);
        vi.mocked(getPresignedS3DownloadLink).mockRejectedValue(new Error("S3 error"));
      },
    ],
  ])("returns a 500 error if %s throws an error", async (_functionName, setupMocks) => {
    setupMocks();
    const event = makeApiGatewayProxyEvent({ key: "test-file-key" });

    const output = await handler(event);
    assert("statusCode" in output, "Output should contain a statusCode");
    expect(output.statusCode).toBe(500);
    expect("error" in JSON.parse(output.body!)).toBe(true);
  });
});
