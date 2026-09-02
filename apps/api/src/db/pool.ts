import { Pool } from 'pg'
import { env } from '../config/env.js'

function sslOptions() {
  const url = env.DATABASE_URL.toLowerCase()
  const needsSsl =
    env.isProduction || url.includes('sslmode=require') || url.includes('neon.tech')

  return needsSsl ? { rejectUnauthorized: false } : undefined
}

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.isProduction ? 3 : 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: sslOptions(),
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
