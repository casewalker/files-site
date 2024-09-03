import {
  ListObjectsV2Command,
  PutObjectCommand, S3Client,
} from "@aws-sdk/client-s3";

const S3_CLIENT = new S3Client();

export default async function handler(event, context) {
  // I guess this goes in a Lambda? And I can put the Lambda behind the Cognito Authorizer?
  const command1 = new ListObjectsV2Command({
    Bucket: "foo",
    Prefix: "bar",
    ContinuationToken: "baz",
  });
  await S3_CLIENT.send(command1);
  const command2 = new PutObjectCommand({
    Bucket: "foo",
    Key: "bar2",
  });
  await S3_CLIENT.send(command2);
};
