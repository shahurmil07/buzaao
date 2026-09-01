import { useMemo, useState, useEffect, type ReactNode } from 'react'
import { apiRequest } from '../lib/api'
import { AuthContext, type AdminSession, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminSession | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    apiRequest<{ admin: AdminSession }>('/api/admin/me')
      .then((data) => {
        if (!cancelled) setAdmin(data.admin)
      })
      .catch(() => {
        if (!cancelled) setAdmin(null)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      admin,
      ready,
      async login(email, password) {
        const data = await apiRequest<{ admin: AdminSession }>('/api/admin/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
        setAdmin(data.admin)
      },
      async logout() {
        await apiRequest('/api/admin/logout', { method: 'POST' })
        setAdmin(null)
      },
    }),
    [admin, ready],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
