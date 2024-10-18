import { type S3Object, S3ObjectType } from "@/utils/s3FileTypes";
import { FOLDER_ICON_FOR_MENU } from "@/utils/svgs";

interface Props {
  files: S3Object[];
}

export default function FileExplorerMenu({ files }: Props) {
  return (
    <>
      {files.map((s3Object) => {
        switch (s3Object.type) {
          case S3ObjectType.DIRECTORY:
            return (
              <li key={s3Object.path}>
                <details>
                  <summary>
                    {FOLDER_ICON_FOR_MENU}
                    {s3Object.name}
                  </summary>
                  <ul>
                    {(s3Object.contents.length !== 0) ? (
                      <FileExplorerMenu files={s3Object.contents} />
                    ) : (
                      <li
                        key={`${s3Object.path}/empty-placeholder`}
                        className="italic textarea-disabled pb-2"
                      >
                        (empty folder)
                      </li>
                    )}
                  </ul>
                </details>
              </li>
            );
          case S3ObjectType.FILE:
            return (
              <li
                key={s3Object.path}
                className="py-2"
              >
                {s3Object.name}
              </li>
            );
        }
      })}
    </>
  );
};
