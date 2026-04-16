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
  fixed?: boolean
  marketingLinks?: string[]
}

function AppTopNav({
  mode = 'app',
  actionLabel,
  actionTo = '/login',
  marketingLinks = defaultMarketingLinks,
}: AppTopNavProps) {
  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        <Link to="/home" className="btn btn-ghost text-xl">
          Career Engine
        </Link>
      </div>

      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1">
          {mode === 'app'
            ? appLinks.map((item) => (
              // Active link is active button, others are ghost
              <li key={item.path}>
                <NavLink to={item.path} className={({ isActive }) => (isActive ? 'btn btn-active' : 'btn btn-ghost')}>
                  {item.label}
                </NavLink>
              </li>
            ))
            : marketingLinks.map((item) => (
              <li key={item}>
                <a> {item} </a>
              </li>
            ))}
        </ul>
      </div>

      <div className="navbar-end">
        <NavLink to={actionTo} className="btn btn-primary">
          {actionLabel}
        </NavLink>
      </div>
    </div>
  )
}

export default AppTopNav
