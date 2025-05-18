import type { H3Event } from 'h3'
import { createError, readMultipartFormData } from 'h3'
import { useMediaService } from '~~/server/services/media/mediaService'

export default defineEventHandler(async (event: H3Event) => {
  const mediaService = useMediaService()

  try {
    const formData = await readMultipartFormData(event)

    if (!formData || formData.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No files uploaded' })
    }

    const fileData = formData.find(item => item.name === 'file')

    if (!fileData || !fileData.data) {
      throw createError({ statusCode: 400, statusMessage: 'No file found with the name "file"' })
    }

    const fileBuffer = fileData.data
    const originalFilename = fileData.filename
    const mimeType = fileData.type

    if (!originalFilename) {
      throw createError({ statusCode: 400, statusMessage: 'File must have a filename' })
    }

    const result = await mediaService.uploadAndSaveImage({ // Use the service
      fileBuffer,
      originalFilename,
      mimeType,
    })

    return { message: 'File uploaded and reference saved', imageId: result.imageId }
  }
  catch (error: any) {
    console.error('Error uploading file or saving reference:', error)
    return createError({ statusCode: 500, statusMessage: 'Failed to upload file and save reference' })
  }
})
