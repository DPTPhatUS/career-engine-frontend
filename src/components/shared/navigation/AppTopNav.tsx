import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/useAuth'

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
  actionLabel?: string
  actionTo?: string
  actionType?: 'link' | 'button'
  marketingLinks?: string[]
  onActionClick?: () => void
}

function AppTopNav({
  mode = 'app',
  actionLabel = 'Sign In',
  actionTo = '/login',
  actionType = 'link',
  marketingLinks = defaultMarketingLinks,
  onActionClick,
}: AppTopNavProps) {
  const navigate = useNavigate()
  const { status, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)

    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="navbar mx-auto max-w-7xl">
        <div className="navbar-start">
          <Link to="/home" className="btn btn-ghost text-xl">
            Career Engine
          </Link>
        </div>

        <div className="navbar-center">
          <ul className="menu menu-horizontal px-1">
            {mode === 'app'
              ? appLinks.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path}>
                    {item.label}
                  </NavLink>
                </li>
              ))
              : marketingLinks.map((item) => (
                <li key={item}>
                  <a>{item}</a>
                </li>
              ))}
          </ul>
        </div>

        <div className="navbar-end">
          {mode === 'app' && actionType === 'button' ? (
            <button type="button" className="btn btn-primary" onClick={onActionClick}>
              {actionLabel}
            </button>
          ) : mode === 'app' ? (
            status === 'authenticated' ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void handleLogout()}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            ) : (
              <NavLink to="/login" className="btn btn-primary">
                Sign In
              </NavLink>
            )
          ) : actionType === 'button' ? (
            <button type="button" className="btn btn-primary" onClick={onActionClick}>
              {actionLabel}
            </button>
          ) : (
            <NavLink to={actionTo} className="btn btn-primary">
              {actionLabel}
            </NavLink>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppTopNav
