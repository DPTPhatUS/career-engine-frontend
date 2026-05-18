import { api } from './client'

type PortfolioContactOptions = {
  include_email?: boolean
  include_phone?: boolean
  include_address?: boolean
  include_github?: boolean
}

type PortfolioSelection = {
  education_indexes?: number[]
  project_indexes?: number[]
  skill_indexes?: number[]
}

type PublishPortfolioPayload = {
  source_resume_id: string
  slug: string
  title?: string
  contact?: PortfolioContactOptions
  selection?: PortfolioSelection
  is_published?: boolean
}

type UpdatePortfolioPublicationPayload = PublishPortfolioPayload

type PublicPortfolioSnapshot = {
  personal_info?: {
    full_name?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    github_label?: string | null
    github_url?: string | null
  }
  education?: Array<{
    university?: string
    degree?: string
    field?: string
    time_period?: string
    gpa?: string | null
    location?: string | null
    relevant_coursework?: string | null
  }>
  projects?: Array<{
    title?: string
    date_range?: string
    github_url?: string | null
    tech_stack?: string | null
    bullets?: string[]
  }>
  skills?: Array<{
    label?: string
    values?: string
  }>
}

type PortfolioPublicationRecord = {
  id: string
  source_resume_id: string | null
  slug: string
  title: string
  is_published: boolean
  public_url: string
  snapshot: PublicPortfolioSnapshot
  published_at: string | null
  created_at: string
  updated_at: string
}

type PublicPortfolioRecord = {
  slug: string
  title: string
  snapshot: PublicPortfolioSnapshot
  published_at: string | null
  updated_at: string
}

async function listPortfolioPublications(): Promise<PortfolioPublicationRecord[]> {
  return api<PortfolioPublicationRecord[]>('/api/v1/portfolio-publications')
}

async function publishPortfolio(payload: PublishPortfolioPayload): Promise<PortfolioPublicationRecord> {
  return api<PortfolioPublicationRecord>('/api/v1/portfolio-publications', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function updatePortfolioPublication(
  publicationId: string,
  payload: UpdatePortfolioPublicationPayload,
): Promise<PortfolioPublicationRecord> {
  return api<PortfolioPublicationRecord>(`/api/v1/portfolio-publications/${publicationId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

async function updatePortfolioVisibility(
  publicationId: string,
  is_published: boolean,
): Promise<PortfolioPublicationRecord> {
  return api<PortfolioPublicationRecord>(`/api/v1/portfolio-publications/${publicationId}/visibility`, {
    method: 'PATCH',
    body: JSON.stringify({ is_published }),
  })
}

async function deletePortfolioPublication(publicationId: string): Promise<void> {
  await api<void>(`/api/v1/portfolio-publications/${publicationId}`, {
    method: 'DELETE',
  })
}

async function getPublicPortfolioBySlug(slug: string): Promise<PublicPortfolioRecord> {
  return api<PublicPortfolioRecord>(`/api/v1/public/portfolios/${encodeURIComponent(slug)}`)
}

export {
  deletePortfolioPublication,
  getPublicPortfolioBySlug,
  listPortfolioPublications,
  publishPortfolio,
  updatePortfolioPublication,
  updatePortfolioVisibility,
}
export type {
  PortfolioContactOptions,
  PortfolioPublicationRecord,
  PortfolioSelection,
  PublicPortfolioRecord,
  PublicPortfolioSnapshot,
  PublishPortfolioPayload,
  UpdatePortfolioPublicationPayload,
}
