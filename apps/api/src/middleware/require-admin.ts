import type { NextFunction, Request, Response } from 'express'
import { sendError } from '../lib/http-error.js'
import { ADMIN_COOKIE, verifyAdminToken, type AdminToken } from '../lib/token.js'

export interface AuthedRequest extends Request {
  admin: AdminToken
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[ADMIN_COOKIE]
  if (typeof token !== 'string' || !token) {
    sendError(res, 401, 'UNAUTHORIZED', 'Not signed in')
    return
  }

  try {
    ;(req as AuthedRequest).admin = verifyAdminToken(token)
    next()
  } catch {
    sendError(res, 401, 'UNAUTHORIZED', 'Not signed in')
  }
}
