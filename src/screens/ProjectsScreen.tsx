import { useEffect, useMemo, useState } from 'react'
import {
  autofillProject,
  createProject,
  deleteProject,
  updateProject,
  type ProjectPayload,
  type ProjectRecord,
} from '../api/projects'
import ProjectsFormPane from '../components/projects/ProjectsFormPane'
import type { ProjectsFormValues } from '../components/projects/ProjectsFormPane'
import type { ProjectItem } from '../components/projects/ProjectCard'
import ProjectsListPane from '../components/projects/ProjectsListPane'
import ProjectsTopNav from '../components/projects/ProjectsTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useAppData } from '../contexts/AppDataContext'
import { useNotification } from '../contexts/NotificationContext'

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

  const yearOnly = trimmed.match(/^(\d{4})$/)
  if (yearOnly) {
    return `${yearOnly[1]}-01`
  }

  const namedMonth = trimmed.match(/^([A-Za-z]{3,9})\s+(\d{4})$/)
  if (!namedMonth) {
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

  const month = monthMap[namedMonth[1].slice(0, 3).toLowerCase()]
  if (!month) {
    return ''
  }

  return `${namedMonth[2]}-${month}`
}

function parseDateRange(dateRange: string): {
  startMonth: string
  endMonth: string
} {
  const parts = dateRange.split(/\s*-\s*/)

  if (parts.length < 2) {
    return {
      startMonth: parseMonthInput(dateRange),
      endMonth: '',
    }
  }

  const startPart = parts[0] ?? ''
  const endPart = parts.slice(1).join(' - ')
  const normalizedEnd = endPart.trim().toLowerCase()

  if (normalizedEnd.includes('present')) {
    return {
      startMonth: parseMonthInput(startPart),
      endMonth: '',
    }
  }

  return {
    startMonth: parseMonthInput(startPart),
    endMonth: parseMonthInput(endPart),
  }
}

function parseTechStack(value: string | null) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseGithubRepo(value: string | null) {
  if (!value) {
    return ''
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.hostname.toLowerCase().includes('github.com')) {
      return parsed.pathname.replace(/^\/+/, '').replace(/\/+$/, '')
    }
  } catch {
    // Keep fallback for already-normalized slug values.
  }

  return trimmed.replace(/^https?:\/\/github\.com\//i, '').replace(/^github\.com\//i, '').replace(/\/+$/, '')
}

function toGithubUrl(repo: string) {
  const cleaned = repo.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/^github\.com\//i, '').replace(/\/+$/, '')
  return cleaned ? `https://github.com/${cleaned}` : undefined
}

function createInitialFormValues(): ProjectsFormValues {
  return {
    title: '',
    startMonth: '',
    endMonth: '',
    githubRepo: '',
    techInput: '',
    techStack: [],
    accomplishments: '',
  }
}

function mapProjectToItem(project: ProjectRecord): ProjectItem {
  return {
    id: project.id,
    title: project.title,
    dateRange: project.date_range,
    tags: parseTechStack(project.tech_stack),
    bullets: project.bullets,
    githubUrl: project.github_url ?? undefined,
  }
}

function mapProjectToForm(project: ProjectRecord): ProjectsFormValues {
  const parsedRange = parseDateRange(project.date_range)

  return {
    title: project.title,
    startMonth: parsedRange.startMonth,
    endMonth: parsedRange.endMonth,
    githubRepo: parseGithubRepo(project.github_url),
    techInput: '',
    techStack: parseTechStack(project.tech_stack),
    accomplishments: project.bullets.join('\n'),
  }
}

function buildDateRange(values: ProjectsFormValues) {
  const start = formatMonthYear(values.startMonth)
  return `${start} - ${formatMonthYear(values.endMonth)}`
}

function buildProjectPayload(values: ProjectsFormValues): ProjectPayload {
  return {
    title: values.title.trim(),
    date_range: buildDateRange(values),
    github_url: toGithubUrl(values.githubRepo),
    tech_stack: values.techStack.length > 0 ? values.techStack.join(', ') : undefined,
    bullets: values.accomplishments
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  }
}

