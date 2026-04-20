type GithubValues = {
  githubLabel: string
  githubUsername: string
}

type ProfileGithubSectionProps = {
  values: GithubValues
  disabled?: boolean
  isSaving?: boolean
  onChange: (field: keyof GithubValues, value: string) => void
  onClear: () => void
  onSave: () => void
}

function ProfileGithubSection({
  values,
  disabled = false,
  isSaving = false,
  onChange,
  onClear,
  onSave,
}: ProfileGithubSectionProps) {
  return (
    <fieldset className="fieldset bg-base-200 border border-base-300 rounded-box p-4">
      <legend className="fieldset-legend">
        GitHub Integration
      </legend>

      <div className="grid grid-cols-2 gap-x-4">
        <div className="w-full">
          <label className="label" htmlFor="github-label">GitHub Label</label>
          <input
            id="github-label"
            type="text"
            className="input w-full"
            value={values.githubLabel}
            onChange={(event) => onChange('githubLabel', event.target.value)}
            placeholder="e.g. Primary Repo"
            disabled={disabled}
          />
        </div>

        <div className="w-full">
          <label className="label" htmlFor="github-profile">GitHub Profile Link</label>
          <label className="input w-full" htmlFor="github-profile">
            <span className="label">github.com/</span>
            <input
              id="github-profile"
              type="text"
              className="grow"
              value={values.githubUsername}
              onChange={(event) => onChange('githubUsername', event.target.value)}
              placeholder="username"
              disabled={disabled}
            />
          </label>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <button type="button" className="btn btn-outline" onClick={onClear} disabled={disabled}>
          Clear
        </button>
        <button type="button" className="btn btn-neutral" onClick={onSave} disabled={disabled || isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </fieldset>
  )
}

export default ProfileGithubSection
