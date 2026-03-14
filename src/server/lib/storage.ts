/**
 * File storage — replaces Appwrite Storage with Vercel Blob.
 */

import { put, del, list } from '@vercel/blob'

export async function fileStorage() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN environment variable')
  }

  return {
    /** Upload a file and return the public URL + pathname */
    async create(
      _userId: string,
      file: Buffer,
      fileName: string,
      contentType?: string,
    ) {
      const blob = await put(fileName, file, {
        access: 'public',
        token,
        contentType,
      })
      return {
        $id: blob.pathname,
        url: blob.url,
      }
    },

    /** Get the URL for a file by pathname */
    async read(pathname: string) {
      // Vercel Blob URLs are already public — return the URL directly
      const blobs = await list({ prefix: pathname, token, limit: 1 })
      if (blobs.blobs.length === 0) {
        throw new Error(`File not found: ${pathname}`)
      }
      return blobs.blobs[0].url
    },

    /** Delete a file by its URL */
    async delete(url: string) {
      await del(url, { token })
    },

    /** List all files */
    async listFiles() {
      return list({ token })
    },
  }
}
