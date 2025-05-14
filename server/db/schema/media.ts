import { bigint, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  originalFilename: text('original_filename'),
  mimeType: text('mime_type'),
  uploadDate: timestamp('upload_date').defaultNow(),
  filePath: text('file_path'),
  url: text('url'),
  size: bigint({
    mode: 'number',
  }),
})

export type Media = typeof media.$inferSelect
export type NewMedia = typeof media.$inferInsert
