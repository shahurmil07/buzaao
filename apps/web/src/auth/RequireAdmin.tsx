import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './useAuth'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { admin, ready } = useAuth()

  if (!ready) {
    return (
      <div className="flex h-dvh items-center justify-center bg-page text-sm font-semibold text-muted">
        Loading…
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
