import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createEducation,
  deleteEducation,
  listEducations,
  updateEducation,
  type EducationPayload,
  type EducationRecord,
} from '../api/educations'
import EducationFormPane from '../components/education/EducationFormPane'
import type { CompletionStatus, EducationFormValues } from '../components/education/EducationFormPane'
import type { EducationItem } from '../components/education/EducationCard'
import EducationListPane from '../components/education/EducationListPane'
import EducationTopNav from '../components/education/EducationTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'

function formatMonthYear(value: string) {
  const [year, month] = value.split('-')
  const parsedYear = Number(year)
  const parsedMonth = Number(month)

  if (!parsedYear || !parsedMonth) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(parsedYear, parsedMonth - 1, 1))
}

function parseMonthInput(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return trimmed
  }

  if (/^\d{4}$/.test(trimmed)) {
    return `${trimmed}-01`
  }

  const match = trimmed.match(/^([A-Za-z]{3,9})\s+(\d{4})$/)
  if (!match) {
    return ''
  }

  const monthMap: Record<string, string> = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
  }

  const month = monthMap[match[1].slice(0, 3).toLowerCase()]
  if (!month) {
    return ''
  }

  return `${match[2]}-${month}`
}

function parseTimePeriod(timePeriod: string): {
  startMonth: string
  endMonth: string
  completionStatus: CompletionStatus
} {
  const parts = timePeriod.split(/\s*-\s*/)

  if (parts.length < 2) {
    return {
      startMonth: parseMonthInput(timePeriod),
      endMonth: '',
      completionStatus: 'completed',
    }
  }

  const startPart = parts[0] ?? ''
  const endPart = parts.slice(1).join(' - ')
  const normalizedEnd = endPart.trim().toLowerCase()

  if (normalizedEnd.includes('present')) {
    return {
      startMonth: parseMonthInput(startPart),
      endMonth: '',
      completionStatus: 'present',
    }
  }

  if (normalizedEnd.includes('expected')) {
    return {
      startMonth: parseMonthInput(startPart),
      endMonth: '',
      completionStatus: 'expected',
    }
  }

  return {
    startMonth: parseMonthInput(startPart),
    endMonth: parseMonthInput(endPart),
    completionStatus: 'completed',
  }
}

function parseCoursework(value: string | null) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function mapEducationToCardItem(education: EducationRecord): EducationItem {
  return {
    id: education.id,
    university: education.university,
    degree: education.degree,
    timePeriod: education.time_period,
    location: education.location ?? undefined,
    gpa: education.gpa ?? undefined,
    field: education.field,
    coursework: parseCoursework(education.relevant_coursework),
  }
}

function mapEducationToForm(education: EducationRecord): EducationFormValues {
  const parsedPeriod = parseTimePeriod(education.time_period)

  return {
    university: education.university,
    degree: education.degree,
    field: education.field,
    startMonth: parsedPeriod.startMonth,
    endMonth: parsedPeriod.endMonth,
    completionStatus: parsedPeriod.completionStatus,
    gpa: education.gpa ?? '',
    location: education.location ?? '',
    coursework: education.relevant_coursework ?? '',
  }
}

function createInitialFormValues(): EducationFormValues {
  return {
    university: '',
    degree: '',
    field: '',
    startMonth: '',
    endMonth: '',
    completionStatus: 'completed',
    gpa: '',
    location: '',
    coursework: '',
  }
}

function buildTimePeriod(values: EducationFormValues) {
  const start = formatMonthYear(values.startMonth)

  if (values.completionStatus === 'present') {
    return `${start} - Present`
  }

  if (values.completionStatus === 'expected') {
    return `${start} - Expected`
  }

  return `${start} - ${formatMonthYear(values.endMonth)}`
}

function buildEducationPayload(values: EducationFormValues): EducationPayload {
  return {
    university: values.university.trim(),
    degree: values.degree.trim(),
    field: values.field.trim(),
    time_period: buildTimePeriod(values),
    gpa: values.gpa.trim() || undefined,
    location: values.location.trim() || undefined,
    relevant_coursework: values.coursework.trim() || undefined,
  }
}

function EducationScreen() {
  const [educations, setEducations] = useState<EducationRecord[]>([])
  const [formValues, setFormValues] = useState<EducationFormValues>(createInitialFormValues)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const educationItems = useMemo(() => educations.map(mapEducationToCardItem), [educations])

  const loadEducations = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await listEducations()
      setEducations(response)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load education history')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadEducations()
  }, [loadEducations])

  function updateFormValue(field: keyof EducationFormValues, value: string) {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
      ...(field === 'completionStatus' && value !== 'completed' ? { endMonth: '' } : {}),
    }))
  }

  function resetForm() {
    setFormValues(createInitialFormValues())
    setEditingId(null)
  }

  async function handleSubmit() {
    const university = formValues.university.trim()
    const degree = formValues.degree.trim()
    const field = formValues.field.trim()

    if (!university || !degree || !field || !formValues.startMonth) {
      setErrorMessage('University, degree, field of study, and start date are required.')
      setSuccessMessage(null)
      return
    }

    if (formValues.completionStatus === 'completed' && !formValues.endMonth) {
      setErrorMessage('End date is required when completion status is Completed.')
      setSuccessMessage(null)
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const payload = buildEducationPayload(formValues)

      if (editingId) {
        await updateEducation(editingId, payload)
        setSuccessMessage('Education entry updated.')
      } else {
        await createEducation(payload)
        setSuccessMessage('Education entry created.')
      }

      await loadEducations()
      resetForm()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save education entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(item: EducationItem) {
    const target = educations.find((education) => education.id === item.id)
    if (!target) {
      return
    }

    setEditingId(target.id)
    setFormValues(mapEducationToForm(target))
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  async function handleDelete(item: EducationItem) {
    const confirmed = window.confirm(`Delete education entry for ${item.university}?`)
    if (!confirmed) {
      return
    }

    setDeletingId(item.id)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await deleteEducation(item.id)
      await loadEducations()

      if (editingId === item.id) {
        resetForm()
      }

      setSuccessMessage('Education entry deleted.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to delete education entry')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <EducationTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title="Academic History"
          description="Manage your academic achievements and credentials to optimize your career trajectory."
        />

        {isLoading ? (
          <div role="status" className="alert alert-info">
            <span>Loading education history...</span>
          </div>
        ) : null}

        {errorMessage ? (
          <div role="alert" className="alert alert-error">
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {successMessage ? (
          <div role="status" className="alert alert-success">
            <span>{successMessage}</span>
          </div>
        ) : null}

        <div className="grid grid-cols-12 items-start gap-8">
          <EducationListPane
            educations={educationItems}
            deletingId={deletingId}
            onEdit={handleEdit}
            onDelete={(item) => void handleDelete(item)}
          />
          <EducationFormPane
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

export default EducationScreen
