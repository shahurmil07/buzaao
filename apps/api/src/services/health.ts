import { pool } from '../db/pool.js'

export type CheckStatus = 'ok' | 'error'

export interface ServiceCheck {
  status: CheckStatus
  latencyMs: number
}

export async function checkDatabase(): Promise<ServiceCheck> {
  const startedAt = Date.now()

  try {
    await pool.query('SELECT 1')
    return { status: 'ok', latencyMs: Date.now() - startedAt }
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        message: 'Database health check failed',
        reason: error instanceof Error ? error.message : 'unknown',
      }),
    )

    return { status: 'error', latencyMs: Date.now() - startedAt }
  }
}
