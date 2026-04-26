import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { EducationRecord } from '../api/educations'
import type { ProfileRecord } from '../api/profile'
import type { ProjectRecord } from '../api/projects'

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

export type { AppDataContextValue }
export { AppDataContext }
