export enum S3ObjectType {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}

interface AbstractS3Object {
  type: S3ObjectType;
  name: string;
  path: string;
}

export interface S3File extends AbstractS3Object {
  type: S3ObjectType.FILE;
  lastModified: Date;
  size: number;
}

export interface S3Directory extends AbstractS3Object {
  type: S3ObjectType.DIRECTORY;
  contents: S3Object[];
}

export type S3Object = S3File | S3Directory;
