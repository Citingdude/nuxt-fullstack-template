import type { H3Event } from 'h3'
import { createError } from 'h3'
import { MediaRepository } from '~~/server/repositories/media/mediaRepository'
import { MediaService } from '~~/server/services/media/mediaService'

const mediaRepository = new MediaRepository()
const mediaService = new MediaService(mediaRepository)

export default defineEventHandler(async (event: H3Event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    return createError({
      statusCode: 404,
      statusMessage: 'No ID provided',
    })
  }

  try {
    mediaService.deleteMediaById(Number.parseInt(id))

    return { message: 'File deleted and reference saved' }
  }
  catch (error) {
    console.error(error)

    return createError({
      statusCode: 500,
      statusMessage: 'Failed to delete files',
    })
  }
})
