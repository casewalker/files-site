import type { FileDetails } from "@secure-cloud-files/api/util/awsUtils.ts";

export enum ObjectType {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}

export type FileObject = { type: ObjectType.FILE } & FileDetails;

export type DirectoryObject = {
  type: ObjectType.DIRECTORY;
  pathToDirectory: string;
  directoryName: string;
  contents: MyFileSystem[];
};

export type MyFileSystem = FileObject | DirectoryObject;
