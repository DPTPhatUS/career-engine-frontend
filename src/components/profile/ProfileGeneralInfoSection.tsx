type GeneralInfoValues = {
  fullName: string
  email: string
  phone: string
  address: string
}

type ProfileGeneralInfoSectionProps = {
  values: GeneralInfoValues
  disabled?: boolean
  isSaving?: boolean
  onChange: (field: keyof GeneralInfoValues, value: string) => void
  onClear: () => void
  onSave: () => void
}

function ProfileGeneralInfoSection({
  values,
  disabled = false,
  isSaving = false,
  onChange,
  onClear,
  onSave,
}: ProfileGeneralInfoSectionProps) {
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
            value={values.fullName}
            onChange={(event) => onChange('fullName', event.target.value)}
            placeholder="e.g. John Doe"
            disabled={disabled}
          />
        </div>

        <div className="w-full">
          <label className="label" htmlFor="profile-email">Email Address</label>
          <input
            id="profile-email"
            type="email"
            className="input w-full"
            value={values.email}
            onChange={(event) => onChange('email', event.target.value)}
            placeholder="name@company.com"
            disabled={disabled}
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
            value={values.phone}
            onChange={(event) => onChange('phone', event.target.value)}
            placeholder="+1 (234) 567-890"
            disabled={disabled}
          />
        </div>

        <div className="w-full">
          <label className="label" htmlFor="profile-location">Location / Address</label>
          <input
            id="profile-location"
            type="text"
            className="input w-full"
            value={values.address}
            onChange={(event) => onChange('address', event.target.value)}
            placeholder="City, State, Country"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <button type="button" className="btn btn-outline" onClick={onClear} disabled={disabled}>
          Clear
        </button>
        <button type="button" className="btn btn-neutral" onClick={onSave} disabled={disabled || isSaving}>
          Save
        </button>
      </div>
    </fieldset>
  )
}

export default ProfileGeneralInfoSection
