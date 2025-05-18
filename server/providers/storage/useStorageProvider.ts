import { localStorageProvider } from '~~/server/providers/storage/localStorageProvider'
import { useS3StorageProvider } from '~~/server/providers/storage/s3StorageProvider'

export interface StorageProvider {
  upload: (params: { fileBuffer: Buffer, filename: string }) => Promise<{ url: string, path: string }>
  delete: (path: string) => Promise<void>
}

export function useStorageProvider(): StorageProvider {
  const strategy = process.env.NUXT_STORAGE_PROVIDER || 'local'

  const s3StorageProvider = useS3StorageProvider()

  return strategy === 's3' ? s3StorageProvider : localStorageProvider
}
