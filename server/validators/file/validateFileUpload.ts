import type { H3Event } from 'h3'
import { createError, readMultipartFormData } from 'h3'

export async function validateFileUpload(event: H3Event) {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No files uploaded',
    })
  }

  const fileData = formData.find(item => item.name === 'file')

  if (!fileData || !fileData.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file found with the name "file"',
    })
  }

  if (!fileData.filename) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File must have a filename',
    })
  }

  return {
    fileBuffer: fileData.data,
    originalFilename: fileData.filename,
    mimeType: fileData.type,
  }
}
