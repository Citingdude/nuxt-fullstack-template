import { MediaRepository } from '~~/server/repositories/media/mediaRepository'
import { MediaService } from '~~/server/services/media/mediaService'

const mediaRepository = new MediaRepository()
const mediaService = new MediaService(mediaRepository)

export default defineEventHandler(async () => {
  try {
    const media = await mediaService.getAllMedia()

    return {
      media,
    }
  }
  catch (error: any) {
    console.error('Error fetching images:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve images from the database',
    })
  }
})
