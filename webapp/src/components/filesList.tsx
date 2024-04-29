interface Props {
  files: string[];
}

const IMAGE_SVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-4 h-4"
    data-testid="image-svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);

const FILE_SVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-4 h-4"
    data-testid="file-svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const FOLDER_SVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-4 h-4"
    data-testid="folder-svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
    />
  </svg>
);

const DOWN_ARROW = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="w-5 h-5"
    data-testid="downarrow-svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 5V19M12 19L6 13M12 19L18 13"
    />
  </svg>
);

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
  return IMG_EXTENSIONS.has(extension) ? IMAGE_SVG : FILE_SVG;
};

export default function FilesList({ files }: Props) {
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
