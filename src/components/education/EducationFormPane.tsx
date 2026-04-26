import type { EducationFormValues } from './EducationFormPane.types'

type EducationFormPaneProps = {
  values: EducationFormValues
  isEditing: boolean
  isSubmitting: boolean
  onChange: (field: keyof EducationFormValues, value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

function EducationFormPane({
  values,
  isEditing,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}: EducationFormPaneProps) {
  return (
    <div className="lg:sticky lg:top-24 lg:col-span-5">
      <fieldset className="fieldset rounded-box border border-base-300 bg-base-200 p-4">
        <legend className="fieldset-legend">Editor</legend>

        <div>
          <label className="label">University Name</label>
          <input
            type="text"
            placeholder="e.g. Massachusetts Institute of Technology"
            className="input w-full"
            value={values.university}
            onChange={(event) => onChange('university', event.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Degree</label>
            <input
              type="text"
              placeholder="e.g. Bachelor of Arts"
              className="input w-full"
              value={values.degree}
              onChange={(event) => onChange('degree', event.target.value)}
            />
          </div>

          <div>
            <label className="label">Field of Study</label>
            <input
              type="text"
              placeholder="e.g. Economics"
              className="input w-full"
              value={values.field}
              onChange={(event) => onChange('field', event.target.value)}
            />
          </div>
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
            <option value="graduated">Graduated</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="label">GPA</label>
            <input
              type="text"
              placeholder="e.g. 3.8 / 4.0"
              className="input w-full"
              value={values.gpa}
              onChange={(event) => onChange('gpa', event.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label className="label">Location</label>
            <input
              type="text"
              placeholder="e.g. Cambridge, MA"
              className="input w-full"
              value={values.location}
              onChange={(event) => onChange('location', event.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Coursework</label>
          <textarea
            placeholder="e.g. Data Structures, Algorithms, Computer Networks"
            className="textarea w-full"
            value={values.coursework}
            onChange={(event) => onChange('coursework', event.target.value)}
          ></textarea>
        </div>

        <div className="flex gap-4 mt-4">
          <button type="button" className="btn btn-neutral flex-1" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Education' : 'Save Education'}
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isSubmitting}>
            Clear
          </button>
        </div>
      </fieldset>
    </div>
  )
}

export default EducationFormPane
