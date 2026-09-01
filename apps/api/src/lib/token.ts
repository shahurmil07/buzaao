import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const ADMIN_COOKIE = 'buzaao_admin'
export const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export interface AdminToken {
  id: string
  email: string
}

export function signAdminToken(admin: AdminToken) {
  return jwt.sign({ sub: admin.id, email: admin.email }, env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

export function verifyAdminToken(token: string): AdminToken {
  const payload = jwt.verify(token, env.JWT_SECRET)

  if (typeof payload !== 'object' || !payload.sub || typeof payload.email !== 'string') {
    throw new Error('Invalid token')
  }

  return { id: String(payload.sub), email: payload.email }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: env.isProduction ? ('none' as const) : ('lax' as const),
    secure: env.isProduction,
    path: '/',
    maxAge: TOKEN_MAX_AGE_MS,
  }
}
