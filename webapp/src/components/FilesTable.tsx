import { FILE_ICON, FOLDER_ICON, IMAGE_ICON } from "@secure-cloud-files/webapp/src/utils/svgs";
import { type MyFileSystem, ObjectType } from "@secure-cloud-files/webapp/src/utils/s3FileTypes";
import DownloadButton from "@secure-cloud-files/webapp/src/components/DownloadButton";

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

const getFileTypeSvg = (filename: string) => {
  const extension = filename.replaceAll(/.*\./g, "").toLowerCase();
  return IMG_EXTENSIONS.has(extension) ? IMAGE_ICON : FILE_ICON;
};

export default function FilesTable({ files }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="pl-10">Name</th>
            <th>Created</th>
            <th>Modified</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            switch (file.type) {
              case ObjectType.FILE:
                return (
                  <tr className="hover" key={file.key}>
                    <td className="text-nowrap">
                      <span className="inline-block align-bottom pb-0.5">
                        {getFileTypeSvg(file.fileName)}
                      </span>
                      <span className="ml-2">
                        {file.fileName}
                      </span>
                    </td>
                    <td>{file.createdDate}</td>
                    <td>{file.lastModified}</td>
                    <td>
                      <DownloadButton fileKey={file.key}/>
                    </td>
                  </tr>
                );
              case ObjectType.DIRECTORY:
                return (
                  <tr className="hover" key={file.pathToDirectory + file.directoryName}>
                    <td className="text-nowrap">
                      <span className="inline-block align-bottom pb-0.5">
                        {FOLDER_ICON}
                      </span>
                      <span className="ml-2">
                        {file.directoryName}
                      </span>
                    </td>
                    <td>--</td>
                    <td>--</td>
                    <td></td>
                  </tr>
                );
              default:
                return (
                  <tr>
                    <td></td>
                    <td>--</td>
                    <td>--</td>
                    <td></td>
                  </tr>
                );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};
