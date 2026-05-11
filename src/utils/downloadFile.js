/**
 * Triggers a browser file download from a Blob URL or any URL.
 * @param {string} url      - The blob/object URL to download.
 * @param {string} fileName - The filename the browser should suggest.
 */
export function downloadFile(url, fileName) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}