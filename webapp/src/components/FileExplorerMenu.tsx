import type { JSX } from "react";
import { useState } from "react";
import { Collapsible } from "radix-ui";
import { ChevronRightIcon, FolderIcon } from "lucide-react";
import { ObjectType } from "#utils/s3FileTypes.ts";
import type { MyFileSystem } from "#utils/s3FileTypes.ts";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "#components/shadcn/Sidebar.tsx";

interface Props {
  files: MyFileSystem[];
}

export default function FileExplorerMenu({ files }: Props): JSX.Element {
  return (
    <>
      {files.map((object) => {
        switch (object.type) {
          case ObjectType.DIRECTORY:
            return (
              <DirectoryItem
                key={object.pathToDirectory + object.directoryName}
                directory={object}
              />
            );
          case ObjectType.FILE:
            return (
              <SidebarMenuItem key={object.filePath + object.fileName}>
                <SidebarMenuButton>
                  <span>{object.fileName}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
        }
      })}
    </>
  );
}

function DirectoryItem({
  directory,
}: {
  directory: Extract<MyFileSystem, { type: ObjectType.DIRECTORY }>;
}): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenuItem>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger asChild>
          <SidebarMenuButton>
            <ChevronRightIcon className={`transition-transform ${open ? "rotate-90" : ""}`} />
            <FolderIcon />
            <span>{directory.directoryName}</span>
          </SidebarMenuButton>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <SidebarMenuSub>
            {directory.contents.length > 0 ? (
              <FileExplorerMenu files={directory.contents} />
            ) : (
              <span className="px-2 py-1 text-xs italic text-muted-foreground">(empty folder)</span>
            )}
          </SidebarMenuSub>
        </Collapsible.Content>
      </Collapsible.Root>
    </SidebarMenuItem>
  );
}
