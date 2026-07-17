import { client } from './client'

// Server-stored documents need the auth header, so a plain <a href> can't fetch them —
// pull the blob through the authenticated client and hand it to the browser as a download.
export async function downloadFile(url: string, fallbackName: string): Promise<void> {
  const res = await client.get<Blob>(url, { responseType: 'blob' })
  const disposition = (res.headers['content-disposition'] as string | undefined) ?? ''
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? fallbackName
  const objectUrl = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = filename
  a.click()
  URL.revokeObjectURL(objectUrl)
}

// Server-served document urls are API paths; external links are absolute.
export const isServedDocument = (url: string) => url.startsWith('/')
