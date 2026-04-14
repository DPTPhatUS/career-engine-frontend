import { Link } from 'react-router-dom'

const navItems = ['Features', 'Pricing', 'About']

function LoginTopNav() {
  return (
    <header className="fixed top-0 z-50 w-full bg-base-100/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/home" className="text-xl font-black tracking-tight text-(--on-surface)">
          Career Engine
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium tracking-tight text-(--on-surface-variant) transition-colors hover:text-primary"
            >
              {item}
            </a>
          ))}

          <button
            type="button"
            className="btn primary-cta h-10 min-h-10 border-0 px-5 text-sm font-semibold normal-case"
          >
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  )
}

export default LoginTopNav
