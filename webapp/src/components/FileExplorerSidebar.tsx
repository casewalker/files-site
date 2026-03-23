import type { JSX } from "react";
import { useState } from "react";
import type { MyFileSystem } from "#utils/s3FileTypes.ts";
import { useIsMobile } from "#hooks/use-mobile.ts";
import FileExplorerMenu from "#components/FileExplorerMenu.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from "#components/shadcn/Sidebar.tsx";

interface Props {
  files: MyFileSystem[];
}

export default function FileExplorerSidebar({ files }: Props): JSX.Element {
  const isMobile = useIsMobile();
  const [openDirs, setOpenDirs] = useState<Set<string>>(new Set());

  const toggleDirectoryState = (pathToDirectory: string): void => {
    const nextDirectoryStates = new Set(openDirs);
    if (openDirs.has(pathToDirectory)) {
      nextDirectoryStates.delete(pathToDirectory);
    } else {
      nextDirectoryStates.add(pathToDirectory);
    }
    setOpenDirs(nextDirectoryStates);
  };

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "none"}>
      <SidebarHeader className="h-16 flex-row items-center border-b bg-background px-6">
        <a
          href="/"
          className="btn btn-ghost w-fit text-xl font-semibold hover:bg-muted"
          title="Home directory"
        >
          SecureCloudFiles
        </a>
      </SidebarHeader>
      <SidebarContent className="pl-4 pr-2 pt-2">
        <SidebarMenu className="gap-1">
          <FileExplorerMenu files={files} openDirs={openDirs} toggleDir={toggleDirectoryState} />
          {/*<FileExplorerMenu*/}
          {/*  openDirs={openDirs}*/}
          {/*  toggleDir={toggleDirectoryState}*/}
          {/*  files={[*/}
          {/*    {*/}
          {/*      type: ObjectType.DIRECTORY,*/}
          {/*      directoryName: "directory1",*/}
          {/*      contents: [],*/}
          {/*      pathToDirectory: "directory1",*/}
          {/*    },*/}
          {/*    {*/}
          {/*      type: ObjectType.DIRECTORY,*/}
          {/*      directoryName: "directory2",*/}
          {/*      pathToDirectory: "directory2",*/}
          {/*      contents: [*/}
          {/*        {*/}
          {/*          type: ObjectType.FILE,*/}
          {/*          key: "directory2/file1.txt",*/}
          {/*          fileName: "file1.txt",*/}
          {/*          createdDate: new Date("2020-01-01").toISOString(),*/}
          {/*          size: 1024,*/}
          {/*          filePath: "directory2/file1.txt",*/}
          {/*        },*/}
          {/*        {*/}
          {/*          type: ObjectType.FILE,*/}
          {/*          key: "directory2/file2.txt",*/}
          {/*          fileName: "file2.txt",*/}
          {/*          createdDate: new Date("2020-01-02").toISOString(),*/}
          {/*          size: 2048,*/}
          {/*          filePath: "directory2/file2.txt",*/}
          {/*        },*/}
          {/*      ],*/}
          {/*    },*/}
          {/*    {*/}
          {/*      type: ObjectType.DIRECTORY,*/}
          {/*      directoryName: "directory3",*/}
          {/*      pathToDirectory: "directory3",*/}
          {/*      contents: [*/}
          {/*        {*/}
          {/*          type: ObjectType.FILE,*/}
          {/*          key: "directory3/file3.txt",*/}
          {/*          fileName: "file3.txt",*/}
          {/*          createdDate: new Date("2020-01-01").toISOString(),*/}
          {/*          size: 111,*/}
          {/*          filePath: "directory3/file3.txt",*/}
          {/*        },*/}
          {/*        {*/}
          {/*          type: ObjectType.DIRECTORY,*/}
          {/*          directoryName: "directory4",*/}
          {/*          pathToDirectory: "directory3/directory4",*/}
          {/*          contents: [*/}
          {/*            {*/}
          {/*              type: ObjectType.FILE,*/}
          {/*              key: "directory3/directory4/file4.txt",*/}
          {/*              fileName: "file4.txt",*/}
          {/*              createdDate: new Date("2020-01-03").toISOString(),*/}
          {/*              size: 2000,*/}
          {/*              filePath: "directory3/directory4/file4.txt",*/}
          {/*            },*/}
          {/*          ],*/}
          {/*        },*/}
          {/*      ],*/}
          {/*    },*/}
          {/*    {*/}
          {/*      type: ObjectType.FILE,*/}
          {/*      key: "file5.txt",*/}
          {/*      fileName: "file5.txt",*/}
          {/*      createdDate: new Date("2020-01-04").toISOString(),*/}
          {/*      size: 2048,*/}
          {/*      filePath: "file5.txt",*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*/>*/}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
