import { Pool } from 'pg'
import { env } from '../config/env.js'

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.isProduction ? 3 : 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: env.isProduction ? { rejectUnauthorized: false } : undefined,
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
