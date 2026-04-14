import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/home', label: 'Home' },
  { path: '/profile', label: 'Profile' },
  { path: '/education', label: 'Education' },
  { path: '/projects', label: 'Projects' },
  { path: '/resume', label: 'Resume Builder' },
]

function ProfileTopNav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-base-100/80 shadow-[0_20px_25px_-5px_rgba(0,74,198,0.04)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <NavLink to="/home" className="text-xl font-black tracking-tight text-base-content">
            Career Engine
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
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
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-(--on-surface-variant)">
              /
            </span>
            <input
              type="text"
              placeholder="Search resources..."
              className="h-9 w-64 rounded-full border-0 bg-base-200 pl-8 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <NavLink
            to="/login"
            className="btn btn-ghost btn-sm border-0 px-4 font-semibold normal-case text-primary hover:bg-base-200"
          >
            Sign In
          </NavLink>
        </div>
      </div>
    </header>
  )
}

export default ProfileTopNav
