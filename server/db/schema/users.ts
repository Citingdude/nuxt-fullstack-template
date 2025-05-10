import type { InferSelectModel } from 'drizzle-orm'
import { pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, users => ({
  emailIndex: uniqueIndex('users_email_unique').on(users.email),
}))

export type User = InferSelectModel<typeof users>
