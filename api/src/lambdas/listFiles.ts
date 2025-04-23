import {
  scanAllFileDetailsRecords,
  listAllS3Files,
  type FileDetails,
} from "@secure-cloud-files/api/src/util/awsUtils";
import {
  type FileDetailsApiGatewayHandler,
  makeErrorResponse,
} from "@secure-cloud-files/src/util/constants";

// TODO Put lambdas behind a Cognito JWT Authorizer
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
