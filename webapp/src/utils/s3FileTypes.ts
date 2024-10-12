enum S3ObjectType {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}

export interface S3File {
  name: string;
  type: S3ObjectType.FILE;
  lastModified: Date;
  size: number;
}

export interface S3Directory {
  name: string;
  type: S3ObjectType.DIRECTORY;
  contents: S3Object;
}

export type S3Object = S3File | S3Directory;
