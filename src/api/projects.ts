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

export { autofillProject, createProject, deleteProject, listProjects, updateProject }
export type {
  AutofillProjectPayload,
  AutofillProjectResponse,
  ProjectPatchPayload,
  ProjectPayload,
  ProjectRecord,
}
