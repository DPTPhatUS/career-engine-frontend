import { useEffect, useState } from 'react'
import { listEducations } from '../api/educations'
import { getProfile } from '../api/profile'
import { listProjects } from '../api/projects'
import HomeBentoGrid from '../components/home/HomeBentoGrid'
import HomeStatsGrid from '../components/home/HomeStatsGrid'
import HomeTopNav from '../components/home/HomeTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useAuth } from '../contexts/AuthContext'

function titleCaseFromEmail(email: string) {
  const localPart = email.split('@')[0] ?? ''
  const normalized = localPart
    .replace(/[._-]+/g, ' ')
    .trim()

  if (!normalized) {
    return 'Developer'
  }

  return normalized.replace(/\b\w/g, (character) => character.toUpperCase())
}

function HomeScreen() {
  const { user } = useAuth()
  const [educationCount, setEducationCount] = useState(0)
  const [projectCount, setProjectCount] = useState(0)
  const [profileName, setProfileName] = useState<string | null>(null)

  const fallbackName = user?.email ? titleCaseFromEmail(user.email) : 'Developer'

  useEffect(() => {
    let isActive = true

    async function loadData() {
      const [profileResult, educationResult, projectResult] = await Promise.allSettled([
        getProfile(),
        listEducations(),
        listProjects(),
      ])

      if (!isActive) {
        return
      }

      if (profileResult.status === 'fulfilled') {
        const trimmedName = profileResult.value.full_name.trim()
        setProfileName(trimmedName.length > 0 ? trimmedName : null)
      }

      if (educationResult.status === 'fulfilled') {
        setEducationCount(educationResult.value.length)
      }

      if (projectResult.status === 'fulfilled') {
        setProjectCount(projectResult.value.length)
      }
    }

    void loadData()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <HomeTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title={`Welcome back, ${profileName ?? fallbackName}!`}
          description="Discover your impact, explore opportunities, and connect with the developer ecosystem like never before."
        />
        <HomeStatsGrid educationCount={educationCount} projectCount={projectCount} />
        <HomeBentoGrid />
      </main>

      <AppFooter />
    </div>
  )
}

export default HomeScreen
