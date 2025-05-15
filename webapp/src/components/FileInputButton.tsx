import { type ChangeEvent, useRef } from "react";
import { UPLOAD_FILE_ICON_LARGER } from "@secure-cloud-files/webapp/src/utils/svgs";
import { getPresignedUploadLink } from "@secure-cloud-files/webapp/src/utils/fetchers";

export default function FileInputButton() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileInput = () => fileInputRef.current?.click();

  const uploadFile = (event: ChangeEvent<HTMLInputElement>) => {
   if (event.target.files != null) {
     // TODO Handle multiple files
     // TODO get filePath from the current page location
     // TODO Some kind of seeing the upload status?
     getPresignedUploadLink(event.target.files[0].name, "dir1/")
       .then(uploadUrl => {
         console.info("Upload URL:", uploadUrl);
         fetch(
         uploadUrl, {
           method: "PUT",
           body: event.target.files?.item(0)
         })
         },
       )
       .catch(reason => console.error("couldn't get upload url", reason));
   }
  };

  return (
    <>
      <input
        type="file"
        multiple
        name="fileUpload"
        id="fileUpload"
        className="hidden invisible"
        ref={fileInputRef}
        onChange={uploadFile}
      />
      <button
        className="btn"
        id="UploadFileButton"
        title="Upload files"
        onClick={triggerFileInput}
      >
        {UPLOAD_FILE_ICON_LARGER}
        <span className="hidden invisible sm:inline sm:visible">Upload Files</span>
      </button>
    </>
  );
}
