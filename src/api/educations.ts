import { api } from './client'

type EducationRecord = {
  id: string
  user_id: string
  sort_order: number
  university: string
  degree: string
  field: string
  time_period: string
  gpa: string | null
  location: string | null
  relevant_coursework: string | null
  created_at: string
  updated_at: string
}

type EducationPayload = {
  university: string
  degree: string
  field: string
  time_period: string
  gpa?: string
  location?: string
  relevant_coursework?: string
  sort_order?: number
}

type EducationPatchPayload = Partial<EducationPayload>

async function listEducations() {
  return api<EducationRecord[]>('/api/v1/educations')
}

async function createEducation(payload: EducationPayload) {
  return api<EducationRecord>('/api/v1/educations', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function updateEducation(educationId: string, payload: EducationPatchPayload) {
  return api<EducationRecord>(`/api/v1/educations/${educationId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

async function deleteEducation(educationId: string) {
  return api<void>(`/api/v1/educations/${educationId}`, {
    method: 'DELETE',
  })
}

export { createEducation, deleteEducation, listEducations, updateEducation }
export type { EducationPatchPayload, EducationPayload, EducationRecord }
