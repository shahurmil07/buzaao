import { env } from '../config/env.js'
import { hashPassword } from '../lib/password.js'
import { upsertAdmin } from '../models/admin.js'

export async function seedAdmin() {
  const passwordHash = await hashPassword(env.ADMIN_PASSWORD)
  const admin = await upsertAdmin(env.ADMIN_EMAIL, passwordHash)

  console.log(
    JSON.stringify({
      level: 'info',
      message: 'Admin account ready',
      email: admin.email,
    }),
  )
}
