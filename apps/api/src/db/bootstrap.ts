import { ensureSchema } from './schema.js'
import { seedAdmin } from './seed-admin.js'

let ready: Promise<void> | null = null

export function bootstrapDatabase() {
  if (!ready) {
    ready = ensureSchema().then(() => seedAdmin())
  }

  return ready
}
