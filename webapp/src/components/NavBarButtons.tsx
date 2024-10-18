import { FOLDER_ICON_LARGER, LOGOUT_ICON, NEW_FILE_ICON } from "@/utils/svgs";

export default function NavBarButtons() {
  return (
    <div className="navbar bg-base-100 w-full">
        <div className="flex-none w-full">
          <div className="flex gap-24 w-full justify-end">
            <div className="flex gap-4">
              <button className="btn">
                {FOLDER_ICON_LARGER}
                New Folder
              </button>
              <button className="btn">
                {NEW_FILE_ICON}
                Upload Files
              </button>
            </div>
            <button className="btn btn-outline">
              {LOGOUT_ICON}
              Log out
            </button>
          </div>
        </div>
    </div>
  );
}
