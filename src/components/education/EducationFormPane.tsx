function EducationFormPane() {
  return (
    <aside className="lg:sticky lg:top-24 lg:col-span-5">
      <div className="rounded-xl border border-(--outline-variant)/10 bg-base-200 p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-content-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            +
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-(--on-surface)">Add Education</h2>
        </div>

        <form className="space-y-6">
          <label className="block space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-(--on-surface-variant)">
              University Name
            </span>
            <input
              type="text"
              placeholder="e.g. Massachusetts Institute of Technology"
              className="h-12 w-full rounded-lg border-(--outline-variant)/20 bg-base-100 px-4 text-(--on-surface) outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-(--on-surface-variant)">
                Degree
              </span>
              <input
                type="text"
                placeholder="e.g. Bachelor of Arts"
                className="h-12 w-full rounded-lg border-(--outline-variant)/20 bg-base-100 px-4 text-(--on-surface) outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-(--on-surface-variant)">
                Field of Study
              </span>
              <input
                type="text"
                placeholder="e.g. Economics"
                className="h-12 w-full rounded-lg border-(--outline-variant)/20 bg-base-100 px-4 text-(--on-surface) outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-(--on-surface-variant)">
                Start Date
              </span>
              <input
                type="month"
                className="h-12 w-full rounded-lg border-(--outline-variant)/20 bg-base-100 px-4 text-(--on-surface) outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-(--on-surface-variant)">
                End Date (Expected)
              </span>
              <input
                type="month"
                className="h-12 w-full rounded-lg border-(--outline-variant)/20 bg-base-100 px-4 text-(--on-surface) outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 block space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-(--on-surface-variant)">
                GPA
              </span>
              <input
                type="text"
                placeholder="3.8/4.0"
                className="h-12 w-full rounded-lg border-(--outline-variant)/20 bg-base-100 px-4 text-(--on-surface) outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              />
            </label>

            <label className="col-span-2 block space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-(--on-surface-variant)">
                Location
              </span>
              <input
                type="text"
                placeholder="e.g. Cambridge, MA"
                className="h-12 w-full rounded-lg border-(--outline-variant)/20 bg-base-100 px-4 text-(--on-surface) outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>

          <label className="block space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-(--on-surface-variant)">
              Relevant Coursework
            </span>
            <textarea
              rows={3}
              placeholder="List key courses separated by commas..."
              className="w-full resize-none rounded-lg border-(--outline-variant)/20 bg-base-100 px-4 py-3 text-(--on-surface) outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
            />
          </label>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn primary-cta flex-1 border-0 font-bold normal-case">
              Save Education
            </button>
            <button type="button" className="btn border-0 bg-base-300 px-6 font-semibold text-(--on-surface) hover:bg-(--surface-dim)">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </aside>
  )
}

export default EducationFormPane
