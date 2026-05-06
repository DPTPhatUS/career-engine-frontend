import { api } from './client'

type CompanyRecord = {
  id: string
  user_id: string
  sort_order: number
  name: string
  company_url: string | null
  overview: string | null
  created_at: string
  updated_at: string
}

type CompanyPayload = {
  name: string
  company_url?: string
  overview?: string
  sort_order?: number
}

type CompanyPatchPayload = Partial<CompanyPayload>

async function listCompanies() {
  return api<CompanyRecord[]>('/api/v1/companies')
}

async function createCompany(payload: CompanyPayload) {
  return api<CompanyRecord>('/api/v1/companies', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function updateCompany(companyId: string, payload: CompanyPatchPayload) {
  return api<CompanyRecord>(`/api/v1/companies/${companyId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

async function deleteCompany(companyId: string) {
  return api<void>(`/api/v1/companies/${companyId}`, {
    method: 'DELETE',
  })
}

export { createCompany, deleteCompany, listCompanies, updateCompany }
export type { CompanyPatchPayload, CompanyPayload, CompanyRecord }
