import { useRef } from "react";
import { DOWN_ARROW } from "@secure-cloud-files/webapp/src/utils/svgs";
import { getPresignedDownloadLink } from "@secure-cloud-files/webapp/src/utils/fetchers";

interface Props {
  fileKey: string;
}

export default function DownloadButton({ fileKey }: Props) {
  const downloadAnchorRef = useRef<HTMLAnchorElement | null>(null);

  const triggerFileDownload = (key: string) => {
    getPresignedDownloadLink(key)
      .then(async (downloadUrl) => {
        // TODO change so that this logs back to the app! (And below as well)
        if (downloadAnchorRef.current == null) {
          console.error("oops, null anchor?!")
        } else {
          downloadAnchorRef.current.href = downloadUrl;
          downloadAnchorRef.current.click();
        }
      })
      .catch(reason => console.error(`couldn't get download url: ${JSON.stringify(reason)}`));
  };

  return (
    <>
      <button
        className="btn btn-circle btn-sm"
        title="Download file"
        onClick={() => triggerFileDownload(fileKey)}
      >
        {DOWN_ARROW}
      </button>
      <a ref={downloadAnchorRef} className="hidden invisible" />
    </>
  );
};
