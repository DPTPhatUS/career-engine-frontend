import { useEffect, useMemo, useState } from 'react'
import {
  createEducation,
  deleteEducation,
  updateEducation,
  type EducationPayload,
  type EducationRecord,
} from '../api/educations'
import EducationFormPane from '../components/education/EducationFormPane'
import type { CompletionStatus, EducationFormValues } from '../components/education/EducationFormPane.types'
import type { EducationItem } from '../components/education/EducationCard.types'
import EducationListPane from '../components/education/EducationListPane'
import EducationTopNav from '../components/education/EducationTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useAppData } from '../contexts/useAppData'
import { useNotification } from '../contexts/useNotification'


function parseTimePeriod(timePeriod: string): {
  startMonth: string
  endMonth: string
  completionStatus: CompletionStatus
} {
  const trimmed = timePeriod.trim()
  if (!trimmed) {
    return {
      startMonth: '',
      endMonth: '',
      completionStatus: 'graduated',
    }
  }

  const expectedSuffix = /\(expected\)\s*$/i
  const completionStatus: CompletionStatus = expectedSuffix.test(trimmed) ? 'ongoing' : 'graduated'
  const cleaned = trimmed.replace(expectedSuffix, '').trim()
  const parts = cleaned.split(/\s+-\s+/)
  if (parts.length < 2) {
    return {
      startMonth: cleaned,
      endMonth: '',
      completionStatus,
    }
  }

  return {
    startMonth: (parts[0] ?? '').trim(),
    endMonth: parts.slice(1).join(' - ').trim(),
    completionStatus,
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
    completionStatus: 'graduated',
    gpa: '',
    location: '',
    coursework: '',
  }
}

function buildTimePeriod(values: EducationFormValues) {
  const start = values.startMonth.trim()
  const end = values.endMonth.trim()

  if (!start || !end) {
    return ''
  }

  return values.completionStatus === 'ongoing'
    ? `${start} - ${end} (Expected)`
    : `${start} - ${end}`
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
  const {
    clearEducationsError,
    educations,
    educationsError,
    refreshEducations,
    setEducations,
  } = useAppData()
  const { notifyError, notifySuccess } = useNotification()
  const [formValues, setFormValues] = useState<EducationFormValues>(createInitialFormValues)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const educationItems = useMemo(() => educations.map(mapEducationToCardItem), [educations])

  useEffect(() => {
    if (!educationsError) {
      return
    }

    notifyError(educationsError)
    clearEducationsError()
  }, [clearEducationsError, educationsError, notifyError])

  function updateFormValue(field: keyof EducationFormValues, value: string) {
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
    const university = formValues.university.trim()
    const degree = formValues.degree.trim()
    const field = formValues.field.trim()

    if (!university || !degree || !field || !formValues.startMonth) {
      notifyError('University, degree, field of study, and start date are required.')
      return
    }

    if (!formValues.endMonth) {
      notifyError('End date is required.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = buildEducationPayload(formValues)

      if (editingId) {
        const updated = await updateEducation(editingId, payload)
        setEducations((previous) => previous.map((education) => (education.id === updated.id ? updated : education)))
        notifySuccess('Education entry updated.')
      } else {
        const created = await createEducation(payload)
        setEducations((previous) => [...previous, created].sort((left, right) => left.sort_order - right.sort_order))
        notifySuccess('Education entry created.')
      }

      void refreshEducations()
      resetForm()
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to save education entry')
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
  }

  async function handleDelete(item: EducationItem) {
    const confirmed = window.confirm(`Delete education entry for ${item.university}?`)
    if (!confirmed) {
      return
    }

    setDeletingId(item.id)

    try {
      await deleteEducation(item.id)
      setEducations((previous) => previous.filter((education) => education.id !== item.id))

      if (editingId === item.id) {
        resetForm()
      }

      notifySuccess('Education entry deleted.')
      void refreshEducations()
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to delete education entry')
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
