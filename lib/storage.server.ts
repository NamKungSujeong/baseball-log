const STORAGE_API_URL =
  "https://api.justdeploy.net/organizations/dmtbdpxccy3uowip/storages/afblmek2s5h7whtz";
const STORAGE_HEADERS = {
  "X-Access-Key": "REMOVED_ACCESS_KEY",
  "X-Secret-Key": "REMOVED_SECRET_KEY",
  "Content-Type": "application/json",
};

export async function uploadToStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<string> {
  const res = await fetch(`${STORAGE_API_URL}/files`, {
    method: "POST",
    headers: STORAGE_HEADERS,
    body: JSON.stringify({ files: [{ name: filename, mime: mimeType }] }),
  });
  const { files } = await res.json();
  const { id, url } = files[0];

  await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: new Uint8Array(buffer),
  });

  return id;
}

export async function getStorageUrl(fileId: string): Promise<string> {
  const res = await fetch(`${STORAGE_API_URL}/files/${fileId}`, {
    headers: STORAGE_HEADERS,
  });
  const { file } = await res.json();
  return file.url;
}

export async function deleteFromStorage(fileId: string): Promise<void> {
  await fetch(`${STORAGE_API_URL}/files/${fileId}`, {
    method: "DELETE",
    headers: STORAGE_HEADERS,
  });
}

/** Returns true if the photo value is a storage file ID (not a legacy base64 string) */
export function isStorageId(photo: string): boolean {
  return !photo.startsWith("data:");
}
