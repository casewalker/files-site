import {
  ListObjectsV2Command,
  type ListObjectsV2CommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

interface PartialS3Object {
  key: string;
  lastModified?: Date;
  size?: number;
}

const BUCKET = process.env.FILES_BUCKET_NAME;
const s3Client = new S3Client({ region: "us-west-2" });

// TODO Put lambdas behind a Cognito JWT Authorizer, add metadata in DynamoDB
export const handler = async (): Promise<PartialS3Object[]> => {
  const commandInput: ListObjectsV2CommandInput = { Bucket: BUCKET };
  const allFiles: PartialS3Object[] = [];

  do {
    const output = await s3Client.send(new ListObjectsV2Command(commandInput));
    if (output.Contents != undefined) {
      const outputFiles: PartialS3Object[] = output.Contents
        .filter((obj) => obj.Key != undefined)
        .map((obj) => ({ key: obj.Key!, size: obj.Size, lastModified: obj.LastModified}));
      allFiles.push(...outputFiles);
    }
    commandInput.ContinuationToken = output.IsTruncated ? output.NextContinuationToken : undefined;
  } while (commandInput.ContinuationToken != undefined);

  return allFiles;
};
