export type ResumeEducationValues = {
  university: string
  degree: string
  field: string
  timePeriod: string
  gpa: string
  location: string
  relevantCoursework: string
}

type ResumeEducationSectionProps = {
  values: ResumeEducationValues[]
  onChange: (index: number, field: keyof ResumeEducationValues, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

function ResumeEducationSection({ values, onAdd, onChange, onRemove }: ResumeEducationSectionProps) {
  if (values.length === 0) {
    return (
      <div className="card border border-dashed border-base-300 bg-base-100">
        <div className="card-body">
          <h3 className="text-lg font-semibold">No education entries yet</h3>
          <p className="text-sm opacity-70">Add your first education entry to the resume.</p>
          <div className="card-actions">
            <button type="button" className="btn btn-outline" onClick={onAdd}>
              Add Education
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {values.map((education, index) => (
        <fieldset
          key={`education-${index}`}
          className="fieldset rounded-box border border-base-300 bg-base-200 p-4 md:p-6"
        >
          <legend className="fieldset-legend">Education {index + 1}</legend>
          <div className="flex items-start justify-between gap-4">
            <p className="label">Match the backend education schema for your resume payload.</p>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onRemove(index)}
            >
              Remove
            </button>
          </div>

          <div>
            <label className="label" htmlFor={`resume-education-university-${index}`}>
              School / University
            </label>
            <input
              id={`resume-education-university-${index}`}
              type="text"
              className="input w-full"
              placeholder="e.g. Stanford University"
              value={education.university}
              onChange={(event) => onChange(index, 'university', event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor={`resume-education-degree-${index}`}>
                Degree
              </label>
              <input
                id={`resume-education-degree-${index}`}
                type="text"
                className="input w-full"
                placeholder="e.g. B.S."
                value={education.degree}
                onChange={(event) => onChange(index, 'degree', event.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor={`resume-education-field-${index}`}>
                Field of Study
              </label>
              <input
                id={`resume-education-field-${index}`}
                type="text"
                className="input w-full"
                placeholder="e.g. Computer Science"
                value={education.field}
                onChange={(event) => onChange(index, 'field', event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor={`resume-education-time-period-${index}`}>
                Time Period
              </label>
              <input
                id={`resume-education-time-period-${index}`}
                type="text"
                className="input w-full"
                placeholder="e.g. 2020-2024"
                value={education.timePeriod}
                onChange={(event) => onChange(index, 'timePeriod', event.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor={`resume-education-gpa-${index}`}>
                GPA (optional)
              </label>
              <input
                id={`resume-education-gpa-${index}`}
                type="text"
                className="input w-full"
                placeholder="e.g. 3.8 / 4.0"
                value={education.gpa}
                onChange={(event) => onChange(index, 'gpa', event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor={`resume-education-location-${index}`}>
              Location
            </label>
            <input
              id={`resume-education-location-${index}`}
              type="text"
              className="input w-full"
              placeholder="City, ST"
              value={education.location}
              onChange={(event) => onChange(index, 'location', event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor={`resume-education-coursework-${index}`}>
              Relevant Coursework
            </label>
            <input
              id={`resume-education-coursework-${index}`}
              type="text"
              className="input w-full"
              placeholder="Algorithms, Systems"
              value={education.relevantCoursework}
              onChange={(event) => onChange(index, 'relevantCoursework', event.target.value)}
            />
          </div>
        </fieldset>
      ))}

      <button type="button" className="btn btn-outline" onClick={onAdd}>
        Add Another Education
      </button>
    </div>
  )
}

export default ResumeEducationSection
