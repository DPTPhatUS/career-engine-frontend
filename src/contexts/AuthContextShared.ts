import { createContext } from 'react'
import type { AuthSession } from '../api/auth'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type AuthContextValue = {
  status: AuthStatus
  user: AuthSession | null
  errorMessage: string | null
  refreshSession: () => Promise<void>
  beginGoogleLogin: (nextPath?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export type { AuthContextValue, AuthStatus }
export { AuthContext }
