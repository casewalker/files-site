import { FileDetails } from "@secure-cloud-files/api/src/util/awsUtils";

export enum ObjectType {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
};

export type FileObject = { type: ObjectType.FILE } & FileDetails;

export type DirectoryObject = {
  type: ObjectType.DIRECTORY;
  pathToDirectory: string;
  directoryName: string;
  contents: MyFileSystem[];
};

export type MyFileSystem = FileObject | DirectoryObject;
