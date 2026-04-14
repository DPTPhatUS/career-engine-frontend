import ProfileFooter from '../components/profile/ProfileFooter'
import ProfileFormActions from '../components/profile/ProfileFormActions'
import ProfileGeneralInfoSection from '../components/profile/ProfileGeneralInfoSection'
import ProfileGithubSection from '../components/profile/ProfileGithubSection'
import ProfilePageHeader from '../components/profile/ProfilePageHeader'
import ProfileSidebar from '../components/profile/ProfileSidebar'
import ProfileTopNav from '../components/profile/ProfileTopNav'

function ProfileScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ProfileTopNav />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <ProfileSidebar />

          <section className="lg:col-span-9">
            <ProfilePageHeader />

            <div className="space-y-12 rounded-xl bg-base-100 p-8 shadow-(--ambient-shadow)">
              <ProfileGeneralInfoSection />
              <ProfileGithubSection />
              <ProfileFormActions />
            </div>
          </section>
        </div>
      </main>

      <ProfileFooter />
    </div>
  )
}

export default ProfileScreen
