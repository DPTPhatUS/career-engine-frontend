import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import LoginAuthCard from '../components/login/LoginAuthCard'
import LoginBackground from '../components/login/LoginBackground'
import LoginLegalLinks from '../components/login/LoginLegalLinks'
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
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-(--surface) text-(--on-surface)">
      <LoginBackground />
      <LoginTopNav />

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 items-center px-6 py-28 md:px-8 md:py-32">
        <section className="w-full">
          <LoginAuthCard
            onGoogleLogin={() => void handleGoogleLogin()}
            isLoading={isStartingLogin}
            errorMessage={errorMessage}
          />
          <LoginLegalLinks />
        </section>
      </main>

      <AppFooter />
    </div>
  )
}

export default LoginScreen
