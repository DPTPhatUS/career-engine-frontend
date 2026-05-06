import { useEffect, useMemo, useState } from 'react'
import {
  createCompany,
  deleteCompany,
  updateCompany,
  type CompanyPayload,
  type CompanyRecord,
} from '../api/companies'
import CompaniesFormPane from '../components/companies/CompaniesFormPane'
import type { CompaniesFormValues } from '../components/companies/CompaniesFormPane.types'
import type { CompanyItem } from '../components/companies/CompanyCard.types'
import CompaniesListPane from '../components/companies/CompaniesListPane'
import CompaniesTopNav from '../components/companies/CompaniesTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useAppData } from '../contexts/useAppData'
import { useNotification } from '../contexts/useNotification'

function sortCompanies(items: CompanyRecord[]) {
  return [...items].sort((left, right) => {
    if (left.sort_order !== right.sort_order) {
      return left.sort_order - right.sort_order
    }

    return left.created_at.localeCompare(right.created_at)
  })
}

function mapCompanyToItem(company: CompanyRecord): CompanyItem {
  return {
    id: company.id,
    name: company.name,
    companyUrl: company.company_url ?? undefined,
    overview: company.overview ?? undefined,
  }
}

function createInitialFormValues(): CompaniesFormValues {
  return {
    name: '',
    companyUrl: '',
    overview: '',
  }
}

function mapCompanyToForm(company: CompanyRecord): CompaniesFormValues {
  return {
    name: company.name,
    companyUrl: company.company_url ?? '',
    overview: company.overview ?? '',
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

  return `https://${trimmed.replace(/^\/+/, '')}`
}

function buildCompanyPayload(values: CompaniesFormValues): CompanyPayload {
  return {
    name: values.name.trim(),
    company_url: normalizeCompanyUrl(values.companyUrl),
    overview: values.overview.trim() || undefined,
  }
}

function CompaniesScreen() {
  const {
    clearCompaniesError,
    companies,
    companiesError,
    refreshCompanies,
    setCompanies,
  } = useAppData()
  const { notifyError, notifySuccess } = useNotification()
  const [formValues, setFormValues] = useState<CompaniesFormValues>(createInitialFormValues)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const companyItems = useMemo(() => companies.map(mapCompanyToItem), [companies])

  useEffect(() => {
    if (!companiesError) {
      return
    }

    notifyError(companiesError)
    clearCompaniesError()
  }, [clearCompaniesError, companiesError, notifyError])

  function updateFormValue(field: keyof CompaniesFormValues, value: string) {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function resetForm() {
    setFormValues(createInitialFormValues())
    setEditingId(null)
  }

  async function handleSubmit() {
    const name = formValues.name.trim()
    if (!name) {
      notifyError('Company name is required.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = buildCompanyPayload(formValues)

      if (editingId) {
        const updated = await updateCompany(editingId, payload)
        setCompanies((previous) => sortCompanies(previous.map((company) => (company.id === updated.id ? updated : company))))
        notifySuccess('Company updated.')
      } else {
        const created = await createCompany(payload)
        setCompanies((previous) => sortCompanies([...previous, created]))
        notifySuccess('Company created.')
      }

      void refreshCompanies()
      resetForm()
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to save company.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(item: CompanyItem) {
    const target = companies.find((company) => company.id === item.id)
    if (!target) {
      return
    }

    setEditingId(target.id)
    setFormValues(mapCompanyToForm(target))
  }

  async function handleDelete(item: CompanyItem) {
    if (!window.confirm(`Delete company ${item.name}?`)) {
      return
    }

    setDeletingId(item.id)

    try {
      await deleteCompany(item.id)
      setCompanies((previous) => previous.filter((company) => company.id !== item.id))

      if (editingId === item.id) {
        resetForm()
      }

      notifySuccess('Company deleted.')
      void refreshCompanies()
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to delete company.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <CompaniesTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title="Saved Companies"
          description="Manage company records so jobs stay linked, searchable, and ready for tailoring."
        />

        <div className="grid grid-cols-12 items-start gap-8">
          <CompaniesListPane
            companies={companyItems}
            selectedId={editingId}
            deletingId={deletingId}
            onEdit={handleEdit}
            onDelete={(item) => void handleDelete(item)}
          />
          <CompaniesFormPane
            values={formValues}
            isEditing={Boolean(editingId)}
            isSubmitting={isSubmitting}
            onChange={updateFormValue}
            onSubmit={() => void handleSubmit()}
            onCancel={resetForm}
          />
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

export default CompaniesScreen
