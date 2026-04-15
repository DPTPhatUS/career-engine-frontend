import ProfileSectionHeading from './ProfileSectionHeading'
import ProfileTextField from './ProfileTextField'

function ProfileGeneralInfoSection() {
  return (
    <section>
      <ProfileSectionHeading title="General Information" accentClass="bg-primary" />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ProfileTextField
          label="Full Name"
          value="Alex Rivera"
          placeholder="e.g. John Doe"
        />

        <ProfileTextField
          label="Email Address"
          value="alex.rivera@careerengine.io"
          placeholder="name@company.com"
          type="email"
        />

        <ProfileTextField
          label="Phone Number"
          value="+1 (555) 012-3456"
          placeholder="+1 (234) 567-890"
          type="tel"
        />

        <ProfileTextField
          label="Location / Address"
          value="San Francisco, CA"
          placeholder="City, State, Country"
        />
      </div>
    </section>
  )
}

export default ProfileGeneralInfoSection
