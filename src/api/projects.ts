import { api } from './client'

type ProjectRecord = {
  id: string
  user_id: string
  sort_order: number
  title: string
  date_range: string
  github_url: string | null
  tech_stack: string | null
  bullets: string[]
  created_at: string
  updated_at: string
}

type ProjectPayload = {
  title: string
  date_range: string
  github_url?: string
  tech_stack?: string
  bullets?: string[]
  sort_order?: number
}

type ProjectPatchPayload = Partial<ProjectPayload>

type AutofillProjectPayload = {
  github_url: string
}

type AutofillProjectResponse = {
  title: string
  date_range: string
  github_url: string
  tech_stack: string
  bullets: string[]
}

type TailorProjectsPayload = {
  job_title: string
  job_description: string
  job_requirements: string
  project_ids: string[]
}

type RankProjectsPayload = {
  job_id: string
}

type RankedProject = {
  project_id: string
  similarity_score: number
}

type RankProjectsResponse = {
  ranked_projects: RankedProject[]
}

type TailoredProject = {
  project_id: string
  title: string
  date_range: string
  github_url: string
  tech_stack: string
  bullets: string[]
}

type SkippedProject = {
  project_id: string
  reason_code: string
  detail: string
}

type TailorProjectsResponse = {
  tailored_projects: TailoredProject[]
  skipped_projects: SkippedProject[]
}

async function listProjects() {
  return api<ProjectRecord[]>('/api/v1/projects')
}

async function createProject(payload: ProjectPayload) {
  return api<ProjectRecord>('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function updateProject(projectId: string, payload: ProjectPatchPayload) {
  return api<ProjectRecord>(`/api/v1/projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

async function deleteProject(projectId: string) {
  return api<void>(`/api/v1/projects/${projectId}`, {
    method: 'DELETE',
  })
}

async function autofillProject(payload: AutofillProjectPayload) {
  return api<AutofillProjectResponse>('/api/v1/projects/autofill', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function tailorProjects(payload: TailorProjectsPayload) {
  return api<TailorProjectsResponse>('/api/v1/projects/tailor', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function rankProjects(payload: RankProjectsPayload) {
  return api<RankProjectsResponse>('/api/v1/projects/rank', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export { autofillProject, createProject, deleteProject, listProjects, rankProjects, tailorProjects, updateProject }
export type {
  AutofillProjectPayload,
  AutofillProjectResponse,
  RankProjectsPayload,
  RankedProject,
  RankProjectsResponse,
  SkippedProject,
  TailorProjectsPayload,
  TailorProjectsResponse,
  TailoredProject,
  ProjectPatchPayload,
  ProjectPayload,
  ProjectRecord,
}
