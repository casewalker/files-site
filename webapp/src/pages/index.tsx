import Breadcrumbs from "@/components/Breadcrumbs";
import FileExplorerMenu from "@/components/FileExplorerMenu";
import FilesTable from "@/components/FilesTable";
import NavBarButtons from "@/components/NavBarButtons";
import NavBarTitle from "@/components/NavBarTitle";
import { S3ObjectType } from "@/utils/s3FileTypes";
import { MENU_ICON } from "@/utils/svgs";

export default function Home() {
  const maxContentWidth = "max-w-7xl";
  return (
    <main>
      <div className="bg-base-100 drawer lg:drawer-open">
        <input id="file-explorer-drawer" type="checkbox" className="drawer-toggle"/>
        <div className="drawer-content">
          <nav
            className="bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full bg-opacity-90 backdrop-blur shadow-sm">
            <div className={`w-full ${maxContentWidth} h-full`}>
              <div className="w-full flex h-full">
                <div className="content-center">
                  <label
                    aria-label="Open menu"
                    htmlFor="file-explorer-drawer"
                    className="btn btn-square btn-ghost drawer-button lg:hidden self-start ml-2"
                  >
                    {MENU_ICON}
                  </label>
                </div>
                <NavBarButtons />
              </div>
            </div>
          </nav>
          <div className={`pl-8 pr-48 pt-4 ${maxContentWidth}`}>
            <Breadcrumbs directoryLocations={["example1", "example2", "example3"]}/>
            <FilesTable files={["image1.png", "file2.txt", "directory3"]}/>
          </div>
        </div>
        {/* Fixes the secondary color for the sidebar, but also breaks the toggle
        <div className="drawer-side z-40 scroll-smooth scroll-pt-20 min-h-full bg-base-200">*/}
        <div className="drawer-side z-40 scroll-smooth scroll-pt-20 min-h-full">
          <label
            htmlFor="file-explorer-drawer"
            aria-label="Close menu"
            className="drawer-overlay"
          />
          <div className="min-h-full">
            <header
              className="bg-base-100 sticky top-0 z-20 hidden items-center gap-2 px-4 py-2 backdrop-blur lg:flex shadow-sm">
              <NavBarTitle/>
            </header>
            <aside>
              <ul className="menu bg-base-200 w-80 text-base-content min-h-full p-4">
                <div
                  className="bg-base-100 lg:invisible lg:hidden font-title inline-flex text-lg md:text-2xl w-80 outline outline-base-100 outline-8 -translate-y-2 -translate-x-6 overflow-x-hidden">
                  <a className="btn btn-ghost text-xl translate-x-6">SecureCloudFiles</a>
                </div>
                <ul className="menu bg-base-200 w-full max-w-xs">
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
                          type: S3ObjectType.DIRECTORY,
                          name: "directory4",
                          path: "directory3/directory4",
                          contents: [
                            {
                              type: S3ObjectType.FILE,
                              name: "file3.txt",
                              lastModified: new Date("2020-01-03"),
                              size: 2000,
                              path: "directory3/directory4/file3.txt",
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
                      path: "file4.txt",
                    },
                  ]}/>
                </ul>
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
