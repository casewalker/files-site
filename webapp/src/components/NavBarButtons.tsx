import type { JSX } from "react";
import { NEW_FOLDER_ICON, LOGOUT_ICON } from "#utils/svgs.tsx";
import FileInputButton from "#components/FileInputButton.tsx";
import { Button } from "#components/shadcn/Button.tsx";

export default function NavBarButtons(): JSX.Element {
  return (
    <nav className="flex w-full items-center">
      <div className="flex-none w-full">
        <div className="flex gap-24 w-full justify-end">
          <div className="flex gap-4 items-center">
            <Button variant="outline" size="lg" title="Create new folder" id="NewFolderButton">
              {NEW_FOLDER_ICON}
              <span className="hidden invisible sm:inline sm:visible">New Folder</span>
            </Button>
            <FileInputButton />
          </div>
          <Button variant="outline-invert" size="lg" title="Sign out" id="SignOutButton">
            {LOGOUT_ICON}
            <span className="hidden invisible sm:inline sm:visible">Sign Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
