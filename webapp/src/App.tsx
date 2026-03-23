import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useIsMobile } from "#hooks/use-mobile.ts";
import FileExplorerSidebar from "#components/FileExplorerSidebar.tsx";
import Breadcrumbs from "#components/Breadcrumbs.tsx";
import FilesTable from "#components/FilesTable.tsx";
import NavBarButtons from "#components/NavBarButtons.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "#components/shadcn/Sidebar.tsx";
import { TooltipProvider } from "#components/shadcn/Tooltip.tsx";
import type { MyFileSystem } from "#utils/s3FileTypes.ts";
import { listAllFiles } from "#utils/fetchers.ts";

export default function App(): JSX.Element {
  const isMobile = useIsMobile();
  const [allFiles, setAllFiles] = useState<MyFileSystem[] | undefined>(undefined);
  useEffect(() => {
    if (window !== undefined) {
      listAllFiles()
        .then((files) => {
          console.log(`Got files! ${JSON.stringify(files)}`);
          setAllFiles(files);
        })
        .catch((reason) => {
          console.log(`Error fetching: ${reason}`);
        });
    }
  }, []);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <FileExplorerSidebar files={allFiles ?? []} />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background px-4">
            {isMobile && <SidebarTrigger />}
            <NavBarButtons />
          </header>
          <main className="px-8 pt-4 pb-12 max-w-7xl">
            <Breadcrumbs directoryLocations={["example1", "example2", "example3"]} />
            {/*TODO: Make this a single directory of file system data, also fixup breadcrumbs */}
            <FilesTable files={allFiles ?? []} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
