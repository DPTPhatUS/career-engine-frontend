function ProfileGithubSection() {
  return (
    <fieldset className="fieldset bg-base-200 border border-base-300 rounded-box p-4">
      <legend className="fieldset-legend">
        GitHub Integration
      </legend>

      <div className="grid grid-cols-2 gap-6">
        <div className="w-full">
          <label className="label" htmlFor="github-label">GitHub Label</label>
          <input
            id="github-label"
            type="text"
            className="input w-full"
            defaultValue="GitHub"
            placeholder="e.g. Primary Repo"
          />
        </div>

        <div className="w-full">
          <label className="label" htmlFor="github-profile">GitHub Profile Link</label>
          <label className="input w-full" htmlFor="github-profile">
            <span className="text-base-content/60">github.com/</span>
            <input
              id="github-profile"
              type="text"
              className="grow"
              defaultValue="arivera-dev"
              placeholder="username"
            />
          </label>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <button className="btn btn-outline">
          Clear
        </button>
        <button className="btn btn-neutral">
          Save
        </button>
      </div>
    </fieldset>
  )
}

export default ProfileGithubSection
