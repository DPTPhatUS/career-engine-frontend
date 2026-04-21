import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import LoginAuthCard from '../components/login/LoginAuthCard'
import LoginTopNav from '../components/login/LoginTopNav'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useAuth } from '../contexts/AuthContext'

function LoginScreen() {
  const { beginGoogleLogin, status } = useAuth()
  const [isStartingLogin, setIsStartingLogin] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleGoogleLogin() {
    setIsStartingLogin(true)
    setErrorMessage(null)

    try {
      await beginGoogleLogin('/home')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to start Google sign in')
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
          errorMessage={errorMessage}
        />
      </main>

      <AppFooter />
    </div>
  )
}

export default LoginScreen
