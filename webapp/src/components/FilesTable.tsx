import { DOWN_ARROW, FILE_ICON, IMAGE_ICON } from "@/utils/svgs";

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
            <th></th>
            <th>Name</th>
            <th>Created</th>
            <th>Modified</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr className="hover" key={file}>
              <td>{getFileTypeSvg(file)}</td>
              <td>{file}</td>
              <td>placeholder</td>
              <td>placeholder</td>
              <td>
                <button className="btn btn-circle btn-sm">
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
