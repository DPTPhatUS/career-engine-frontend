const defaultStack = ['TypeScript', 'Next.js', 'Tailwind']

function ProjectsFormPane() {
  return (
    <div className="lg:sticky lg:top-24 lg:col-span-5">
      <fieldset className="fieldset rounded-box border border-base-300 bg-base-200 p-4">
        <legend className="fieldset-legend">Project Editor</legend>

        <div>
          <label className="label">Project Title</label>
          <input
            type="text"
            placeholder="e.g. Neural Link Dashboard"
            className="input w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input type="date" className="input w-full" />
          </div>

          <div>
            <label className="label">End Date</label>
            <input type="date" className="input w-full" />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="label">Project Link</label>
            <label className="input w-full">
              <span className="label">github.com/</span>
              <input type="text" placeholder="username/repo" />
            </label>
          </div>

          <button type="button" className="btn btn-primary self-end">
            Autofill
          </button>
        </div>

        <div>
          <label className="label">Tech Stack</label>
          <div className="mb-1 flex flex-wrap gap-1">
            {defaultStack.map((tech) => (
              <div key={tech} className="badge badge-secondary badge-sm">
                {tech}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add technology..."
            className="input w-full"
          />
        </div>

        <div>
          <label className="label">Key Accomplishments</label>
          <textarea
            rows={4}
            placeholder="Bullet points detailing your impact..."
            className="textarea w-full"
          />
        </div>

        <div className="mt-4 flex gap-4">
          <button type="submit" className="btn btn-neutral flex-1">
            Save Project
          </button>
          <button type="button" className="btn btn-outline">
            Cancel
          </button>
        </div>
      </fieldset>
    </div>
  )
}

export default ProjectsFormPane
