import { NEW_FILE_ICON, FOLDER_ICON_LARGER } from "@/utils/svgs";


export default function HeaderButtons() {
  return (
    <div>
      <button className="btn">
        {FOLDER_ICON_LARGER}
        New Folder
      </button>
      <button className="btn">
        {NEW_FILE_ICON}
        Upload File
      </button>
    </div>
  );
};
