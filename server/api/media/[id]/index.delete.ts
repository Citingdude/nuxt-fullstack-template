import type { H3Event } from 'h3'
import { createError } from 'h3'
import { useMediaService } from '~~/server/services/media/mediaService'

export default defineEventHandler(async (event: H3Event) => {
  const mediaService = useMediaService()

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
