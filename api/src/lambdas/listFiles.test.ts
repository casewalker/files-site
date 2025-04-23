import { handler } from "@secure-cloud-files/src/lambdas/listFiles";
import {
  listAllS3Files,
  scanAllFileDetailsRecords,
} from "@secure-cloud-files/src/util/awsUtils";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

const DUMMY_EVENT = {} as APIGatewayProxyEventV2WithJWTAuthorizer;

vi.mock("@secure-cloud-files/src/util/awsUtils");

afterEach(vi.resetAllMocks);

describe(handler, () => {
  it("returns a list of files", async () => {
    vi.mocked(listAllS3Files).mockResolvedValue([
      { key: "1111", size: 10, lastModified: new Date(1) },
      { key: "2222", size: 11, lastModified: new Date(2) },
      { key: "3333", size: 12, lastModified: new Date(3) },
    ]);
    vi.mocked(scanAllFileDetailsRecords).mockResolvedValue([
      { key: "1111", createdDate: "2025-01-01T00:00:01Z", fileName: "a.png", filePath: "d1/" },
      { key: "2222", createdDate: "2025-01-01T00:00:02Z", fileName: "b.txt", filePath: "d2/" },
      { key: "3333", createdDate: "2025-01-01T00:00:03Z", fileName: "c.pdf", filePath: "d3/" },
    ]);

    const output = await handler(DUMMY_EVENT);
    assert("data" in output, "Output should contain the file data");
    const files = output.data.files;
    expect(files.length).toBe(3);
    expect(files[0]).toEqual({
      key: "1111",
      fileName: "a.png",
      filePath: "d1/",
      size: 10,
      createdDate: "2025-01-01T00:00:01Z",
      lastModified: new Date(1),
    });
    expect(files[1]).toEqual({
      key: "2222",
      fileName: "b.txt",
      filePath: "d2/",
      size: 11,
      createdDate: "2025-01-01T00:00:02Z",
      lastModified: new Date(2),
    });
    expect(files[2]).toEqual({
      key: "3333",
      fileName: "c.pdf",
      filePath: "d3/",
      size: 12,
      createdDate: "2025-01-01T00:00:03Z",
      lastModified: new Date(3),
    });
  });

  it("ignores unmatched S3 results", async () => {
    vi.mocked(listAllS3Files).mockResolvedValue([
      { key: "1111", size: 10, lastModified: new Date(1) },
      { key: "2222", size: 11, lastModified: new Date(2) },
      { key: "3333", size: 12, lastModified: new Date(3) },
    ]);
    vi.mocked(scanAllFileDetailsRecords).mockResolvedValue([
      { key: "1111", createdDate: "2025-01-01T00:00:01Z", fileName: "a.png", filePath: "d1/" },
    ]);

    const output = await handler(DUMMY_EVENT);
    assert("data" in output, "Output should contain the file data");
    const files = output.data.files;
    expect(files.length).toBe(1);
    expect(files[0]).toMatchObject({ key: "1111" });
  });

  it("ignores unmatched DB results", async () => {
    vi.mocked(listAllS3Files).mockResolvedValue([
      { key: "2222", size: 11, lastModified: new Date(2) },
    ]);
    vi.mocked(scanAllFileDetailsRecords).mockResolvedValue([
      { key: "1111", createdDate: "2025-01-01T00:00:01Z", fileName: "a.png", filePath: "d1/" },
      { key: "2222", createdDate: "2025-01-01T00:00:02Z", fileName: "b.txt", filePath: "d2/" },
      { key: "3333", createdDate: "2025-01-01T00:00:03Z", fileName: "c.pdf", filePath: "d3/" },
    ]);

    const output = await handler(DUMMY_EVENT);
    assert("data" in output, "Output should contain the file data");
    const files = output.data.files;
    expect(files.length).toBe(1);
    expect(files[0]).toMatchObject({ key: "2222" });
  });

  it.each([
    [
      listAllS3Files.name,
      () => {
        vi.mocked(listAllS3Files).mockResolvedValue([]);
        vi.mocked(scanAllFileDetailsRecords).mockResolvedValue([
          { key: "1111", createdDate: "2025-01-01T00:00:01Z", fileName: "a.png", filePath: "d1/" },
        ]);
      },
    ],
    [
      scanAllFileDetailsRecords.name,
      () => {
        vi.mocked(listAllS3Files).mockResolvedValue([
          { key: "1111", size: 10, lastModified: new Date(1) },
        ]);
        vi.mocked(scanAllFileDetailsRecords).mockResolvedValue([]);
      },
    ],
  ])("returns nothing if %s returns nothing", async (_functionName, setupMocks) => {
    setupMocks();

    const output = await handler(DUMMY_EVENT);
    assert("data" in output, "Output should contain the file data");
    const files = output.data.files;
    expect(files.length).toBe(0);
  })

  it.each([
    [
      listAllS3Files.name,
      () => {
        vi.mocked(listAllS3Files).mockRejectedValue(new Error("DynamoDB error"));
        vi.mocked(scanAllFileDetailsRecords).mockResolvedValue([
          { key: "1111", createdDate: "2025-01-01T00:00:01Z", fileName: "a.png", filePath: "d1/" },
        ]);
      },
    ],
    [
      scanAllFileDetailsRecords.name,
      () => {
        vi.mocked(listAllS3Files).mockResolvedValue([
          { key: "1111", size: 10, lastModified: new Date(1) },
        ]);
        vi.mocked(scanAllFileDetailsRecords).mockRejectedValue(new Error("S3 error"));
      },
    ],
  ])("returns a 500 error if %s throws an error", async (_functionName, setupMocks) => {
    setupMocks();

    const output = await handler(DUMMY_EVENT);
    assert("statusCode" in output, "Output should contain a statusCode");
    expect(output.statusCode).toBe(500);
    expect("error" in JSON.parse(output.body!)).toBe(true);
  });
});
