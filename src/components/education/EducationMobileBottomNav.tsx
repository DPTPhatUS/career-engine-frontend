import { NavLink } from 'react-router-dom'

const mobileItems = [
  { path: '/home', label: 'Home', code: 'H' },
  { path: '/education', label: 'Education', code: 'E' },
  { path: '/projects', label: 'Projects', code: 'P' },
  { path: '/profile', label: 'Profile', code: 'R' },
]

function EducationMobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-base-300 bg-base-100/90 px-6 py-3 backdrop-blur-lg md:hidden">
      {mobileItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wide ${
              isActive ? 'text-primary' : 'text-(--on-surface-variant)'
            }`
          }
        >
          <span className="grid h-6 w-6 place-content-center rounded-full bg-base-200 text-[10px] font-bold">
            {item.code}
          </span>
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}

export default EducationMobileBottomNav
