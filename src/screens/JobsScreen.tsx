import { useEffect, useMemo, useState } from 'react'
import { createCompany, type CompanyPayload, type CompanyRecord } from '../api/companies'
import { createJob, deleteJob, updateJob, type JobPayload, type JobRecord } from '../api/jobs'
import JobsFormPane from '../components/jobs/JobsFormPane'
import type {
  CompanyOption,
  InlineCompanyFormValues,
  JobsFormValues,
} from '../components/jobs/JobsFormPane.types'
import type { JobItem } from '../components/jobs/JobCard.types'
import JobsListPane from '../components/jobs/JobsListPane'
import JobsTopNav from '../components/jobs/JobsTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useAppData } from '../contexts/useAppData'
import { useNotification } from '../contexts/useNotification'

function sortJobs(items: JobRecord[]) {
  return [...items].sort((left, right) => {
    if (left.sort_order !== right.sort_order) {
      return left.sort_order - right.sort_order
    }

    return left.created_at.localeCompare(right.created_at)
  })
}

function createInitialFormValues(): JobsFormValues {
  return {
    companyId: '',
    title: '',
    jobDescription: '',
    jobRequirements: '',
  }
}

function createInlineCompanyInitialValues(): InlineCompanyFormValues {
  return {
    name: '',
    companyUrl: '',
    overview: '',
  }
}

function normalizeCompanyUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  const withoutWww = trimmed.replace(/^www\./i, '')
  if (/^\/\//.test(withoutWww)) {
    return `https:${withoutWww}`
  }

  return `https://${withoutWww.replace(/^\/+/, '')}`
}

function mapJobToItem(job: JobRecord, companyById: Map<string, CompanyRecord>): JobItem {
  const company = companyById.get(job.company_id)

  return {
    id: job.id,
    companyId: job.company_id,
    companyName: company?.name ?? 'Unknown company',
    companyUrl: company?.company_url ?? undefined,
    title: job.title,
    jobDescription: job.job_description,
    jobRequirements: job.job_requirements,
  }
}

function mapJobToForm(job: JobRecord): JobsFormValues {
  return {
    companyId: job.company_id,
    title: job.title,
    jobDescription: job.job_description,
    jobRequirements: job.job_requirements,
  }
}

function buildJobPayload(values: JobsFormValues): JobPayload {
  return {
    company_id: values.companyId.trim(),
    title: values.title.trim(),
    job_description: values.jobDescription.trim(),
    job_requirements: values.jobRequirements.trim(),
  }
}

function buildInlineCompanyPayload(values: InlineCompanyFormValues): CompanyPayload {
  const companyUrl = normalizeCompanyUrl(values.companyUrl)
  const overview = values.overview.trim()

  return {
    name: values.name.trim(),
    ...(companyUrl ? { company_url: companyUrl } : {}),
    ...(overview ? { overview } : {}),
  }
}

