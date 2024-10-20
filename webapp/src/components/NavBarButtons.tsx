import { NEW_FOLDER_ICON_LARGER, LOGOUT_ICON, UPLOAD_FILE_ICON_LARGER } from "@/utils/svgs";

export default function NavBarButtons() {
  return (
    <nav className="navbar w-full">
        <div className="flex-none w-full">
          <div className="flex gap-24 w-full justify-end">
            <div className="flex gap-4">
              <button className="btn" title="Create new folder">
                {NEW_FOLDER_ICON_LARGER}
                <span className="hidden invisible sm:inline sm:visible">New Folder</span>
              </button>
              <button className="btn" title="Upload files">
                {UPLOAD_FILE_ICON_LARGER}
                Upload Files
              </button>
            </div>
            <button className="btn btn-outline" title="Log out">
              {LOGOUT_ICON}
              Log out
            </button>
          </div>
        </div>
    </nav>
  );
};
