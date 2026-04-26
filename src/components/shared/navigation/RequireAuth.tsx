import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppData } from '../../../contexts/useAppData'
import { useAuth } from '../../../contexts/useAuth'

type RequireAuthProps = {
  children: ReactNode
}

function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation()
  const { status } = useAuth()
  const { isReady } = useAppData()

  if (status === 'loading') {
    return null
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!isReady) {
    return null
  }

  return children
}

export default RequireAuth
