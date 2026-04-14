import { Link, NavLink } from 'react-router-dom'

const appLinks = [
  { path: '/home', label: 'Home' },
  { path: '/profile', label: 'Profile' },
  { path: '/education', label: 'Education' },
  { path: '/projects', label: 'Projects' },
  { path: '/resume', label: 'Resume Builder' },
]

const defaultMarketingLinks = ['Features', 'Pricing', 'About']

type AppTopNavProps = {
  mode?: 'app' | 'marketing'
  actionLabel: string
  actionTo?: string
  actionType?: 'link' | 'button'
  searchPlaceholder?: string
  fixed?: boolean
  marketingLinks?: string[]
}

function AppTopNav({
  mode = 'app',
  actionLabel,
  actionTo = '/login',
  actionType = 'link',
  searchPlaceholder,
  fixed = false,
  marketingLinks = defaultMarketingLinks,
}: AppTopNavProps) {
  const containerClass = fixed
    ? 'fixed top-0 z-50 w-full bg-base-100/80 shadow-[0_20px_25px_-5px_rgba(0,74,198,0.04)] backdrop-blur-md'
    : 'sticky top-0 z-50 w-full bg-base-100/80 shadow-[0_20px_25px_-5px_rgba(0,74,198,0.04)] backdrop-blur-md'

  return (
    <header className={containerClass}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <Link to="/home" className="text-xl font-black tracking-tight text-base-content">
            Career Engine
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {mode === 'app'
              ? appLinks.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? 'rounded-lg border-b-2 border-primary px-3 py-2 text-sm font-bold text-primary'
                        : 'rounded-lg px-3 py-2 text-sm text-(--on-surface-variant) transition-colors hover:bg-base-200 hover:text-primary'
                    }
                  >
                    {item.label}
                  </NavLink>
                ))
              : marketingLinks.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="rounded-lg px-3 py-2 text-sm text-(--on-surface-variant) transition-colors hover:bg-base-200 hover:text-primary"
                  >
                    {item}
                  </a>
                ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {searchPlaceholder ? (
            <label className="input input-sm hidden w-64 items-center gap-2 rounded-full border-0 bg-base-200 sm:flex">
              <span className="text-xs font-bold text-(--on-surface-variant)">S</span>
              <input type="text" className="grow" placeholder={searchPlaceholder} />
            </label>
          ) : null}

          {actionType === 'button' ? (
            <button
              type="button"
              className="btn primary-cta h-10 min-h-10 border-0 px-5 text-sm font-semibold normal-case"
            >
              {actionLabel}
            </button>
          ) : (
            <NavLink
              to={actionTo}
              className="btn primary-cta h-10 min-h-10 border-0 px-5 text-sm font-semibold normal-case"
            >
              {actionLabel}
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppTopNav
