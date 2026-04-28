export type ResumePersonalInfoValues = {
  fullName: string
  email: string
  phone: string
  address: string
  githubLabel: string
  githubUrl: string
}

type ResumePersonalInfoSectionProps = {
  values: ResumePersonalInfoValues
  onChange: (field: keyof ResumePersonalInfoValues, value: string) => void
}

function ResumePersonalInfoSection({ values, onChange }: ResumePersonalInfoSectionProps) {
  return (
    <fieldset className="fieldset">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="resume-personal-full-name">
            Full Name
          </label>
          <input
            id="resume-personal-full-name"
            type="text"
            className="input w-full"
            placeholder="e.g. Ada Lovelace"
            value={values.fullName}
            onChange={(event) => onChange('fullName', event.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="resume-personal-email">
            Email Address
          </label>
          <input
            id="resume-personal-email"
            type="email"
            className="input w-full"
            placeholder="name@company.com"
            value={values.email}
            onChange={(event) => onChange('email', event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="resume-personal-phone">
            Phone Number
          </label>
          <input
            id="resume-personal-phone"
            type="tel"
            className="input w-full"
            placeholder="+1 (234) 567-8901"
            value={values.phone}
            onChange={(event) => onChange('phone', event.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="resume-personal-address">
            Address
          </label>
          <input
            id="resume-personal-address"
            type="text"
            className="input w-full"
            placeholder="City, State, Country"
            value={values.address}
            onChange={(event) => onChange('address', event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="resume-personal-github-label">
            GitHub Label
          </label>
          <input
            id="resume-personal-github-label"
            type="text"
            className="input w-full"
            placeholder="GitHub"
            value={values.githubLabel}
            onChange={(event) => onChange('githubLabel', event.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="resume-personal-github-url">
            GitHub URL
          </label>
          <input
            id="resume-personal-github-url"
            type="url"
            className="input w-full"
            placeholder="https://github.com/username"
            value={values.githubUrl}
            onChange={(event) => onChange('githubUrl', event.target.value)}
          />
        </div>
      </div>
    </fieldset>
  )
}

export default ResumePersonalInfoSection
