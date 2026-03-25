import type { JSX } from "react";
import { useRef } from "react";
import { DOWN_ARROW } from "#utils/svgs.tsx";
import { getPresignedDownloadLink } from "#utils/fetchers.ts";
import { Button } from "#components/shadcn/Button.tsx";

interface Props {
  fileKey: string;
}

export default function DownloadButton({ fileKey }: Props): JSX.Element {
  const downloadAnchorRef = useRef<HTMLAnchorElement | null>(null);

  const triggerFileDownload = (key: string): void => {
    getPresignedDownloadLink(key)
      .then(async (downloadUrl) => {
        // TODO: change so that this logs back to the app! (And below as well)
        if (downloadAnchorRef.current == null) {
          console.error("oops, null anchor?!");
        } else {
          downloadAnchorRef.current.href = downloadUrl;
          downloadAnchorRef.current.click();
        }
      })
      .catch((reason) => console.error(`couldn't get download url: ${JSON.stringify(reason)}`));
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon-md"
        className="rounded-full"
        title="Download file"
        onClick={() => triggerFileDownload(fileKey)}
      >
        {DOWN_ARROW}
      </Button>
      {/* This is a hidden programmatic download trigger, it is ok to break A11Y, it is not user-facing */}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */}
      <a ref={downloadAnchorRef} className="hidden invisible" download aria-hidden="true" />
    </>
  );
}
