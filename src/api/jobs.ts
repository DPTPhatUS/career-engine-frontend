import { api } from './client'

type JobRecord = {
  id: string
  user_id: string
  sort_order: number
  company_id: string
  title: string
  job_description: string
  job_requirements: string
  created_at: string
  updated_at: string
}

type JobPayload = {
  company_id: string
  title: string
  job_description: string
  job_requirements: string
  sort_order?: number
}

type JobPatchPayload = Partial<JobPayload>

async function listJobs() {
  return api<JobRecord[]>('/api/v1/jobs')
}

async function createJob(payload: JobPayload) {
  return api<JobRecord>('/api/v1/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function updateJob(jobId: string, payload: JobPatchPayload) {
  return api<JobRecord>(`/api/v1/jobs/${jobId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

async function deleteJob(jobId: string) {
  return api<void>(`/api/v1/jobs/${jobId}`, {
    method: 'DELETE',
  })
}

export { createJob, deleteJob, listJobs, updateJob }
export type { JobPatchPayload, JobPayload, JobRecord }
