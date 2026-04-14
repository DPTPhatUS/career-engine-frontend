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
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-(--on-surface-variant)">
              Project Title
            </span>
            <input
              type="text"
              placeholder="e.g. Neural Link Dashboard"
              className="input h-12 w-full rounded-lg border-(--outline-variant)/15 bg-base-100"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-(--on-surface-variant)">
                Start Date
              </span>
              <input type="date" className="input h-12 w-full rounded-lg border-(--outline-variant)/15 bg-base-100" />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-(--on-surface-variant)">
                End Date
              </span>
              <input type="date" className="input h-12 w-full rounded-lg border-(--outline-variant)/15 bg-base-100" />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-(--on-surface-variant)">
              GitHub Repository URL
            </span>
            <div className="flex">
              <span className="flex items-center rounded-l-lg border border-r-0 border-(--outline-variant)/15 bg-base-300 px-4 text-sm text-(--on-surface-variant)">
                github.com/
              </span>
              <input
                type="text"
                placeholder="username/repo"
                className="input h-12 w-full rounded-l-none rounded-r-lg border-(--outline-variant)/15 bg-base-100"
              />
            </div>
          </label>

          <div>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-(--on-surface-variant)">
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
              className="input h-12 w-full rounded-lg border-(--outline-variant)/15 bg-base-100"
            />
          </div>

          <label className="block">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-(--on-surface-variant)">
              Key Accomplishments
            </span>
            <textarea
              rows={4}
              placeholder="Bullet points detailing your impact..."
              className="textarea w-full rounded-lg border-(--outline-variant)/15 bg-base-100"
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
