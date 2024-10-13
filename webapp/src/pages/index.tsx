import Breadcrumbs from "@/components/Breadcrumbs";
import FileExplorerMenu from "@/components/FileExplorerMenu";
import FilesTable from "@/components/FilesTable";
import HeaderButtons from "@/components/HeaderButtons";
import { S3ObjectType } from "@/utils/s3FileTypes";
import { MENU_ICON } from "@/utils/svgs";

export default function Home() {
  return (
    <main>


      <div className="drawer lg:drawer-open">
        <input id="file-explorer-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">

          <HeaderButtons />
          <Breadcrumbs directoryLocations={["example1", "example2", "example3"]} />
          <FilesTable files={["image1.png", "file2.txt", "directory3"]} />

          <label
            aria-label="Open menu"
            htmlFor="file-explorer-drawer"
            className="btn btn-square btn-ghost drawer-button lg:hidden"
          >
            {MENU_ICON}
          </label>
        </div>

        <FileExplorerMenu files={[
          {
            type: S3ObjectType.DIRECTORY,
            name: "directory1",
            contents: [],
          },
          {
            type: S3ObjectType.DIRECTORY,
            name: "directory2",
            contents: [
              {
                type: S3ObjectType.FILE,
                name: "file1.txt",
                lastModified: new Date("2020-01-01"),
                size: 1024,
              },
              {
                type: S3ObjectType.FILE,
                name: "file2.txt",
                lastModified: new Date("2020-01-02"),
                size: 2048,
              },
            ],
          },
          {
            type: S3ObjectType.DIRECTORY,
            name: "directory3",
            contents: [
              {
                type: S3ObjectType.DIRECTORY,
                name: "directory4",
                contents: [
                  {
                    type: S3ObjectType.FILE,
                    name: "file3.txt",
                    lastModified: new Date("2020-01-03"),
                    size: 2000,
                  }
                ]
              },
            ],
          },
          {
            type: S3ObjectType.FILE,
            name: "file4.txt",
            lastModified: new Date("2020-01-04"),
            size: 2048,
          },
        ]}
        />
      </div>

    </main>
  );
}
