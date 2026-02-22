/**
 * Programmatic file download — conjures a temporary anchor,
 * clicks it, and destroys the evidence. Used instead of a visible <a>
 * because the download triggers from a button context, not a link.
 *
 * @param {string} href - URL to the file (absolute or Vite-resolved asset path)
 * @param {string} filename - Suggested download filename
 * @param {string} [mimeType='application/pdf'] - MIME type hint for the browser
 */
export function triggerDownload(href, filename, mimeType = 'application/pdf') {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  link.type = mimeType
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
