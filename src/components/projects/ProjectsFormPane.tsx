const defaultStack = ['TypeScript', 'Next.js', 'Tailwind']

function ProjectsFormPane() {
  return (
    <section className="space-y-8">
      <div className="rounded-xl bg-base-100 p-8 shadow-(--ambient-shadow)">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-(--on-surface)">Project Details</h2>
          <p className="mt-1 text-sm text-(--on-surface-variant)">Capture project metadata and outcomes.</p>
        </div>

        <form className="space-y-6">
          <label className="block">
            <span className="form-label mb-2 block">
              Project Title
            </span>
            <input
              type="text"
              placeholder="e.g. Neural Link Dashboard"
              className="ghost-field h-12 w-full rounded-lg px-4 text-base"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="form-label mb-2 block">
                Start Date
              </span>
              <input type="date" className="ghost-field h-12 w-full rounded-lg px-4 text-base" />
            </label>

            <label className="block">
              <span className="form-label mb-2 block">
                End Date
              </span>
              <input type="date" className="ghost-field h-12 w-full rounded-lg px-4 text-base" />
            </label>
          </div>

          <label className="block">
            <span className="form-label mb-2 block">
              GitHub Repository URL
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--on-surface-variant)">
                github.com/
              </span>
              <input
                type="text"
                placeholder="username/repo"
                className="ghost-field h-12 w-full rounded-lg px-4 pl-28 text-base"
              />
            </div>
          </label>

          <div>
            <span className="form-label mb-2 block">
              Tech Stack
            </span>

            <div className="mb-3 flex flex-wrap gap-2">
              {defaultStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-content"
                >
                  {tech}
                  <span className="text-[11px]">x</span>
                </span>
              ))}
            </div>

            <input
              type="text"
              placeholder="Add technology..."
              className="ghost-field h-12 w-full rounded-lg px-4 text-base"
            />
          </div>

          <label className="block">
            <span className="form-label mb-2 block">
              Key Accomplishments
            </span>
            <textarea
              rows={4}
              placeholder="Bullet points detailing your impact..."
              className="ghost-field w-full rounded-lg px-4 py-3 text-base"
            />
            <p className="mt-1 text-[11px] italic text-(--on-surface-variant)">
              Use markdown or plain text bullet points.
            </p>
          </label>

          <button type="submit" className="btn primary-cta h-14 w-full border-0 text-base font-bold normal-case">
            Save Project Entry
          </button>
        </form>
      </div>
    </section>
  )
}

export default ProjectsFormPane
