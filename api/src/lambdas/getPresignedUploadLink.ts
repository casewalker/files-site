import {
  createFileDetailsRecord,
  deleteFileDetailsRecord,
  getPresignedS3UploadLink,
} from "@secure-cloud-files/src/util/awsUtils";
import {
  makeErrorResponse,
  type PresignedUrlApiGatewayHandler,
} from "@secure-cloud-files/src/util/constants";
import { randomUUID } from "node:crypto";

const createFileKey = (date: Date): string => `${date.getTime()}|${randomUUID()}`;

export const handler: PresignedUrlApiGatewayHandler = async (event) => {
  if (event.queryStringParameters == null) {
    return makeErrorResponse(400,"Event must have query string parameters");
  }

  const { fileName, filePath } = event.queryStringParameters;
  if (fileName == null || fileName.trim() === "" || filePath == null || filePath.trim() === "") {
    return makeErrorResponse(
      400,
      `Parameters must include non-empty fileName and filePath, got: ${JSON.stringify(event.queryStringParameters)}`,
    );
  }

  const now = new Date();
  const fileKey = createFileKey(now);
  try {
    await createFileDetailsRecord({
      key: fileKey,
      createdDate: now.toISOString(),
      fileName,
      filePath,
    });
    const link = await getPresignedS3UploadLink(fileKey);

    console.info(`handler: Created upload link for ${fileName} with key ${fileKey}`);
    return { data: { url: link } };

  } catch (e) {
    console.error("Error while creating upload URL", e);
    try {
      await deleteFileDetailsRecord(fileKey);
    } catch (e2) {
      console.error("Error while trying to cleanup FileDetailsRecord", e2);
    }

    return makeErrorResponse(500, "An error occurred while getting the upload URL");
  }
};
