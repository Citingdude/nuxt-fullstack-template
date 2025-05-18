import type { StorageProvider } from '~~/server/providers/storage/useStorageProvider'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const localStorageProvider: StorageProvider = {
  async upload({ fileBuffer, filename }) {
    const uploadDir = './public/uploads'
    const filePath = join(uploadDir, filename)
    const url = `/uploads/${filename}`

    await mkdir(uploadDir, { recursive: true })
    await writeFile(filePath, fileBuffer)

    return { url, path: filePath }
  },

  async delete(path: string) {
    await unlink(path)
  },
}
