import HomeBentoGrid from '../components/home/HomeBentoGrid'
import HomeStatsGrid from '../components/home/HomeStatsGrid'
import HomeTopNav from '../components/home/HomeTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useAppData } from '../contexts/useAppData'

function HomeScreen() {
  const { educations, profile, projects } = useAppData()

  const profileName = profile?.full_name.trim() ?? ''
  const title = profileName ? `Welcome back, ${profileName}!` : 'Welcome back!'

  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <HomeTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title={title}
          description="Discover your impact, explore opportunities, and connect with the developer ecosystem like never before."
        />
        <HomeStatsGrid educationCount={educations.length} projectCount={projects.length} />
        <HomeBentoGrid />
      </main>

      <AppFooter />
    </div>
  )
}

export default HomeScreen
