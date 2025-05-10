import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import schema from '~~/server/db/schema/index'

let _db: NodePgDatabase<typeof schema>

export function useDb() {
  if (!_db) {
    const pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
    })

    _db = drizzle(pool, {
      schema,
    })
  }

  return _db
}
