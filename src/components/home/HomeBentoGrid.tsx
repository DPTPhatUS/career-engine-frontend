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

      {/* <article className="relative overflow-hidden rounded-xl bg-base-200 p-6 md:col-span-12 md:row-span-1">
        <div className="relative z-10 flex h-full flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-6">
            <div className="avatar-group -space-x-4 rtl:space-x-reverse">
              <div className="avatar">
                <div className="grid w-12 place-content-center rounded bg-primary text-white">
                  <Braces className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="avatar">
                <div className="grid w-12 place-content-center rounded bg-success text-white">
                  <Database className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="avatar">
                <div className="grid w-12 place-content-center rounded bg-warning text-white">
                  <FileCode2 className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-(--on-surface)">Ongoing Projects</h3>
              <p className="text-(--on-surface-variant)">
                Continue your latest "Eco-Tracker Dashboard" development.
              </p>
            </div>
          </div>

          <NavLink to="/projects" className="btn border-0 bg-base-100 px-8 font-bold text-(--on-surface) hover:bg-base-300">
            Manage All Projects
          </NavLink>
        </div>
      </article> */}
    </section>
  )
}

export default HomeBentoGrid
