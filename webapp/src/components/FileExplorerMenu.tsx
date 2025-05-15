import { type MyFileSystem, ObjectType } from "@secure-cloud-files/webapp/src/utils/s3FileTypes";
import { FOLDER_ICON_FOR_MENU } from "@secure-cloud-files/webapp/src/utils/svgs";

interface Props {
  files: MyFileSystem[];
}

export default function FileExplorerMenu({ files }: Props) {
  return (
    <ul>
      {files.map((object) => {
        switch (object.type) {
          case ObjectType.DIRECTORY:
            return (
              <li key={object.pathToDirectory + object.directoryName}>
                <details>
                  <summary className="gap-1">
                    {FOLDER_ICON_FOR_MENU}
                    {object.directoryName}
                  </summary>
                  {(object.contents.length > 0) ? (
                    <FileExplorerMenu files={object.contents} />
                  ) : (
                    <ul>
                      <li
                        className="italic text-base-content/58 pb-2 pl-4"
                        key={`${object.pathToDirectory}/empty-placeholder`}
                      >
                        (empty folder)
                      </li>
                    </ul>
                  )}
                </details>
              </li>
            );
          case ObjectType.FILE:
            return (
              <li key={object.filePath} className="py-2 pl-4">
                {object.fileName}
              </li>
            );
        }
      })}
    </ul>
  );
};
