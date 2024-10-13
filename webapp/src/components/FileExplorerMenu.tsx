import { type S3Object, S3ObjectType } from "@/utils/s3FileTypes";
import { FOLDER_ICON_FOR_MENU } from "@/utils/svgs";

interface Props {
  files: S3Object[];
}

function FileExplorerMenuItems({ files }: Props) {
  return (
    <>
      {files.map((s3Object) => {
        switch (s3Object.type) {
          case S3ObjectType.DIRECTORY:
            return (
              <li>
                <details>
                  <summary>
                    {FOLDER_ICON_FOR_MENU}
                    {s3Object.name}
                  </summary>
                  <ul>
                    {(s3Object.contents.length !== 0) ? (
                      <FileExplorerMenuItems files={s3Object.contents} />
                    ) : (
                      <li className="italic textarea-disabled pb-2">
                        (empty folder)
                      </li>
                    )}
                  </ul>
                </details>
              </li>
            );
          case S3ObjectType.FILE:
            return (
              <li className="py-2">
                {s3Object.name}
              </li>
            );
        }
      })}
    </>
  );
}

export default function FileExplorerMenu({files}: Props) {
  return (
    <div className="drawer-side">
      <label
        htmlFor="file-explorer-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      />
      <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <ul className="menu bg-base-200 rounded-lg w-full max-w-xs">
          <FileExplorerMenuItems files={files} />
        </ul>
      </ul>
    </div>
  );
};