function ProjectsScreen() {
  const {
    clearProjectsError,
    projects,
    projectsError,
    refreshProjects,
    setProjects,
  } = useAppData()
  const { notifyError, notifySuccess } = useNotification()
  const [formValues, setFormValues] = useState<ProjectsFormValues>(createInitialFormValues)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAutofilling, setIsAutofilling] = useState(false)

  const projectItems = useMemo(() => projects.map(mapProjectToItem), [projects])

  useEffect(() => {
    if (!projectsError) {
      return
    }

    notifyError(projectsError)
    clearProjectsError()
  }, [clearProjectsError, notifyError, projectsError])

  function updateFormValue(field: keyof ProjectsFormValues, value: string) {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function resetForm() {
    setFormValues(createInitialFormValues())
    setEditingId(null)
  }

  function addTechStack() {
    const nextTech = formValues.techInput.trim()
    if (!nextTech) {
      return
    }

    setFormValues((previous) => {
      const alreadyPresent = previous.techStack.some((tech) => tech.toLowerCase() === nextTech.toLowerCase())
      return {
        ...previous,
        techInput: '',
        techStack: alreadyPresent ? previous.techStack : [...previous.techStack, nextTech],
      }
    })
  }

  function removeTechStack(techToRemove: string) {
    setFormValues((previous) => ({
      ...previous,
      techStack: previous.techStack.filter((tech) => tech !== techToRemove),
    }))
  }

  async function handleAutofill() {
    const githubUrl = toGithubUrl(formValues.githubRepo)
    if (!githubUrl) {
      notifyError('A GitHub repository is required for autofill.')
      return
    }

    setIsAutofilling(true)

    try {
      const result = await autofillProject({ github_url: githubUrl })
      const parsedRange = parseDateRange(result.date_range)
      setFormValues((previous) => ({
        ...previous,
        title: result.title,
        startMonth: parsedRange.startMonth,
        endMonth: parsedRange.endMonth,
        githubRepo: parseGithubRepo(result.github_url),
        techInput: '',
        techStack: parseTechStack(result.tech_stack),
        accomplishments: result.bullets.join('\n'),
      }))
      notifySuccess('Project details were autofilled. Review before saving.')
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to autofill project details')
    } finally {
      setIsAutofilling(false)
    }
  }

  async function handleSubmit() {
    const title = formValues.title.trim()
    if (!title || !formValues.startMonth) {
      notifyError('Project title and start date are required.')
      return
    }

    if (!formValues.endMonth) {
      notifyError('End date is required.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = buildProjectPayload(formValues)

      if (editingId) {
        const updated = await updateProject(editingId, payload)
        setProjects((previous) => previous.map((project) => (project.id === updated.id ? updated : project)))
        notifySuccess('Project updated successfully.')
      } else {
        const created = await createProject(payload)
        setProjects((previous) => [...previous, created].sort((left, right) => left.sort_order - right.sort_order))
        notifySuccess('Project created successfully.')
      }

      void refreshProjects()
      resetForm()
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to save project')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(item: ProjectItem) {
    const target = projects.find((project) => project.id === item.id)
    if (!target) {
      return
    }

    setEditingId(target.id)
    setFormValues(mapProjectToForm(target))
  }

  async function handleDelete(item: ProjectItem) {
    const confirmed = window.confirm(`Delete project ${item.title}?`)
    if (!confirmed) {
      return
    }

    setDeletingId(item.id)

    try {
      await deleteProject(item.id)
      setProjects((previous) => previous.filter((project) => project.id !== item.id))

      if (editingId === item.id) {
        resetForm()
      }

      notifySuccess('Project deleted successfully.')
      void refreshProjects()
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to delete project')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ProjectsTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title="Your Projects"
          description="Manage your projects, track progress, and collaborate with your team all in one place."
        />

        <div className="grid grid-cols-12 items-start gap-8">
          <ProjectsFormPane
            values={formValues}
            isEditing={Boolean(editingId)}
            isSubmitting={isSubmitting}
            isAutofilling={isAutofilling}
            onChange={updateFormValue}
            onAddTechStack={addTechStack}
            onRemoveTechStack={removeTechStack}
            onSubmit={() => void handleSubmit()}
            onCancel={resetForm}
            onAutofill={() => void handleAutofill()}
          />
          <ProjectsListPane
            projects={projectItems}
            deletingId={deletingId}
            onEdit={handleEdit}
            onDelete={(item) => void handleDelete(item)}
          />
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

export default ProjectsScreen
