import ProfileFooter from '../components/profile/ProfileFooter'
import ProfileFormActions from '../components/profile/ProfileFormActions'
import ProfileGeneralInfoSection from '../components/profile/ProfileGeneralInfoSection'
import ProfileGithubSection from '../components/profile/ProfileGithubSection'
import ProfilePageHeader from '../components/profile/ProfilePageHeader'
import ProfileTopNav from '../components/profile/ProfileTopNav'

function ProfileScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ProfileTopNav />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 md:px-8 lg:pl-14 lg:pr-20">
        <section className="mx-auto w-full max-w-5xl">
          <ProfilePageHeader />

          <div className="tonal-card space-y-12 p-8">
            <ProfileGeneralInfoSection />
            <ProfileGithubSection />
            <ProfileFormActions />
          </div>
        </section>
      </main>

      <ProfileFooter />
    </div>
  )
}

export default ProfileScreen
