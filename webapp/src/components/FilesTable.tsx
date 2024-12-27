import { DOWN_ARROW, FILE_ICON, IMAGE_ICON } from "@secure-cloud-files/webapp/src/utils/svgs";

interface Props {
  files: string[];
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
          {files.map((file) => (
            <tr className="hover" key={file}>
              <td className="text-nowrap">
                <span className="inline-block align-bottom pb-0.5">
                  {getFileTypeSvg(file)}
                </span>
                <span className="ml-2">
                  {file}
                </span>
              </td>
              <td>placeholder</td>
              <td>placeholder</td>
              <td>
                <button className="btn btn-circle btn-sm" title="Download file">
                  {DOWN_ARROW}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
