import {
  BriefcaseBusiness,
  // Braces,
  // Database,
  // FileCode2,
  Building2,
  GraduationCap,
  FolderGit2,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'


type Shortcut = {
  title: string
  description: string
  icon: LucideIcon
  to: string
}

const shortcuts: Shortcut[] = [
  {
    title: 'Profile',
    description: 'Update your bio, skills, and social links.',
    icon: UserRound,
    to: '/profile',
  },
  {
    title: 'Education',
    description: 'Manage your degrees and certifications.',
    icon: GraduationCap,
    to: '/education',
  },
  {
    title: 'Companies',
    description: 'Save target companies and their hiring context.',
    icon: Building2,
    to: '/companies',
  },
  {
    title: 'Jobs',
    description: 'Track saved roles and requirements by company.',
    icon: BriefcaseBusiness,
    to: '/jobs',
  },
  {
    title: 'Projects',
    description: 'Maintain portfolio projects and impact bullets.',
    icon: FolderGit2,
    to: '/projects',
  },
]

function HomeBentoGrid() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <div className="card card-xl bg-neutral text-neutral-content md:col-span-8 md:row-span-2">
        <div className="card-body">
          <h2 className="card-title">Resumes</h2>
          <p>Create targeted resumes fast with tailored project highlights and clean formatting.</p>
          <div className="card-actions justify-start">
            <NavLink to="/resumes" className="btn btn-primary">
              Open Resumes
            </NavLink>
            <button className="btn btn-outline">
              View Templates
            </button>
          </div>
        </div>
      </div>

      {shortcuts.map((shortcut) => (
        <NavLink
          key={shortcut.title}
          to={shortcut.to}
          className="card card-lg border border-base-300 md:col-span-4 md:row-span-1"
        >
          <div className="card-body">
            <h2 className="card-title">{shortcut.title}</h2>
            <p>{shortcut.description}</p>
            <div className="card-actions justify-end">
              <shortcut.icon className="text-primary" aria-hidden="true" />
            </div>
          </div>
        </NavLink>
      ))}
    </section>
  )
}

export default HomeBentoGrid
