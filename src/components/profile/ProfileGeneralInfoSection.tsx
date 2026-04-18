function ProfileGeneralInfoSection() {
  return (
    <fieldset className="fieldset bg-base-200 border border-base-300 rounded-box p-4">
      <legend className="fieldset-legend">
        General Information
      </legend>

      <div className="grid grid-cols-2 gap-x-4">
        <div className="w-full">
          <label className="label" htmlFor="profile-full-name">Full Name</label>
          <input
            id="profile-full-name"
            type="text"
            className="input w-full"
            defaultValue="Alex Rivera"
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="w-full">
          <label className="label" htmlFor="profile-email">Email Address</label>
          <input
            id="profile-email"
            type="email"
            className="input w-full"
            defaultValue="alex.rivera@careerengine.io"
            placeholder="name@company.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <div className="w-full">
          <label className="label" htmlFor="profile-phone">Phone Number</label>
          <input
            id="profile-phone"
            type="tel"
            className="input w-full"
            defaultValue="+1 (555) 012-3456"
            placeholder="+1 (234) 567-890"
          />
        </div>

        <div className="w-full">
          <label className="label" htmlFor="profile-location">Location / Address</label>
          <input
            id="profile-location"
            type="text"
            className="input w-full"
            defaultValue="San Francisco, CA"
            placeholder="City, State, Country"
          />
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

export default ProfileGeneralInfoSection
