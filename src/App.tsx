import { NavLink, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import EducationScreen from './screens/EducationScreen'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import ProfileScreen from './screens/ProfileScreen'
import ProjectsScreen from './screens/ProjectsScreen'
import ResumeScreen from './screens/ResumeScreen'
import SkillsScreen from './screens/SkillsScreen'

const navItems = [
  { path: '/home', label: 'Home' },
  { path: '/profile', label: 'Profile' },
  { path: '/education', label: 'Education' },
  { path: '/projects', label: 'Projects' },
  { path: '/skills', label: 'Skills' },
  { path: '/resume', label: 'Resume' },
]

function AppShell() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-(--surface) text-(--on-surface)">
      <div className="atmosphere" aria-hidden="true" />

      <header className="sticky top-4 z-20 px-4 sm:px-6 xl:px-10">
        <nav className="glass-shell mx-auto flex w-full max-w-7xl flex-col gap-4 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="blueprint-label">Career Engine</p>
            <p className="text-sm font-medium tracking-wide text-(--on-surface)">
              Implementation Templates
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `route-pill ${isActive ? 'route-pill-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 xl:pl-20 xl:pr-32">
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/education" element={<EducationScreen />} />
      <Route path="/projects" element={<ProjectsScreen />} />
      <Route path="/resume" element={<ResumeScreen />} />

      <Route element={<AppShell />}>
        <Route path="/skills" element={<SkillsScreen />} />
      </Route>

      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default App
