import type { Request, Response } from 'express'
import { sendError } from '../lib/http-error.js'
import { ADMIN_COOKIE, adminCookieOptions, signAdminToken } from '../lib/token.js'
import { authenticateAdmin, InvalidCredentialsError } from '../services/auth.js'
import type { AuthedRequest } from '../middleware/require-admin.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function login(req: Request, res: Response) {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
  const password = typeof req.body?.password === 'string' ? req.body.password : ''

  if (!EMAIL_PATTERN.test(email) || password.length < 8) {
    sendError(res, 400, 'INVALID_INPUT', 'Enter a valid email and password')
    return
  }

  try {
    const admin = await authenticateAdmin(email, password)
    res.cookie(ADMIN_COOKIE, signAdminToken(admin), adminCookieOptions())
    res.json({ admin: { id: admin.id, email: admin.email } })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      sendError(res, 401, 'UNAUTHORIZED', error.message)
      return
    }
    throw error
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(ADMIN_COOKIE, adminCookieOptions())
  res.json({ ok: true })
}

export function me(req: Request, res: Response) {
  const { admin } = req as AuthedRequest
  res.json({ admin: { id: admin.id, email: admin.email } })
}
