import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/db/schema/*',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_NAME || '',
    ssl: false,
  },
})
