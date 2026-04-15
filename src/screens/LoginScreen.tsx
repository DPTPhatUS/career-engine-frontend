import LoginAuthCard from '../components/login/LoginAuthCard'
import LoginBackground from '../components/login/LoginBackground'
import LoginFooter from '../components/login/LoginFooter'
import LoginLegalLinks from '../components/login/LoginLegalLinks'
import LoginTopNav from '../components/login/LoginTopNav'

function LoginScreen() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-(--surface) text-(--on-surface)">
      <LoginBackground />
      <LoginTopNav />

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 items-center px-6 py-28 md:px-8 md:py-32">
        <section className="w-full">
          <LoginAuthCard />
          <LoginLegalLinks />
        </section>
      </main>

      <LoginFooter />
    </div>
  )
}

export default LoginScreen
