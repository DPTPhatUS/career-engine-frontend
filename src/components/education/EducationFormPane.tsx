import { Plus } from 'lucide-react'

function EducationFormPane() {
  return (
    <aside className="lg:sticky lg:top-24 lg:col-span-5">
      <fieldset className="fieldset rounded-xl border border-base-300 bg-base-200 p-8 shadow-(--ambient-shadow)">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-content-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-(--on-surface)">Add Education</h2>
        </div>

        <form className="space-y-6">
          <label className="fieldset">
            <span className="label">
              University Name
            </span>
            <input
              type="text"
              placeholder="e.g. Massachusetts Institute of Technology"
              className="input input-bordered h-12 w-full text-base"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="fieldset">
              <span className="label">
                Degree
              </span>
              <input
                type="text"
                placeholder="e.g. Bachelor of Arts"
                className="input input-bordered h-12 w-full text-base"
              />
            </label>

            <label className="fieldset">
              <span className="label">
                Field of Study
              </span>
              <input
                type="text"
                placeholder="e.g. Economics"
                className="input input-bordered h-12 w-full text-base"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="fieldset">
              <span className="label">
                Start Date
              </span>
              <input
                type="month"
                className="input input-bordered h-12 w-full text-base"
              />
            </label>

            <label className="fieldset">
              <span className="label">
                End Date (Expected)
              </span>
              <input
                type="month"
                className="input input-bordered h-12 w-full text-base"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label className="fieldset col-span-1">
              <span className="label">
                GPA
              </span>
              <input
                type="text"
                placeholder="3.8/4.0"
                className="input input-bordered h-12 w-full text-base"
              />
            </label>

            <label className="fieldset col-span-2">
              <span className="label">
                Location
              </span>
              <input
                type="text"
                placeholder="e.g. Cambridge, MA"
                className="input input-bordered h-12 w-full text-base"
              />
            </label>
          </div>

          <label className="fieldset">
            <span className="label">
              Relevant Coursework
            </span>
            <textarea
              rows={3}
              placeholder="List key courses separated by commas..."
              className="textarea textarea-bordered w-full resize-none text-base"
            />
          </label>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn btn-primary flex-1 border-0 font-bold normal-case">
              Save Education
            </button>
            <button type="button" className="btn btn-ghost px-6 font-semibold normal-case">
              Cancel
            </button>
          </div>
        </form>
      </fieldset>
    </aside>
  )
}

export default EducationFormPane
