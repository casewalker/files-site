export const DOWN_ARROW = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
    height="1.25rem"
    width="1.25rem"
    data-testid="downarrow-svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 5V19M12 19L6 13M12 19L18 13"
    />
  </svg>
);

export const FILE_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    height="1rem"
    width="1rem"
    data-testid="file-svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={"M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 " +
        "0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 " +
        ".621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"}
    />
  </svg>
);

const ALT_FOLDER_ICON_PATH = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
  />
);

export const FOLDER_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    height="1rem"
    width="1rem"
  >
    {ALT_FOLDER_ICON_PATH}
  </svg>
);

export const FOLDER_ICON_FOR_MENU = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    height="1rem"
    width="1rem"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={"M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 " +
        "1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 " +
        "18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"}
    />
  </svg>
);

export const IMAGE_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    height="1rem"
    width="1rem"
    data-testid="image-svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={"M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 " +
        "013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 " +
        "002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 " +
        ".375.375 0 01.75 0z"}
    />
  </svg>
);

export const LOGOUT_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    stroke="currentColor"
    viewBox="0 0 20 32"
    height="1.5rem"
    width="1.5rem"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={"M0 9.875v12.219c0 1.125 0.469 2.125 1.219 2.906 0.75 0.75 1.719 1.156 2.844 " +
        "1.156h6.125v-2.531h-6.125c-0.844 0-1.5-0.688-1.5-1.531v-12.219c0-0.844 0.656-1.5 " +
        "1.5-1.5h6.125v-2.563h-6.125c-1.125 0-2.094 0.438-2.844 1.188-0.75 0.781-1.219 1.75-1.219 " +
        "2.875zM6.719 13.563v4.875c0 0.563 0.5 1.031 1.063 1.031h5.656v3.844c0 0.344 0.188 0.625 0.5 0.781 " +
        "0.125 0.031 0.25 0.031 0.313 0.031 0.219 0 0.406-0.063 0.563-0.219l7.344-7.344c0.344-0.281 " +
        "0.313-0.844 0-1.156l-7.344-7.313c-0.438-0.469-1.375-0.188-1.375 0.563v3.875h-5.656c-0.563 0-1.063 " +
        "0.469-1.063 1.031z"}
    />
  </svg>
);

export const MENU_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    height="1.25rem"
    width="1.25rem"
    // className="inline-block md:h-6 md:w-6" TODO see if we can style height + width instead of using attrs?
    className="inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

export const NEW_FOLDER_ICON_LARGER = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    height="1.55rem"
    width="1.55rem"
  >
    {ALT_FOLDER_ICON_PATH}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9.5 13h5m-2.5-2.5v5m4 0 2z"
    />
  </svg>
);

export const X_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    height="1.2rem"
    width="1.2rem"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

export const UPLOAD_FILE_ICON_LARGER = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    height="1.5rem"
    width="1.5rem"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      d={"M13.5 3H12H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H7.5M13.5 3L19 8.625M13.5 " +
        "3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V9.75V12V19C19 20.1046 18.1046 21 17 " +
        "21H16.5"}
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      d="M12 21L12 13M12 13L14.5 15.5M12 13L9.5 15.5"
    />
  </svg>
);
