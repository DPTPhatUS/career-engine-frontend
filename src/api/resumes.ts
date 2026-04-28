import { api } from './client'

type ResumePersonalInfo = {
  full_name: string
  email: string
  phone?: string
  address?: string
  github_label?: string
  github_url?: string
}

type ResumeEducationItem = {
  university: string
  degree: string
  field: string
  time_period: string
  gpa?: string
  location?: string
  relevant_coursework?: string
}

type ResumeProjectItem = {
  title: string
  date_range: string
  github_url?: string
  tech_stack?: string
  bullets?: string[]
}

type ResumeSkillItem = {
  label: string
  values: string
}

type ResumePayload = {
  personal_info: ResumePersonalInfo
  education: ResumeEducationItem[]
  projects: ResumeProjectItem[]
  skills: ResumeSkillItem[]
}

type CreateResumePayload = {
  title: string
  payload: ResumePayload
}

type UpdateResumePayload = {
  title?: string
  payload?: ResumePayload
}

type ResumeRecord = {
  id: string
  user_id: string
  title: string
  payload: ResumePayload
  created_at: string
  updated_at: string
}

async function listResumes() {
  return api<ResumeRecord[]>('/api/v1/resumes')
}

async function createResume(payload: CreateResumePayload) {
  return api<ResumeRecord>('/api/v1/resumes', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function getResume(resumeId: string) {
  return api<ResumeRecord>(`/api/v1/resumes/${resumeId}`)
}

async function updateResume(resumeId: string, payload: UpdateResumePayload) {
  return api<ResumeRecord>(`/api/v1/resumes/${resumeId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

async function deleteResume(resumeId: string) {
  return api<void>(`/api/v1/resumes/${resumeId}`, {
    method: 'DELETE',
  })
}

export { createResume, deleteResume, getResume, listResumes, updateResume }
export type {
  CreateResumePayload,
  ResumeEducationItem,
  ResumePayload,
  ResumePersonalInfo,
  ResumeProjectItem,
  ResumeRecord,
  ResumeSkillItem,
  UpdateResumePayload,
}
