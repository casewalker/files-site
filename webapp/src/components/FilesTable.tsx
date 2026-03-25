import type { JSX } from "react";
import { FILE_ICON, FOLDER_ICON, IMAGE_ICON } from "#utils/svgs.tsx";
import { ObjectType } from "#utils/s3FileTypes.ts";
import type { MyFileSystem } from "#utils/s3FileTypes.ts";
import DownloadButton from "#components/DownloadButton.tsx";

interface Props {
  files: MyFileSystem[];
}

const IMG_EXTENSIONS = new Set([
  "arw",
  "bmp",
  "cr2",
  "dib",
  "eps",
  "gif",
  "heic",
  "heif",
  "j2k",
  "jp2",
  "jpg",
  "jpeg",
  "jpf",
  "jpm",
  "jpx",
  "k25",
  "mj2",
  "nef",
  "nrw",
  "orf",
  "png",
  "psd",
  "raw",
  "sr2",
  "svg",
  "svgz",
  "tif",
  "tiff",
  "webp",
]);

const getFileTypeSvg = (filename: string): JSX.Element => {
  const extension = filename.replaceAll(/.*\./g, "").toLowerCase();
  return IMG_EXTENSIONS.has(extension) ? IMAGE_ICON : FILE_ICON;
};

const TH_CLASSES = "h-10 px-4 text-left align-middle font-medium text-muted-foreground";
const TR_CLASSES = "border-b border-border/30 last:border-0 transition-colors hover:bg-muted/50";
const TD_CLASSES = "p-4 align-middle";

export default function FilesTable({ files }: Props): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="w-full caption-bottom text-sm">
        <thead>
          <tr className="border-b border-border/60">
            <th className={`${TH_CLASSES} pl-10`}>Name</th>
            <th className={TH_CLASSES}>Created</th>
            <th className={TH_CLASSES}>Modified</th>
            <th className={TH_CLASSES}>Download</th>
          </tr>
        </thead>
        <tbody data-testid="files-table-body">
          {files.map((file) => {
            switch (file.type) {
              case ObjectType.FILE:
                return (
                  <tr className={TR_CLASSES} key={file.key}>
                    <td className={`${TD_CLASSES} text-nowrap`}>
                      <span className="inline-block align-bottom pb-0.5">
                        {getFileTypeSvg(file.fileName)}
                      </span>
                      <span className="ml-2">{file.fileName}</span>
                    </td>
                    <td className={TD_CLASSES}>{file.createdDate}</td>
                    <td className={TD_CLASSES}>{file.lastModified}</td>
                    <td className={TD_CLASSES}>
                      <DownloadButton fileKey={file.key} />
                    </td>
                  </tr>
                );
              case ObjectType.DIRECTORY:
                return (
                  <tr className={TR_CLASSES} key={file.pathToDirectory + file.directoryName}>
                    <td className={`${TD_CLASSES} text-nowrap`}>
                      <span className="inline-block align-bottom pb-0.5">{FOLDER_ICON}</span>
                      <span className="ml-2">{file.directoryName}</span>
                    </td>
                    <td className={TD_CLASSES}>--</td>
                    <td className={TD_CLASSES}>--</td>
                    <td className={TD_CLASSES}></td>
                  </tr>
                );
              default:
                return (
                  <tr className={TR_CLASSES}>
                    <td className={TD_CLASSES}></td>
                    <td className={TD_CLASSES}>--</td>
                    <td className={TD_CLASSES}>--</td>
                    <td className={TD_CLASSES}></td>
                  </tr>
                );
            }
          })}
        </tbody>
      </table>
    </div>
  );
}
