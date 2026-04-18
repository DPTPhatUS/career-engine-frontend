import ProfileAlert from '../components/profile/ProfileAlert'
import ProfileGeneralInfoSection from '../components/profile/ProfileGeneralInfoSection'
import ProfileGithubSection from '../components/profile/ProfileGithubSection'
import ProfileTopNav from '../components/profile/ProfileTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'

function ProfileScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ProfileTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title="Profile Management"
          description="Manage your public information and developer presence across the Career Engine platform."
        />
        <div className='space-y-8'>
          <ProfileGeneralInfoSection />
          <ProfileGithubSection />
          <ProfileAlert />
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

export default ProfileScreen
