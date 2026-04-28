export type ResumeProjectsValues = {
  title: string
  dateRange: string
  githubUrl: string
  techStack: string
  bullets: string
}

type ResumeProjectsSectionProps = {
  values: ResumeProjectsValues[]
  onChange: (index: number, field: keyof ResumeProjectsValues, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

function ResumeProjectsSection({ values, onAdd, onChange, onRemove }: ResumeProjectsSectionProps) {
  if (values.length === 0) {
    return (
      <div className="card border border-dashed border-base-300 bg-base-100">
        <div className="card-body">
          <h3 className="text-lg font-semibold">No projects yet</h3>
          <p className="text-sm opacity-70">Add a project you want highlighted in this resume.</p>
          <div className="card-actions">
            <button type="button" className="btn btn-outline" onClick={onAdd}>
              Add Project
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {values.map((project, index) => (
        <fieldset
          key={`project-${index}`}
          className="fieldset rounded-box border border-base-300 bg-base-200 p-4 md:p-6"
        >
          <legend className="fieldset-legend">Project {index + 1}</legend>
          <div className="flex items-start justify-between gap-4">
            <p className="label">Use the backend project payload fields directly.</p>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onRemove(index)}
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor={`resume-project-title-${index}`}>
                Project Title
              </label>
              <input
                id={`resume-project-title-${index}`}
                type="text"
                className="input w-full"
                placeholder="e.g. Career Engine Dashboard"
                value={project.title}
                onChange={(event) => onChange(index, 'title', event.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor={`resume-project-date-range-${index}`}>
                Date Range
              </label>
              <input
                id={`resume-project-date-range-${index}`}
                type="text"
                className="input w-full"
                placeholder="e.g. Jan 2024 - Mar 2024"
                value={project.dateRange}
                onChange={(event) => onChange(index, 'dateRange', event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor={`resume-project-github-url-${index}`}>
              GitHub URL
            </label>
            <input
              id={`resume-project-github-url-${index}`}
              type="url"
              className="input w-full"
              placeholder="https://github.com/org/repo"
              value={project.githubUrl}
              onChange={(event) => onChange(index, 'githubUrl', event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor={`resume-project-tech-stack-${index}`}>
              Tech Stack
            </label>
            <input
              id={`resume-project-tech-stack-${index}`}
              type="text"
              className="input w-full"
              placeholder="Comma-separated technologies"
              value={project.techStack}
              onChange={(event) => onChange(index, 'techStack', event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor={`resume-project-bullets-${index}`}>
              Bullets
            </label>
            <textarea
              id={`resume-project-bullets-${index}`}
              rows={4}
              className="textarea w-full"
              placeholder="One bullet per line"
              value={project.bullets}
              onChange={(event) => onChange(index, 'bullets', event.target.value)}
            ></textarea>
            <p className="label">Each line will be sent as one bullet item.</p>
          </div>
        </fieldset>
      ))}

      <button type="button" className="btn btn-outline" onClick={onAdd}>
        Add Another Project
      </button>
    </div>
  )
}

export default ResumeProjectsSection
