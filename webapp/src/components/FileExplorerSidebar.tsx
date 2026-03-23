import type { JSX } from "react";
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
          <FileExplorerMenu files={files} />
          {/*<FileExplorerMenu files={[*/}
          {/*  {*/}
          {/*    type: S3ObjectType.DIRECTORY,*/}
          {/*    name: "directory1",*/}
          {/*    contents: [],*/}
          {/*    path: "directory1",*/}
          {/*  },*/}
          {/*  {*/}
          {/*    type: S3ObjectType.DIRECTORY,*/}
          {/*    name: "directory2",*/}
          {/*    path: "directory2",*/}
          {/*    contents: [*/}
          {/*      {*/}
          {/*        type: S3ObjectType.FILE,*/}
          {/*        name: "file1.txt",*/}
          {/*        lastModified: new Date("2020-01-01"),*/}
          {/*        size: 1024,*/}
          {/*        path: "directory2/file1.txt",*/}
          {/*      },*/}
          {/*      {*/}
          {/*        type: S3ObjectType.FILE,*/}
          {/*        name: "file2.txt",*/}
          {/*        lastModified: new Date("2020-01-02"),*/}
          {/*        size: 2048,*/}
          {/*        path: "directory2/file2.txt",*/}
          {/*      },*/}
          {/*    ],*/}
          {/*  },*/}
          {/*  {*/}
          {/*    type: S3ObjectType.DIRECTORY,*/}
          {/*    name: "directory3",*/}
          {/*    path: "directory3",*/}
          {/*    contents: [*/}
          {/*      {*/}
          {/*        type: S3ObjectType.FILE,*/}
          {/*        name: "file3.txt",*/}
          {/*        lastModified: new Date("2020-01-01"),*/}
          {/*        size: 111,*/}
          {/*        path: "directory3/file3.txt",*/}
          {/*      },*/}
          {/*      {*/}
          {/*        type: S3ObjectType.DIRECTORY,*/}
          {/*        name: "directory4",*/}
          {/*        path: "directory3/directory4",*/}
          {/*        contents: [*/}
          {/*          {*/}
          {/*            type: S3ObjectType.FILE,*/}
          {/*            name: "file4.txt",*/}
          {/*            lastModified: new Date("2020-01-03"),*/}
          {/*            size: 2000,*/}
          {/*            path: "directory3/directory4/file4.txt",*/}
          {/*          }*/}
          {/*        ]*/}
          {/*      },*/}
          {/*    ],*/}
          {/*  },*/}
          {/*  {*/}
          {/*    type: S3ObjectType.FILE,*/}
          {/*    name: "file5.txt",*/}
          {/*    lastModified: new Date("2020-01-04"),*/}
          {/*    size: 2048,*/}
          {/*    path: "file5.txt",*/}
          {/*  },*/}
          {/*]}/>*/}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
