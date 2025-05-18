// ~/server/services/media/useMediaService.ts
import type { Media, NewMedia } from '~~/server/db/schema/media'
import { createError } from 'h3'
import { useStorageProvider } from '~~/server/providers/storage/useStorageProvider'
import { useMediaRepository } from '~~/server/repositories/media/mediaRepository'

interface UploadAndSaveImageParams {
  fileBuffer: Buffer
  originalFilename: string
  mimeType?: string
}

export function useMediaService() {
  const mediaRepository = useMediaRepository()
  const storage = useStorageProvider()

  const getAllMedia = async (): Promise<Media[]> => {
    return mediaRepository.getAll()
  }

  const uploadAndSaveImage = async (params: UploadAndSaveImageParams): Promise<{ imageId: number }> => {
    const newFilename = `${Date.now()}-${params.originalFilename}`

    const { url, path } = await storage.upload({ fileBuffer: params.fileBuffer, filename: newFilename })

    const imageData: NewMedia = {
      filename: newFilename,
      originalFilename: params.originalFilename,
      mimeType: params.mimeType,
      filePath: path,
      url,
      size: params.fileBuffer.length,
    }

    const newImageId = await mediaRepository.insert(imageData)

    return {
      imageId: newImageId.id,
    }
  }

  const deleteMediaById = async (id: number): Promise<void> => {
    const media = await mediaRepository.findById(id)
    if (!media)
      throw createError({ statusCode: 404, statusMessage: 'Not found' })

    await storage.delete(media.filePath!)
    await mediaRepository.deleteById(id)
  }

  return {
    getAllMedia,
    uploadAndSaveImage,
    deleteMediaById,
  }
}
