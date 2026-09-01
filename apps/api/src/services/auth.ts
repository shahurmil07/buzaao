import { verifyPassword } from '../lib/password.js'
import { findAdminByEmail } from '../models/admin.js'

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentialsError'
  }
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await findAdminByEmail(email.toLowerCase().trim())
  if (!admin) {
    throw new InvalidCredentialsError()
  }

  const matches = await verifyPassword(password, admin.password_hash)
  if (!matches) {
    throw new InvalidCredentialsError()
  }

  return { id: admin.id, email: admin.email }
}
