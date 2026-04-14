import { NavLink } from 'react-router-dom'

const resumeImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCcwgqWpi6HaK0ZoDQG5WkM2YsFDZvRSDUJj5Oq5ycXsDhYPLMcDgFUFrEOXQGO0QFowHWSnNgLYijQWqlUQu99fgkkEcUnjU18AN3sFiNDWokypnPrF3UMWWsx3iU38vrdOyxno9GVu8m0ZrYGDtGS42hMZxoWLZHO29pgvLDaMd39m87gIoB5WsWlkLt4YkKr0qpYhC5w8VQU5gbTXDIRsxbbGzt8F0BFJuz_bou1MNRkfAPtieoXUzd9btJKkujhoC_Jr57Ntg'

const shortcuts = [
  {
    title: 'Profile',
    description: 'Update your bio, skills, and social links.',
    icon: 'P',
    to: '/profile',
  },
  {
    title: 'Education',
    description: 'Manage your degrees and certifications.',
    icon: 'E',
    to: '/education',
  },
]

function HomeBentoGrid() {
  return (
    <section className="grid auto-rows-[200px] grid-cols-1 gap-6 md:grid-cols-12">
      <article className="relative overflow-hidden rounded-xl bg-base-300 md:col-span-8 md:row-span-2">
        <img
          src={resumeImage}
          alt="Resume preview"
          className="absolute inset-0 h-full w-full object-cover opacity-20 transition-transform duration-700 group-hover:scale-105"
        />

        <div className="relative flex h-full flex-col justify-between p-8">
          <div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary-content">
              Most Popular
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-(--on-surface)">Resume Builder</h2>
            <p className="mt-4 max-w-md text-(--on-surface-variant)">
              Our AI-powered builder helps you craft a high-conversion resume tailored for tech
              giants. New templates just added.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <NavLink to="/resume" className="btn primary-cta border-0 px-6 font-bold normal-case">
              Open Builder
            </NavLink>
            <button type="button" className="btn border-0 bg-base-100 px-6 font-bold text-primary hover:bg-base-200">
              View Templates
            </button>
          </div>
        </div>
      </article>

      {shortcuts.map((shortcut) => (
        <NavLink
          key={shortcut.title}
          to={shortcut.to}
          className="group rounded-xl bg-base-100 p-6 shadow-(--ambient-shadow) transition-colors hover:bg-base-200 md:col-span-4 md:row-span-1"
        >
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-content-center rounded-lg bg-base-200 text-sm font-bold text-primary">
                {shortcut.icon}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-(--on-surface-variant) opacity-0 transition-opacity group-hover:opacity-100">
                Open
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-(--on-surface)">{shortcut.title}</h3>
              <p className="mt-1 text-sm text-(--on-surface-variant)">{shortcut.description}</p>
            </div>
          </div>
        </NavLink>
      ))}

      <article className="relative overflow-hidden rounded-xl bg-base-200 p-6 md:col-span-12 md:row-span-1">
        <div className="relative z-10 flex h-full flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-6">
            <div className="avatar-group -space-x-4 rtl:space-x-reverse">
              <div className="avatar">
                <div className="w-12 rounded bg-primary text-center text-sm font-bold leading-[3rem] text-white">JS</div>
              </div>
              <div className="avatar">
                <div className="w-12 rounded bg-success text-center text-sm font-bold leading-[3rem] text-white">PY</div>
              </div>
              <div className="avatar">
                <div className="w-12 rounded bg-warning text-center text-sm font-bold leading-[3rem] text-white">TS</div>
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
      </article>
    </section>
  )
}

export default HomeBentoGrid
