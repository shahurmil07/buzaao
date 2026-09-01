import { randomUUID } from 'node:crypto'
import { pool } from '../db/pool.js'

export interface AdminRecord {
  id: string
  email: string
  password_hash: string
}

export async function findAdminByEmail(email: string): Promise<AdminRecord | null> {
  const result = await pool.query<AdminRecord>(
    'SELECT id, email, password_hash FROM admins WHERE email = $1 LIMIT 1',
    [email],
  )
  return result.rows[0] ?? null
}

export async function upsertAdmin(email: string, passwordHash: string): Promise<AdminRecord> {
  const result = await pool.query<AdminRecord>(
    `
      INSERT INTO admins (id, email, password_hash)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id, email, password_hash
    `,
    [randomUUID(), email, passwordHash],
  )

  const admin = result.rows[0]
  if (!admin) {
    throw new Error('Failed to save admin account')
  }

  return admin
}
