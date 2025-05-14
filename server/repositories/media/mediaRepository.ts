import type { Media, NewMedia } from '~~/server/db/schema/media'
import { asc, eq } from 'drizzle-orm'
import { media } from '~~/server/db/schema/media'

export class MediaRepository {
  async getAll(): Promise<Media[]> {
    const db = useDb()

    return db.select().from(media).orderBy(asc(media.uploadDate))
  }

  async insert(imageData: NewMedia): Promise<{ id: number }> {
    const db = useDb()

    const [newMediaId] = await db
      .insert(media)
      .values(imageData)
      .returning({ id: media.id })

    if (!newMediaId) {
      throw createError('Failed to insert media')
    }

    return newMediaId
  }

  async findById(id: number): Promise<Media | undefined> {
    const db = useDb()

    const media = await db.query.media.findFirst({
      where: media => eq(media.id, id),
    })

    return media
  }
}
