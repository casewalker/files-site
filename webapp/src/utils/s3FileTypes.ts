export enum S3ObjectType {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}

export interface S3File {
  type: S3ObjectType.FILE;
  name: string;
  lastModified: Date;
  size: number;
}

export interface S3Directory {
  type: S3ObjectType.DIRECTORY;
  name: string;
  contents: S3Object[];
}

export type S3Object = S3File | S3Directory;
