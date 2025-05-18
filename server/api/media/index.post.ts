import type { H3Event } from 'h3'
import { createError } from 'h3'
import { useMediaService } from '~~/server/services/media/mediaService'
import { validateFileUpload } from '~~/server/validators/file/validateFileUpload'

export default defineEventHandler(async (event: H3Event) => {
  const mediaService = useMediaService()

  try {
    const {
      fileBuffer,
      originalFilename,
      mimeType,
    } = await validateFileUpload(event)

    const result = await mediaService.uploadAndSaveImage({
      fileBuffer,
      originalFilename,
      mimeType,
    })

    return {
      message: 'File uploaded and reference saved',
      imageId: result.imageId,
    }
  }
  catch (error) {
    console.error('Error uploading file or saving reference:', error)

    return createError({
      statusCode: 500,
      statusMessage: 'Failed to upload file and save reference',
    })
  }
})
