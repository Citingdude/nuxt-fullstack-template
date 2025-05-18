import { useMediaService } from '~~/server/services/media/mediaService'

export default defineEventHandler(async () => {
  const mediaService = useMediaService()

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
