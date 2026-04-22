import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import LoginAuthCard from '../components/login/LoginAuthCard'
import LoginTopNav from '../components/login/LoginTopNav'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'

function LoginScreen() {
  const { beginGoogleLogin, status } = useAuth()
  const { notifyError } = useNotification()
  const [isStartingLogin, setIsStartingLogin] = useState(false)

  async function handleGoogleLogin() {
    setIsStartingLogin(true)

    try {
      await beginGoogleLogin('/home')
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to start Google sign in')
      setIsStartingLogin(false)
    }
  }

  if (status === 'authenticated') {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <LoginTopNav />

      <main className="mx-auto flex w-full flex-1 items-center justify-center">
        <LoginAuthCard
          onGoogleLogin={() => void handleGoogleLogin()}
          isLoading={isStartingLogin}
        />
      </main>

      <AppFooter />
    </div>
  )
}

export default LoginScreen
