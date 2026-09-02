import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const envDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
dotenv.config({ path: path.join(envDir, '.env'), quiet: true })

function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`${name} is required`)
  }
  return value
}

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:5173',
  'https://buzaao-web.vercel.app',
  'https://*.vercel.app',
]

function parseOrigins() {
  const fromEnv = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return [...new Set([...DEFAULT_CORS_ORIGINS, ...fromEnv])]
}

const corsOrigins = parseOrigins()

function matchOrigin(pattern: string, origin: string) {
  if (pattern === origin) {
    return true
  }

  if (!pattern.includes('*')) {
    return false
  }

  const regex = new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`)
  return regex.test(origin)
}

export function isCorsOriginAllowed(origin: string) {
  const allowed = env.CORS_ORIGIN
  return allowed.some((pattern) => matchOrigin(pattern, origin))
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT) || 3001,
  DATABASE_URL: required('DATABASE_URL'),
  JWT_SECRET: required('JWT_SECRET'),
  ADMIN_EMAIL: required('ADMIN_EMAIL').toLowerCase(),
  ADMIN_PASSWORD: required('ADMIN_PASSWORD'),
  CORS_ORIGIN: corsOrigins,
  isProduction: (process.env.NODE_ENV ?? 'development') === 'production',
}
