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

function origins() {
  const fromEnv = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return fromEnv.length > 0 ? fromEnv : ['http://localhost:5173']
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT) || 3001,
  DATABASE_URL: required('DATABASE_URL'),
  JWT_SECRET: required('JWT_SECRET'),
  ADMIN_EMAIL: required('ADMIN_EMAIL').toLowerCase(),
  ADMIN_PASSWORD: required('ADMIN_PASSWORD'),
  CORS_ORIGIN: origins(),
  isProduction: (process.env.NODE_ENV ?? 'development') === 'production',
}
