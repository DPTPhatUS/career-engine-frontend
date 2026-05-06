import type { CompanyOption, InlineCompanyFormValues, JobsFormValues } from './JobsFormPane.types'

type JobsFormPaneProps = {
  values: JobsFormValues
  inlineCompanyValues: InlineCompanyFormValues
  companies: CompanyOption[]
  isEditing: boolean
  isSubmitting: boolean
  showInlineCompanyForm: boolean
  isCreatingCompany: boolean
  onChange: (field: keyof JobsFormValues, value: string) => void
  onInlineCompanyChange: (field: keyof InlineCompanyFormValues, value: string) => void
  onSubmit: () => void
  onCancel: () => void
  onToggleInlineCompany: () => void
  onCreateInlineCompany: () => void
  onCancelInlineCompany: () => void
}

function JobsFormPane({
  values,
  inlineCompanyValues,
  companies,
  isEditing,
  isSubmitting,
  showInlineCompanyForm,
  isCreatingCompany,
  onChange,
  onInlineCompanyChange,
  onSubmit,
  onCancel,
  onToggleInlineCompany,
  onCreateInlineCompany,
  onCancelInlineCompany,
}: JobsFormPaneProps) {
  const hasCompanies = companies.length > 0
  const canCollapseCompanyForm = hasCompanies

  return (
    <div className="self-start lg:sticky lg:top-24 lg:col-span-5">
      <fieldset className="fieldset rounded-box border border-base-300 bg-base-200 p-4">
        <legend className="fieldset-legend">Job Editor</legend>

        <div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="label">Company</label>
              <select
                className="select w-full"
                value={values.companyId}
                onChange={(event) => onChange('companyId', event.target.value)}
                disabled={!hasCompanies}
              >
                <option value="">{hasCompanies ? 'Select company' : 'Create company below'}</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {hasCompanies ? (
              <button
                type="button"
                className="btn btn-outline"
                onClick={onToggleInlineCompany}
                disabled={isSubmitting || isCreatingCompany}
              >
                {showInlineCompanyForm ? 'Hide company form' : 'New company'}
              </button>
            ) : null}
          </div>
        </div>

        {showInlineCompanyForm || !hasCompanies ? (
          <div className="rounded-box border border-dashed border-base-300 bg-base-100 p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Create company</p>
                <p className="text-sm opacity-70">New company auto-select after save.</p>
              </div>
              {canCollapseCompanyForm ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={onCancelInlineCompany}
                  disabled={isSubmitting || isCreatingCompany}
                >
                  Close
                </button>
              ) : null}
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. OpenAI"
                  className="input w-full"
                  value={inlineCompanyValues.name}
                  onChange={(event) => onInlineCompanyChange('name', event.target.value)}
                />
              </div>

              <div>
                <label className="label">Company URL</label>
                <input
                  type="text"
                  placeholder="e.g. openai.com"
                  className="input w-full"
                  value={inlineCompanyValues.companyUrl}
                  onChange={(event) => onInlineCompanyChange('companyUrl', event.target.value)}
                />
              </div>

              <div>
                <label className="label">Overview</label>
                <textarea
                  rows={3}
                  placeholder="Short company summary"
                  className="textarea w-full"
                  value={inlineCompanyValues.overview}
                  onChange={(event) => onInlineCompanyChange('overview', event.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="btn btn-primary flex-1"
                  onClick={onCreateInlineCompany}
                  disabled={isSubmitting || isCreatingCompany}
                >
                  {isCreatingCompany ? 'Creating...' : 'Create company'}
                </button>
                {canCollapseCompanyForm ? (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={onCancelInlineCompany}
                    disabled={isSubmitting || isCreatingCompany}
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div>
          <label className="label">Job Title</label>
          <input
            type="text"
            placeholder="e.g. Senior Frontend Engineer"
            className="input w-full"
            value={values.title}
            onChange={(event) => onChange('title', event.target.value)}
          />
        </div>

        <div>
          <label className="label">Job Description</label>
          <textarea
            rows={5}
            placeholder="What the role does and why it matters"
            className="textarea w-full"
            value={values.jobDescription}
            onChange={(event) => onChange('jobDescription', event.target.value)}
          />
        </div>

        <div>
          <label className="label">Job Requirements</label>
          <textarea
            rows={5}
            placeholder="Must-have skills, tools, or experience"
            className="textarea w-full"
            value={values.jobRequirements}
            onChange={(event) => onChange('jobRequirements', event.target.value)}
          />
        </div>

        <div className="mt-4 flex gap-4">
          <button type="button" className="btn btn-neutral flex-1" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Job' : 'Save Job'}
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isSubmitting}>
            Clear
          </button>
        </div>
      </fieldset>
    </div>
  )
}

export default JobsFormPane
