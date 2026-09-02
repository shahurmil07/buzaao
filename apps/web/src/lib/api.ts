interface ApiErrorBody {
  error?: { code?: string; message?: string }
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const PRODUCTION_API_URL = 'https://buzaao-api.vercel.app'

function apiBase() {
  const fromEnv = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

  // Preview hosts like buzaao-api-git-master-*.vercel.app are behind Vercel SSO.
  // A 302 to vercel.com/sso-api shows up in the browser as a CORS error.
  if (!fromEnv || fromEnv.includes('-git-')) {
    return import.meta.env.PROD ? PRODUCTION_API_URL : fromEnv
  }

  return fromEnv
}

function apiUrl(path: string) {
  const base = apiBase()
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
    credentials: 'include',
  })

  const data = (await response.json().catch(() => ({}))) as T & ApiErrorBody

  if (!response.ok) {
    throw new ApiError(response.status, data.error?.message ?? 'Request failed')
  }

  return data
}
