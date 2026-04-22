import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { ApiError } from '../api/client'
import { listEducations, type EducationRecord } from '../api/educations'
import { getProfile, type ProfileRecord } from '../api/profile'
import { listProjects, type ProjectRecord } from '../api/projects'
import { useAuth } from './AuthContext'

type AppDataContextValue = {
  isReady: boolean
  isBootstrapping: boolean
  profile: ProfileRecord | null
  educations: EducationRecord[]
  projects: ProjectRecord[]
  profileError: string | null
  educationsError: string | null
  projectsError: string | null
  clearProfileError: () => void
  clearEducationsError: () => void
  clearProjectsError: () => void
  refreshProfile: () => Promise<ProfileRecord | null>
  refreshEducations: () => Promise<EducationRecord[]>
  refreshProjects: () => Promise<ProjectRecord[]>
  refreshAll: () => Promise<void>
  setProfile: Dispatch<SetStateAction<ProfileRecord | null>>
  setEducations: Dispatch<SetStateAction<EducationRecord[]>>
  setProjects: Dispatch<SetStateAction<ProjectRecord[]>>
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

type AppDataProviderProps = {
  children: ReactNode
}

function AppDataProvider({ children }: AppDataProviderProps) {
  const { status, user } = useAuth()

  const [isReady, setIsReady] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(false)

  const [profile, setProfile] = useState<ProfileRecord | null>(null)
  const [educations, setEducations] = useState<EducationRecord[]>([])
  const [projects, setProjects] = useState<ProjectRecord[]>([])

  const [profileError, setProfileError] = useState<string | null>(null)
  const [educationsError, setEducationsError] = useState<string | null>(null)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  const activeUserIdRef = useRef<string | null>(null)
  const bootstrapRequestRef = useRef(0)

  const clearAllData = useCallback(() => {
    activeUserIdRef.current = null
    setIsReady(false)
    setIsBootstrapping(false)
    setProfile(null)
    setEducations([])
    setProjects([])
    setProfileError(null)
    setEducationsError(null)
    setProjectsError(null)
  }, [])

  const clearProfileError = useCallback(() => {
    setProfileError(null)
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
    await Promise.allSettled([refreshProfile(), refreshEducations(), refreshProjects()])
  }, [refreshEducations, refreshProfile, refreshProjects])

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
        setEducations([])
        setProjects([])
        setProfileError(null)
        setEducationsError(null)
        setProjectsError(null)
      }

      setIsReady(false)
      setIsBootstrapping(true)

      await Promise.allSettled([refreshProfile(), refreshEducations(), refreshProjects()])

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
      educations,
      projects,
      profileError,
      educationsError,
      projectsError,
      clearProfileError,
      clearEducationsError,
      clearProjectsError,
      refreshProfile,
      refreshEducations,
      refreshProjects,
      refreshAll,
      setProfile,
      setEducations,
      setProjects,
    }),
    [
      clearEducationsError,
      clearProfileError,
      clearProjectsError,
      educations,
      educationsError,
      isBootstrapping,
      isReady,
      profile,
      profileError,
      projects,
      projectsError,
      refreshAll,
      refreshEducations,
      refreshProfile,
      refreshProjects,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

function useAppData() {
  const context = useContext(AppDataContext)

  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider')
  }

  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { AppDataProvider, useAppData }
