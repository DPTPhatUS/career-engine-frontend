function EducationFormPane() {
  return (
    <aside className="lg:sticky lg:top-24 lg:col-span-5">
      <div className="rounded-xl bg-base-200 p-8 shadow-(--ambient-shadow)">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-content-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            +
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-(--on-surface)">Add Education</h2>
        </div>

        <form className="space-y-6">
          <label className="block space-y-1">
            <span className="form-label">
              University Name
            </span>
            <input
              type="text"
              placeholder="e.g. Massachusetts Institute of Technology"
              className="ghost-field h-12 w-full rounded-lg px-4 text-base"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="form-label">
                Degree
              </span>
              <input
                type="text"
                placeholder="e.g. Bachelor of Arts"
                className="ghost-field h-12 w-full rounded-lg px-4 text-base"
              />
            </label>

            <label className="block space-y-1">
              <span className="form-label">
                Field of Study
              </span>
              <input
                type="text"
                placeholder="e.g. Economics"
                className="ghost-field h-12 w-full rounded-lg px-4 text-base"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="form-label">
                Start Date
              </span>
              <input
                type="month"
                className="ghost-field h-12 w-full rounded-lg px-4 text-base"
              />
            </label>

            <label className="block space-y-1">
              <span className="form-label">
                End Date (Expected)
              </span>
              <input
                type="month"
                className="ghost-field h-12 w-full rounded-lg px-4 text-base"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label className="col-span-1 block space-y-1">
              <span className="form-label">
                GPA
              </span>
              <input
                type="text"
                placeholder="3.8/4.0"
                className="ghost-field h-12 w-full rounded-lg px-4 text-base"
              />
            </label>

            <label className="col-span-2 block space-y-1">
              <span className="form-label">
                Location
              </span>
              <input
                type="text"
                placeholder="e.g. Cambridge, MA"
                className="ghost-field h-12 w-full rounded-lg px-4 text-base"
              />
            </label>
          </div>

          <label className="block space-y-1">
            <span className="form-label">
              Relevant Coursework
            </span>
            <textarea
              rows={3}
              placeholder="List key courses separated by commas..."
              className="ghost-field w-full resize-none rounded-lg px-4 py-3 text-base"
            />
          </label>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn primary-cta flex-1 border-0 font-bold normal-case">
              Save Education
            </button>
            <button type="button" className="btn border-0 bg-base-300 px-6 font-semibold text-(--on-surface) hover:bg-base-100">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </aside>
  )
}

export default EducationFormPane
