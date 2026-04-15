import ProfileSectionHeading from './ProfileSectionHeading'
import ProfileTextField from './ProfileTextField'

function ProfileGithubSection() {
  return (
    <section>
      <ProfileSectionHeading title="GitHub Integration" accentClass="bg-secondary" />

      <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2">
        <ProfileTextField
          label="GitHub Label"
          value="Personal Portfolio"
          placeholder="e.g. Primary Repo"
        />

        <ProfileTextField
          label="GitHub Profile Link"
          value="arivera-dev"
          placeholder="username"
          prefix="github.com/"
        />
      </div>

      <div className="alert mt-6 border-0 bg-secondary/20 text-secondary-content">
        <span className="grid h-5 w-5 place-content-center rounded-full bg-secondary text-[10px] font-bold text-secondary-content">
          I
        </span>
        <span className="text-sm leading-relaxed">
          Linking your GitHub allows Career Engine to automatically parse your top projects and
          showcase your commit history to potential recruiters.
        </span>
      </div>
    </section>
  )
}

export default ProfileGithubSection
