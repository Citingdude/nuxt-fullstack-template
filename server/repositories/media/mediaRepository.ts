// ~/server/repositories/media/useMediaRepository.ts
import type { Media, NewMedia } from '~~/server/db/schema/media'
import { asc, eq } from 'drizzle-orm'
import { media } from '~~/server/db/schema/media'

export function useMediaRepository() {
  const db = useDb()

  const getAll = async (): Promise<Media[]> => {
    return db.select().from(media).orderBy(asc(media.uploadDate))
  }

  const insert = async (imageData: NewMedia): Promise<{ id: number }> => {
    const [newMediaId] = await db
      .insert(media)
      .values(imageData)
      .returning({ id: media.id })

    if (!newMediaId) {
      throw createError('Failed to insert media')
    }

    return newMediaId
  }

  const findById = async (id: number): Promise<Media | undefined> => {
    return db.query.media.findFirst({
      where: m => eq(m.id, id),
    })
  }

  const deleteById = async (id: number): Promise<void> => {
    await db.delete(media).where(eq(media.id, id))
  }

  return {
    getAll,
    insert,
    findById,
    deleteById,
  }
}
