import type { Request, Response } from 'express'
import { checkDatabase } from '../services/health.js'

export async function getHealth(_req: Request, res: Response) {
  const database = await checkDatabase()
  const ok = database.status === 'ok'

  res.status(ok ? 200 : 503).json({
    status: ok ? 'ok' : 'error',
    checks: {
      api: { status: 'ok' },
      database,
    },
  })
}
