import { scanAllFileDetailsRecords, listAllS3Files } from "#util/awsUtils.ts";
import type { FileDetails } from "#util/awsUtils.ts";
import { makeErrorResponse } from "#util/constants.ts";
import type { FileDetailsApiGatewayHandler } from "#util/constants.ts";

// TODO: Put lambdas behind a Cognito JWT Authorizer
export const handler: FileDetailsApiGatewayHandler = async (_event) => {
  try {
    const s3Files = await listAllS3Files();
    const fileDetailsRecords = await scanAllFileDetailsRecords();

    const fileDetailsDictionary = Object.fromEntries(
      fileDetailsRecords.map((record) => [record.key, record]),
    );

    const allFiles: FileDetails[] = [];
    for (const s3File of s3Files) {
      if (s3File.key in fileDetailsDictionary) {
        const fileDetailsRecord = fileDetailsDictionary[s3File.key];
        allFiles.push({ ...s3File, ...fileDetailsRecord });
      }
    }

    console.info("File details", allFiles);
    return { data: { files: allFiles } };
  } catch (e) {
    console.error("Error while getting all files", e);
    return makeErrorResponse(500, "An error occurred while getting the list of files");
  }
};
