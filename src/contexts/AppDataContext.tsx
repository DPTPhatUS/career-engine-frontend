import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ApiError } from '../api/client'
import { listCompanies, type CompanyRecord } from '../api/companies'
import { listEducations, type EducationRecord } from '../api/educations'
import { listJobs, type JobRecord } from '../api/jobs'
import { getProfile, type ProfileRecord } from '../api/profile'
import { listProjects, type ProjectRecord } from '../api/projects'
import { AppDataContext } from './AppDataContextShared'
import type { AppDataContextValue } from './AppDataContextShared'
import { useAuth } from './useAuth'

type AppDataProviderProps = {
  children: ReactNode
}

function AppDataProvider({ children }: AppDataProviderProps) {
  const { status, user } = useAuth()

  const [isReady, setIsReady] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(false)

  const [profile, setProfile] = useState<ProfileRecord | null>(null)
  const [companies, setCompanies] = useState<CompanyRecord[]>([])
  const [jobs, setJobs] = useState<JobRecord[]>([])
  const [educations, setEducations] = useState<EducationRecord[]>([])
  const [projects, setProjects] = useState<ProjectRecord[]>([])

  const [profileError, setProfileError] = useState<string | null>(null)
  const [companiesError, setCompaniesError] = useState<string | null>(null)
  const [jobsError, setJobsError] = useState<string | null>(null)
  const [educationsError, setEducationsError] = useState<string | null>(null)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  const activeUserIdRef = useRef<string | null>(null)
  const bootstrapRequestRef = useRef(0)

  const clearAllData = useCallback(() => {
    activeUserIdRef.current = null
    setIsReady(false)
    setIsBootstrapping(false)
    setProfile(null)
    setCompanies([])
    setJobs([])
    setEducations([])
    setProjects([])
    setProfileError(null)
    setCompaniesError(null)
    setJobsError(null)
    setEducationsError(null)
    setProjectsError(null)
  }, [])

  const clearProfileError = useCallback(() => {
    setProfileError(null)
  }, [])

  const clearCompaniesError = useCallback(() => {
    setCompaniesError(null)
  }, [])

  const clearJobsError = useCallback(() => {
    setJobsError(null)
  }, [])

  const clearEducationsError = useCallback(() => {
    setEducationsError(null)
  }, [])

  const clearProjectsError = useCallback(() => {
    setProjectsError(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      const nextProfile = await getProfile()
      setProfile(nextProfile)
      setProfileError(null)
      return nextProfile
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setProfile(null)
        setProfileError(null)
        return null
      }

      const message = error instanceof Error ? error.message : 'Unable to load profile'
      setProfileError(message)
      throw error
    }
  }, [])

  const refreshCompanies = useCallback(async () => {
    try {
      const nextCompanies = await listCompanies()
      setCompanies(nextCompanies)
      setCompaniesError(null)
      return nextCompanies
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load companies'
      setCompaniesError(message)
      throw error
    }
  }, [])

  const refreshJobs = useCallback(async () => {
    try {
      const nextJobs = await listJobs()
      setJobs(nextJobs)
      setJobsError(null)
      return nextJobs
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load jobs'
      setJobsError(message)
      throw error
    }
  }, [])

  const refreshEducations = useCallback(async () => {
    try {
      const nextEducations = await listEducations()
      setEducations(nextEducations)
      setEducationsError(null)
      return nextEducations
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load education history'
      setEducationsError(message)
      throw error
    }
  }, [])

  const refreshProjects = useCallback(async () => {
    try {
      const nextProjects = await listProjects()
      setProjects(nextProjects)
      setProjectsError(null)
      return nextProjects
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load projects'
      setProjectsError(message)
      throw error
    }
  }, [])

  const refreshAll = useCallback(async () => {
    await Promise.allSettled([
      refreshProfile(),
      refreshCompanies(),
      refreshJobs(),
      refreshEducations(),
      refreshProjects(),
    ])
  }, [refreshCompanies, refreshEducations, refreshJobs, refreshProfile, refreshProjects])

  useEffect(() => {
    if (status === 'unauthenticated') {
      const clearTimer = window.setTimeout(() => {
        clearAllData()
      }, 0)

      return () => {
        window.clearTimeout(clearTimer)
      }
    }

    if (status !== 'authenticated' || !user?.user_id) {
      return
    }

    const currentUserId = user.user_id
    const isSameUser = activeUserIdRef.current === currentUserId

    if (isSameUser && isReady) {
      return
    }

    const requestId = bootstrapRequestRef.current + 1
    bootstrapRequestRef.current = requestId

    let isActive = true

    async function bootstrap() {
      await Promise.resolve()

      if (!isActive || bootstrapRequestRef.current !== requestId) {
        return
      }

      if (!isSameUser) {
        setProfile(null)
        setCompanies([])
        setJobs([])
        setEducations([])
        setProjects([])
        setProfileError(null)
        setCompaniesError(null)
        setJobsError(null)
        setEducationsError(null)
        setProjectsError(null)
      }

      setIsReady(false)
      setIsBootstrapping(true)

      await Promise.allSettled([
        refreshProfile(),
        refreshCompanies(),
        refreshJobs(),
        refreshEducations(),
        refreshProjects(),
      ])

      if (!isActive || bootstrapRequestRef.current !== requestId) {
        return
      }

      activeUserIdRef.current = currentUserId
      setIsBootstrapping(false)
      setIsReady(true)
    }

    void bootstrap()

    return () => {
      isActive = false
    }
  }, [
    clearAllData,
    isReady,
    refreshEducations,
    refreshCompanies,
    refreshJobs,
    refreshProfile,
    refreshProjects,
    status,
    user?.user_id,
  ])

  const value = useMemo<AppDataContextValue>(
    () => ({
      isReady,
      isBootstrapping,
      profile,
      companies,
      jobs,
      educations,
      projects,
      profileError,
      companiesError,
      jobsError,
      educationsError,
      projectsError,
      clearProfileError,
      clearCompaniesError,
      clearJobsError,
      clearEducationsError,
      clearProjectsError,
      refreshProfile,
      refreshCompanies,
      refreshJobs,
      refreshEducations,
      refreshProjects,
      refreshAll,
      setProfile,
      setCompanies,
      setJobs,
      setEducations,
      setProjects,
    }),
    [
      clearCompaniesError,
      clearEducationsError,
      clearJobsError,
      clearProfileError,
      clearProjectsError,
      companies,
      companiesError,
      educations,
      educationsError,
      jobs,
      jobsError,
      isBootstrapping,
      isReady,
      profile,
      profileError,
      projects,
      projectsError,
      refreshAll,
      refreshCompanies,
      refreshEducations,
      refreshJobs,
      refreshProfile,
      refreshProjects,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export { AppDataProvider }
