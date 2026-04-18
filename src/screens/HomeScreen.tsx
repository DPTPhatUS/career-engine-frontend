import HomeBentoGrid from '../components/home/HomeBentoGrid'
import HomeFooter from '../components/home/HomeFooter'
import HomeHero from '../components/home/HomeHero'
import HomeStatsGrid from '../components/home/HomeStatsGrid'
import HomeTopNav from '../components/home/HomeTopNav'

function HomeScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <HomeTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <HomeHero />
        <HomeStatsGrid />
        <HomeBentoGrid />
      </main>

      <HomeFooter />
    </div>
  )
}

export default HomeScreen
