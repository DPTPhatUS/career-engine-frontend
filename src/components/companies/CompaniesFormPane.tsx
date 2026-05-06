import type { CompaniesFormValues } from './CompaniesFormPane.types'

type CompaniesFormPaneProps = {
  values: CompaniesFormValues
  isEditing: boolean
  isSubmitting: boolean
  onChange: (field: keyof CompaniesFormValues, value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

function CompaniesFormPane({ values, isEditing, isSubmitting, onChange, onSubmit, onCancel }: CompaniesFormPaneProps) {
  return (
    <div className="self-start lg:sticky lg:top-24 lg:col-span-5">
      <fieldset className="fieldset rounded-box border border-base-300 bg-base-200 p-4">
        <legend className="fieldset-legend">Company Editor</legend>

        <div>
          <label className="label">Company Name</label>
          <input
            type="text"
            placeholder="e.g. OpenAI"
            className="input w-full"
            value={values.name}
            onChange={(event) => onChange('name', event.target.value)}
          />
        </div>

        <div>
          <label className="label">Company URL</label>
          <input
            type="text"
            placeholder="e.g. openai.com"
            className="input w-full"
            value={values.companyUrl}
            onChange={(event) => onChange('companyUrl', event.target.value)}
          />
        </div>

        <div>
          <label className="label">Overview</label>
          <textarea
            rows={5}
            placeholder="Short summary of the company or your relationship to it..."
            className="textarea w-full"
            value={values.overview}
            onChange={(event) => onChange('overview', event.target.value)}
          />
        </div>

        <div className="mt-4 flex gap-4">
          <button type="button" className="btn btn-neutral flex-1" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Company' : 'Save Company'}
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isSubmitting}>
            Clear
          </button>
        </div>
      </fieldset>
    </div>
  )
}

export default CompaniesFormPane
