import HomeBentoGrid from '../components/home/HomeBentoGrid'
import HomeStatsGrid from '../components/home/HomeStatsGrid'
import HomeTopNav from '../components/home/HomeTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'

function HomeScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <HomeTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title="Welcome back, Developer!"
          description="Discover your impact, explore opportunities, and connect with the developer ecosystem like never before."
        />
        <HomeStatsGrid />
        <HomeBentoGrid />
      </main>

      <AppFooter />
    </div>
  )
}

export default HomeScreen
