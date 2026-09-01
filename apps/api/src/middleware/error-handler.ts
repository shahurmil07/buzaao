import type { NextFunction, Request, Response } from 'express'
import { sendError } from '../lib/http-error.js'

export function errorHandler(error: unknown, _req: Request, res: Response, next: NextFunction) {
  console.error(
    JSON.stringify({
      level: 'error',
      message: 'Unhandled request error',
      reason: error instanceof Error ? error.message : 'unknown',
    }),
  )

  if (res.headersSent) {
    next(error)
    return
  }

  sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong')
}
