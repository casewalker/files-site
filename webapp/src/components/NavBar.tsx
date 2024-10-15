import { FOLDER_ICON_LARGER, LOGOUT_ICON, NEW_FILE_ICON } from "@/utils/svgs";

export default function NavBar() {
  return (
    <nav className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">SecureCloudFiles</a>
        </div>
        <div className="flex-none">
          <div className="flex gap-24">
            <div className="flex gap-4">
              <button className="btn">
                {FOLDER_ICON_LARGER}
                New Folder
              </button>
              <button className="btn">
                {NEW_FILE_ICON}
                Upload File
              </button>
            </div>
            <button className="btn btn-outline">
              {LOGOUT_ICON}
              Log out
            </button>
          </div>
        </div>
    </nav>
  );
}
