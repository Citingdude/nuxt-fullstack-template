import type { Media, NewMedia } from '~~/server/db/schema/media'
import type { MediaRepository } from '~~/server/repositories/media/mediaRepository'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createError } from 'h3'

interface UploadAndSaveImageParams {
  fileBuffer: Buffer
  originalFilename: string
  mimeType?: string
}

export class MediaService {
  private mediaRepository: MediaRepository

  constructor(mediaRepository: MediaRepository) {
    this.mediaRepository = mediaRepository
  }

  async getAllMedia(): Promise<Media[]> {
    return this.mediaRepository.getAll()
  }

  async uploadAndSaveImage(params: UploadAndSaveImageParams): Promise<{ imageId: number }> {
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

    const newImageId = await this.mediaRepository.insert(imageData)

    return {
      imageId: newImageId.id,
    }
  }
}
