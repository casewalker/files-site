import Breadcrumbs from "@secure-cloud-files/webapp/src/components/Breadcrumbs";
import FileExplorerMenu from "@secure-cloud-files/webapp/src/components/FileExplorerMenu";
import FilesTable from "@secure-cloud-files/webapp/src/components/FilesTable";
import NavBarButtons from "@secure-cloud-files/webapp/src/components/NavBarButtons";
import { S3ObjectType } from "@secure-cloud-files/webapp/src/utils/s3FileTypes";
import { MENU_ICON, X_ICON } from "@secure-cloud-files/webapp/src/utils/svgs";

export default function Home() {
  return (
    <div>
      <div className="drawer lg:drawer-open bg-base-100">
        <input
          className="drawer-toggle"
          id="file-explorer-drawer"
          type="checkbox"
        />
        <div className="drawer-content">
          <div className={"top-0 h-16 w-full z-30 flex bg-base-100 text-base-content sticky justify-center " +
              "bg-opacity-75 backdrop-blur-sm transition-shadow duration-100 shadow-sm " +
              "[transform:translate3d(0,0,0)]"}>
            <div className="w-full h-full max-w-7xl">
              <div className="w-full h-full flex">
                <div className="content-center">
                  <label
                    className="drawer-button btn btn-square btn-ghost lg:hidden self-start ml-2"
                    htmlFor="file-explorer-drawer"
                    aria-label="Open menu"
                    title="Open file menu"
                  >
                    {MENU_ICON}
                  </label>
                </div>
                <NavBarButtons />
              </div>
            </div>
          </div>
          <main className="px-8 lg:pr-16 pt-4 pb-12 max-w-7xl">
            <Breadcrumbs directoryLocations={["example1", "example2", "example3"]} />
            <FilesTable files={["image1.png", "file2.txt", "directory3"]} />
          </main>
        </div>
        <div className="drawer-side z-40">
          <label
            className="drawer-overlay"
            htmlFor="file-explorer-drawer"
            aria-label="Close menu"
          />
          <aside className={"w-80 min-h-full z-10 flex flex-col bg-base-100 text-base-content " +
            "scroll-smooth scroll-pt-20"}>
            <header className={"top-0 w-full h-16 z-20 gap-2 px-4 py-2 bg-base-100 sticky items-center " +
              "font-title text-lg md:text-2xl bg-opacity-75 backdrop-blur-sm transition-shadow " +
              "duration-100 shadow-sm [transform:translate3d(0,0,0)]"}>
              <a className="btn btn-ghost text-xl ml-6" title="Home directory">
                SecureCloudFiles
              </a>
              <label
                className={"drawer-overlay lg:hidden lg:invisible absolute opacity-55 right-2 " +
                  "btn btn-ghost btn-circle btn-sm"}
                htmlFor="file-explorer-drawer"
                aria-label="Close menu"
              >
                {X_ICON}
              </label>
            </header>
            <ul className="menu w-full max-w-xs bg-base-200 flex-grow">
              <FileExplorerMenu files={[
                {
                  type: S3ObjectType.DIRECTORY,
                  name: "directory1",
                  contents: [],
                  path: "directory1",
                },
                {
                  type: S3ObjectType.DIRECTORY,
                  name: "directory2",
                  path: "directory2",
                  contents: [
                    {
                      type: S3ObjectType.FILE,
                      name: "file1.txt",
                      lastModified: new Date("2020-01-01"),
                      size: 1024,
                      path: "directory2/file1.txt",
                    },
                    {
                      type: S3ObjectType.FILE,
                      name: "file2.txt",
                      lastModified: new Date("2020-01-02"),
                      size: 2048,
                      path: "directory2/file2.txt",
                    },
                  ],
                },
                {
                  type: S3ObjectType.DIRECTORY,
                  name: "directory3",
                  path: "directory3",
                  contents: [
                    {
                      type: S3ObjectType.FILE,
                      name: "file3.txt",
                      lastModified: new Date("2020-01-01"),
                      size: 111,
                      path: "directory3/file3.txt",
                    },
                    {
                      type: S3ObjectType.DIRECTORY,
                      name: "directory4",
                      path: "directory3/directory4",
                      contents: [
                        {
                          type: S3ObjectType.FILE,
                          name: "file4.txt",
                          lastModified: new Date("2020-01-03"),
                          size: 2000,
                          path: "directory3/directory4/file4.txt",
                        }
                      ]
                    },
                  ],
                },
                {
                  type: S3ObjectType.FILE,
                  name: "file5.txt",
                  lastModified: new Date("2020-01-04"),
                  size: 2048,
                  path: "file5.txt",
                },
              ]}/>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};
