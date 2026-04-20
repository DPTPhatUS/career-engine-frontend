import { api } from './client'

type ProfileRecord = {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string | null
  address: string | null
  github_label: string | null
  github_url: string | null
  created_at: string
  updated_at: string
}

type UpsertProfilePayload = {
  full_name: string
  email: string
  phone?: string
  address?: string
  github_label?: string
  github_url?: string
}

async function getProfile() {
  return api<ProfileRecord>('/api/v1/profile')
}

async function upsertProfile(payload: UpsertProfilePayload) {
  return api<ProfileRecord>('/api/v1/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export { getProfile, upsertProfile }
export type { ProfileRecord, UpsertProfilePayload }
