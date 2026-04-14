import { FolderKanban, GraduationCap, House, UserRound, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

type MobileItem = {
  path: string
  label: string
  icon: LucideIcon
}

const mobileItems: MobileItem[] = [
  { path: '/home', label: 'Home', icon: House },
  { path: '/education', label: 'Education', icon: GraduationCap },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/profile', label: 'Profile', icon: UserRound },
]

function EducationMobileBottomNav() {
  return (
    <div className="glass-shell fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-base-100/88 px-6 py-3 md:hidden">
      {mobileItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
              isActive ? 'bg-base-200 text-primary' : 'text-(--on-surface-variant)'
            }`
          }
        >
          <span className="grid h-6 w-6 place-content-center rounded-full bg-base-200 text-[10px] font-bold">
            <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}

export default EducationMobileBottomNav
