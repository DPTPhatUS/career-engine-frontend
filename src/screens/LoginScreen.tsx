import { Link } from 'react-router-dom'

function LoginScreen() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-(--surface) text-(--on-surface)">
      <div className="atmosphere" aria-hidden="true" />

      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-12 sm:px-6">
        <section className="w-full rounded-2xl bg-(--surface-container-low) p-4 sm:p-5">
          <article className="screen-card reveal-up p-7 sm:p-9">
            <p className="blueprint-label">Login Template</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              Authentication Placeholder
            </h1>
            <p className="mt-3 text-base leading-7 text-(--on-surface-variant)">
              Implement session checks, OAuth start flow, and redirect logic on this screen.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button type="button" className="btn primary-cta w-full border-0 normal-case">
                Continue with Google
              </button>

              <Link
                to="/home"
                className="btn w-full border-0 bg-(--surface-container-highest) normal-case text-(--on-surface) hover:bg-(--surface-container-high)"
              >
                Open Home Template
              </Link>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default LoginScreen