function JobsScreen() {
  const {
    clearCompaniesError,
    clearJobsError,
    companies,
    companiesError,
    jobs,
    jobsError,
    refreshCompanies,
    refreshJobs,
    setCompanies,
    setJobs,
  } = useAppData()
  const { notifyError, notifySuccess } = useNotification()

  const [formValues, setFormValues] = useState<JobsFormValues>(createInitialFormValues)
  const [inlineCompanyValues, setInlineCompanyValues] = useState<InlineCompanyFormValues>(
    createInlineCompanyInitialValues,
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingCompany, setIsCreatingCompany] = useState(false)
  const [isInlineCompanyFormOpen, setIsInlineCompanyFormOpen] = useState(false)

  const companyOptions = useMemo<CompanyOption[]>(
    () => companies.map((company) => ({ id: company.id, name: company.name })),
    [companies],
  )

  const companyById = useMemo(
    () => new Map<string, CompanyRecord>(companies.map((company) => [company.id, company])),
    [companies],
  )
  const jobItems = useMemo(() => jobs.map((job) => mapJobToItem(job, companyById)), [companyById, jobs])

  useEffect(() => {
    if (!companiesError) {
      return
    }

    notifyError(companiesError)
    clearCompaniesError()
  }, [clearCompaniesError, companiesError, notifyError])

  useEffect(() => {
    if (!jobsError) {
      return
    }

    notifyError(jobsError)
    clearJobsError()
  }, [clearJobsError, jobsError, notifyError])

  function updateFormValue(field: keyof JobsFormValues, value: string) {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function updateInlineCompanyValue(field: keyof InlineCompanyFormValues, value: string) {
    setInlineCompanyValues((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function resetForm() {
    setFormValues(createInitialFormValues())
    setEditingId(null)
  }

  function resetInlineCompanyForm() {
    setInlineCompanyValues(createInlineCompanyInitialValues())
    setIsInlineCompanyFormOpen(false)
  }

  function handleToggleInlineCompany() {
    setIsInlineCompanyFormOpen((previous) => !previous)
  }

  async function handleCreateInlineCompany() {
    const name = inlineCompanyValues.name.trim()
    if (!name) {
      notifyError('Company name is required.')
      return
    }

    setIsCreatingCompany(true)

    try {
      const payload = buildInlineCompanyPayload(inlineCompanyValues)
      const created = await createCompany(payload)

      setCompanies((previous) => [...previous, created].sort((left, right) => left.sort_order - right.sort_order))
      setFormValues((previous) => ({
        ...previous,
        companyId: created.id,
      }))
      setInlineCompanyValues(createInlineCompanyInitialValues())
      setIsInlineCompanyFormOpen(false)
      notifySuccess('Company created and selected.')
      void refreshCompanies()
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to create company')
    } finally {
      setIsCreatingCompany(false)
    }
  }

  async function handleSubmit() {
    const companyId = formValues.companyId.trim()
    const title = formValues.title.trim()
    const description = formValues.jobDescription.trim()
    const requirements = formValues.jobRequirements.trim()

    if (!companyId || !title || !description || !requirements) {
      notifyError('Company, title, description, and requirements are required.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = buildJobPayload(formValues)

      if (editingId) {
        const updated = await updateJob(editingId, payload)
        setJobs((previous) => sortJobs(previous.map((job) => (job.id === updated.id ? updated : job))))
        notifySuccess('Job updated.')
      } else {
        const created = await createJob(payload)
        setJobs((previous) => sortJobs([...previous, created]))
        notifySuccess('Job created.')
      }

      void refreshJobs()
      resetForm()
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to save job')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(item: JobItem) {
    const target = jobs.find((job) => job.id === item.id)
    if (!target) {
      return
    }

    setEditingId(target.id)
    setFormValues(mapJobToForm(target))
    setIsInlineCompanyFormOpen(false)
  }

  async function handleDelete(item: JobItem) {
    const confirmed = window.confirm(`Delete job ${item.title} at ${item.companyName}?`)
    if (!confirmed) {
      return
    }

    setDeletingId(item.id)

    try {
      await deleteJob(item.id)
      setJobs((previous) => previous.filter((job) => job.id !== item.id))

      if (editingId === item.id) {
        resetForm()
      }

      notifySuccess('Job deleted.')
      void refreshJobs()
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to delete job')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <JobsTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title="Saved Jobs"
          description="Track target roles, capture what each company asks for, and keep your applications organized."
        />

        <div className="grid grid-cols-12 items-start gap-8">
          <JobsListPane
            jobs={jobItems}
            selectedId={editingId}
            deletingId={deletingId}
            onEdit={handleEdit}
            onDelete={(item) => void handleDelete(item)}
          />
          <JobsFormPane
            values={formValues}
            inlineCompanyValues={inlineCompanyValues}
            companies={companyOptions}
            isEditing={Boolean(editingId)}
            isSubmitting={isSubmitting}
            showInlineCompanyForm={isInlineCompanyFormOpen}
            isCreatingCompany={isCreatingCompany}
            onChange={updateFormValue}
            onInlineCompanyChange={updateInlineCompanyValue}
            onSubmit={() => void handleSubmit()}
            onCancel={resetForm}
            onToggleInlineCompany={handleToggleInlineCompany}
            onCreateInlineCompany={() => void handleCreateInlineCompany()}
            onCancelInlineCompany={resetInlineCompanyForm}
          />
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

export default JobsScreen
