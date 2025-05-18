import type { StorageProvider } from '~~/server/providers/storage/useStorageProvider'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

export function useS3StorageProvider(): StorageProvider {
  const config = useRuntimeConfig()

  const s3 = new S3Client({
    region: 'auto',
    endpoint: config.s3Endpoint,
    credentials: {
      accessKeyId: config.s3AccessKey,
      secretAccessKey: config.s3SecretKey,
    },
  })
  const bucket = config.s3Bucket

  return {
    async upload({ fileBuffer, filename }) {
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        Body: fileBuffer,
        ACL: 'public-read',
      }))

      return {
        url: `${process.env.NUXT_S3_PUBLIC_URL}/${filename}`,
        path: filename,
      }
    },

    async delete(path: string) {
      await s3.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: path,
      }))
    },
  }
}
