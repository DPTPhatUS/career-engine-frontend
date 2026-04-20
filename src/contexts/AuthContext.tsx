import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getAuthSession, logoutSession, startGoogleLogin, type AuthSession } from '../api/auth'
import { ApiError } from '../api/client'

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

type AuthProviderProps = {
  children: ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthSession | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const refreshSession = useCallback(async () => {
    setStatus('loading')

    try {
      const authSession = await getAuthSession()
      setUser(authSession)
      setStatus('authenticated')
      setErrorMessage(null)
      return
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null)
        setStatus('unauthenticated')
        setErrorMessage(null)
        return
      }

      setUser(null)
      setStatus('unauthenticated')
      setErrorMessage(error instanceof Error ? error.message : 'Unable to validate session')
    }
  }, [])

  const beginGoogleLogin = useCallback(async (nextPath = '/home') => {
    const result = await startGoogleLogin(nextPath)
    window.location.assign(result.authorization_url)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutSession()
    } finally {
      setUser(null)
      setStatus('unauthenticated')
      setErrorMessage(null)
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      errorMessage,
      refreshSession,
      beginGoogleLogin,
      logout,
    }),
    [beginGoogleLogin, errorMessage, logout, refreshSession, status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth }
export type { AuthStatus }
