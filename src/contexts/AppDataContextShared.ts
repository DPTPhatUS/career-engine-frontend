import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { CompanyRecord } from '../api/companies'
import type { EducationRecord } from '../api/educations'
import type { JobRecord } from '../api/jobs'
import type { ProfileRecord } from '../api/profile'
import type { ProjectRecord } from '../api/projects'

type AppDataContextValue = {
  isReady: boolean
  isBootstrapping: boolean
  profile: ProfileRecord | null
  companies: CompanyRecord[]
  jobs: JobRecord[]
  educations: EducationRecord[]
  projects: ProjectRecord[]
  profileError: string | null
  companiesError: string | null
  jobsError: string | null
  educationsError: string | null
  projectsError: string | null
  clearProfileError: () => void
  clearCompaniesError: () => void
  clearJobsError: () => void
  clearEducationsError: () => void
  clearProjectsError: () => void
  refreshProfile: () => Promise<ProfileRecord | null>
  refreshCompanies: () => Promise<CompanyRecord[]>
  refreshJobs: () => Promise<JobRecord[]>
  refreshEducations: () => Promise<EducationRecord[]>
  refreshProjects: () => Promise<ProjectRecord[]>
  refreshAll: () => Promise<void>
  setProfile: Dispatch<SetStateAction<ProfileRecord | null>>
  setCompanies: Dispatch<SetStateAction<CompanyRecord[]>>
  setJobs: Dispatch<SetStateAction<JobRecord[]>>
  setEducations: Dispatch<SetStateAction<EducationRecord[]>>
  setProjects: Dispatch<SetStateAction<ProjectRecord[]>>
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export type { AppDataContextValue }
export { AppDataContext }
