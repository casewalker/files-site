import {
  getFileDetailsRecord,
  getPresignedS3DownloadLink,
} from "@secure-cloud-files/src/util/awsUtils";
import {
  makeErrorResponse,
  type PresignedUrlApiGatewayHandler,
} from "@secure-cloud-files/src/util/constants";

export const handler: PresignedUrlApiGatewayHandler = async (event) => {
  if (event.queryStringParameters == null) {
    return makeErrorResponse(400, "Event must have query string parameters");
  }

  const { key } = event.queryStringParameters;
  if (key == null || key.trim() === "") {
    return makeErrorResponse(
      400,
      `Parameters must include non-empty 'key', got: ${JSON.stringify(event.queryStringParameters)}`,
      );
  }

  try {
    const record = await getFileDetailsRecord(key);
    if (record == null) {
      return makeErrorResponse(400, `No corresponding file details found for ${key}`);
    }

    const link = await getPresignedS3DownloadLink(key, record.fileName);
    console.info(`handler: Created download link for file ${key}`);
    return {data: {url: link}};

  } catch (e) {
    console.error("Error while getting presigned download link", e);
    return makeErrorResponse(500, "An error occurred while getting the download URL");
  }
};
