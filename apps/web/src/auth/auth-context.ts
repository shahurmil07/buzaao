import { createContext } from 'react'

export interface AdminSession {
  id: string
  email: string
}

export interface AuthContextValue {
  admin: AdminSession | null
  ready: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
