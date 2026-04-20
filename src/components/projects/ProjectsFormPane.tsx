type ProjectCompletionStatus = 'completed' | 'present'

type ProjectsFormValues = {
  title: string
  startMonth: string
  endMonth: string
  completionStatus: ProjectCompletionStatus
  githubRepo: string
  techInput: string
  techStack: string[]
  accomplishments: string
}

type ProjectsFormPaneProps = {
  values: ProjectsFormValues
  isEditing: boolean
  isSubmitting: boolean
  isAutofilling: boolean
  onChange: (field: keyof ProjectsFormValues, value: string) => void
  onAddTechStack: () => void
  onRemoveTechStack: (tech: string) => void
  onSubmit: () => void
  onCancel: () => void
  onAutofill: () => void
}

function ProjectsFormPane({
  values,
  isEditing,
  isSubmitting,
  isAutofilling,
  onChange,
  onAddTechStack,
  onRemoveTechStack,
  onSubmit,
  onCancel,
  onAutofill,
}: ProjectsFormPaneProps) {
  const needsEndDate = values.completionStatus === 'completed'

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
            value={values.title}
            onChange={(event) => onChange('title', event.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input
              type="month"
              className="input w-full"
              value={values.startMonth}
              onChange={(event) => onChange('startMonth', event.target.value)}
            />
          </div>

          <div>
            <label className="label">End Date</label>
            <input
              type="month"
              className="input w-full"
              value={values.endMonth}
              onChange={(event) => onChange('endMonth', event.target.value)}
              disabled={!needsEndDate}
            />
          </div>
        </div>

        <div>
          <label className="label">Completion Status</label>
          <select
            className="select w-full"
            value={values.completionStatus}
            onChange={(event) => onChange('completionStatus', event.target.value)}
          >
            <option value="completed">Completed</option>
            <option value="present">Present</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="label">Project Link</label>
            <label className="input w-full">
              <span className="label">github.com/</span>
              <input
                type="text"
                placeholder="username/repo"
                value={values.githubRepo}
                onChange={(event) => onChange('githubRepo', event.target.value)}
              />
            </label>
          </div>

          <button
            type="button"
            className="btn btn-primary self-end"
            onClick={onAutofill}
            disabled={isAutofilling || isSubmitting}
          >
            {isAutofilling ? 'Autofilling...' : 'Autofill'}
          </button>
        </div>

        <div>
          <label className="label">Tech Stack</label>
          <div className="mb-1 flex flex-wrap gap-1">
            {values.techStack.map((tech) => (
              <button
                key={tech}
                type="button"
                className="badge badge-secondary badge-sm cursor-pointer"
                onClick={() => onRemoveTechStack(tech)}
                title="Click to remove"
              >
                {tech}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add technology..."
            className="input w-full"
            value={values.techInput}
            onChange={(event) => onChange('techInput', event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                onAddTechStack()
              }
            }}
          />
        </div>

        <div>
          <label className="label">Key Accomplishments</label>
          <textarea
            rows={4}
            placeholder="Bullet points detailing your impact..."
            className="textarea w-full"
            value={values.accomplishments}
            onChange={(event) => onChange('accomplishments', event.target.value)}
          />
        </div>

        <div className="mt-4 flex gap-4">
          <button type="button" className="btn btn-neutral flex-1" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Save Project'}
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </fieldset>
    </div>
  )
}

export type { ProjectCompletionStatus, ProjectsFormValues }
export default ProjectsFormPane
