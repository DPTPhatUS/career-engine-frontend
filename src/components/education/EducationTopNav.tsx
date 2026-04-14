import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/home', label: 'Home' },
  { path: '/profile', label: 'Profile' },
  { path: '/education', label: 'Education' },
  { path: '/projects', label: 'Projects' },
  { path: '/resume', label: 'Resume Builder' },
]

function EducationTopNav() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-base-100/80 shadow-[0_20px_25px_-5px_rgba(0,74,198,0.04)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <NavLink to="/home" className="text-xl font-black tracking-tight text-base-content">
            Career Engine
          </NavLink>

          <div className="hidden items-center gap-2 md:flex">
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
          </div>
        </div>

        <NavLink to="/login" className="btn primary-cta border-0 px-5 text-sm font-semibold normal-case">
          Sign In
        </NavLink>
      </div>
    </nav>
  )
}

export default EducationTopNav
