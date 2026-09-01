import { Pool } from 'pg'
import { env } from '../config/env.js'

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

pool.on('error', (error) => {
  console.error(
    JSON.stringify({
      level: 'error',
      message: 'Unexpected Postgres pool error',
      name: error.name,
    }),
  )
})

export async function closePool() {
  await pool.end()
}
