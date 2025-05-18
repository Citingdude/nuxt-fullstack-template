// ~/server/services/media/useMediaService.ts
import type { Media, NewMedia } from '~~/server/db/schema/media'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createError } from 'h3'
import { useMediaRepository } from '~~/server/repositories/media/mediaRepository'

interface UploadAndSaveImageParams {
  fileBuffer: Buffer
  originalFilename: string
  mimeType?: string
}

export function useMediaService() {
  const mediaRepository = useMediaRepository()

  const getAllMedia = async (): Promise<Media[]> => {
    return mediaRepository.getAll()
  }

  const uploadAndSaveImage = async (params: UploadAndSaveImageParams): Promise<{ imageId: number }> => {
    const { fileBuffer, originalFilename, mimeType } = params

    const newFilename = `${Date.now()}-${originalFilename}`
    const uploadDir = './public/uploads'
    const filePath = join(uploadDir, newFilename)
    const url = `/uploads/${newFilename}`

    try {
      await mkdir(uploadDir, { recursive: true })
    }
    catch (mkdirError: any) {
      if (mkdirError.code !== 'EEXIST') {
        console.error('Error creating upload directory:', mkdirError)
        throw createError({ statusCode: 500, statusMessage: 'Failed to create upload directory' })
      }
    }

    await writeFile(filePath, fileBuffer)

    const imageData: NewMedia = {
      filename: newFilename,
      originalFilename,
      mimeType,
      filePath,
      url,
      size: fileBuffer.length,
    }

    const newImageId = await mediaRepository.insert(imageData)

    return {
      imageId: newImageId.id,
    }
  }

  const deleteMediaById = async (id: number): Promise<void> => {
    const mediaItem = await mediaRepository.findById(id)

    if (!mediaItem) {
      throw createError({ statusCode: 404, statusMessage: 'Media not found' })
    }

    try {
      if (mediaItem.filePath) {
        await unlink(mediaItem.filePath)
      }
    }
    catch (fsError) {
      console.warn('Failed to delete file from filesystem:', fsError)
    }

    await mediaRepository.deleteById(id)
  }

  return {
    getAllMedia,
    uploadAndSaveImage,
    deleteMediaById,
  }
}
