import HomeBentoGrid from '../components/home/HomeBentoGrid'
import HomeFab from '../components/home/HomeFab'
import HomeFooter from '../components/home/HomeFooter'
import HomeHero from '../components/home/HomeHero'
import HomeRecentActivity from '../components/home/HomeRecentActivity'
import HomeStatsGrid from '../components/home/HomeStatsGrid'
import HomeTopNav from '../components/home/HomeTopNav'

function HomeScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <HomeTopNav />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 md:px-8 lg:pl-14 lg:pr-20">
        <HomeHero />
        <HomeStatsGrid />
        <HomeBentoGrid />
        <HomeRecentActivity />
      </main>

      <HomeFooter />
      <HomeFab />
    </div>
  )
}

export default HomeScreen
