import { createApp } from './app.js'
import { env } from './config/env.js'
import { closePool } from './db/pool.js'
import { ensureSchema } from './db/schema.js'
import { seedAdmin } from './db/seed-admin.js'

async function start() {
  await ensureSchema()
  await seedAdmin()

  const app = createApp()

  const server = app.listen(env.PORT, () => {
    console.log(
      JSON.stringify({
        level: 'info',
        message: 'API listening',
        url: `http://localhost:${env.PORT}`,
      }),
    )
  })

  async function shutdown(signal: string) {
    console.log(JSON.stringify({ level: 'info', message: 'Shutting down', signal }))
    server.close()
    await closePool()
    process.exit(0)
  }

  process.on('SIGINT', () => {
    void shutdown('SIGINT')
  })
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM')
  })
}

start().catch((error) => {
  console.error(
    JSON.stringify({
      level: 'error',
      message: 'API failed to start',
      reason: error instanceof Error ? error.message : 'unknown',
    }),
  )
  process.exit(1)
})
