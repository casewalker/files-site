import { makeErrorResponse } from "#util/constants.ts";

describe("required environment variables", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([["FILE_SYSTEM_TABLE"], ["FILES_BUCKET_NAME"], ["REGION"]])(
    "throws at import time when %s is missing",
    async (variableName) => {
      vi.resetModules();
      vi.stubEnv(variableName, "");

      await expect(import("#util/constants.ts")).rejects.toThrow(
        `Missing required environment variable: ${variableName}`,
      );
    },
  );

  it("exposes the environment values when all are present", async () => {
    vi.resetModules();

    const constants = await import("#util/constants.ts");
    expect(constants.FILE_SYSTEM_TABLE).toBe("FileSystemTable-test");
    expect(constants.S3_FILES_BUCKET).toBe("files-bucket-test");
    expect(constants.REGION).toBe("us-west-2");
  });
});

describe(makeErrorResponse, () => {
  it("builds a response with the status code and a JSON error body", () => {
    const response = makeErrorResponse(404, "Not found");
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body!)).toEqual({ error: "Not found" });
  });

  it("merges extra fields into the body", () => {
    const response = makeErrorResponse(409, "Name taken", { collision: "FILE" });
    expect(JSON.parse(response.body!)).toEqual({ error: "Name taken", collision: "FILE" });
  });
});
