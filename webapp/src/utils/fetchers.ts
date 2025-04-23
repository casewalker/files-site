const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

export const getPresignedDownloadLink = async (key: string): Promise<string> => {
  const searchParams = new URLSearchParams({ key });
  return fetch(`${API_GATEWAY_URL}/getPresignedDownloadLink?${searchParams}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Fetch response not OK, status: ${response.status}: ${response.statusText}`,
        );
      }
      return response.json();
    })
    .then((respJson) => respJson.data.url)
    .catch(reason => {
      // TODO turn this into an on-screen warning?
      throw new Error(`Failed to get presigned download link: ${JSON.stringify(reason)}`);
    });
};

export const getPresignedUploadLink = async (fileName: string, filePath: string): Promise<string> => {
  const searchParams = new URLSearchParams({ fileName, filePath });
  return fetch(`${API_GATEWAY_URL}/getPresignedUploadLink?${searchParams}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Fetch response not OK, status: ${response.status}: ${response.statusText}`,
        );
      }
      return response.json();
    })
    .then((respJson) => respJson.data.url)
    .catch(reason => {
      // TODO turn this into an on-screen warning?
      throw new Error(`Failed to get presigned upload link: ${JSON.stringify(reason)}`);
    });
};
