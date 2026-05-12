import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  tailorProjects,
  type ProjectRecord,
  type SkippedProject,
  type TailoredProject,
} from '../api/projects'
import type { EducationRecord } from '../api/educations'
import type { ProfileRecord } from '../api/profile'
import ResumeEditorPane, { type ResumeEditorInitialValues } from '../components/resume/ResumeEditorPane'
import type { ResumeEducationValues } from '../components/resume/ResumeEducationSection'
import type { ResumePersonalInfoValues } from '../components/resume/ResumePersonalInfoSection'
import type { ResumeProjectsValues } from '../components/resume/ResumeProjectsSection'
import type { ResumeSkillsValues } from '../components/resume/ResumeSkillsSection'
import ResumeTopNav from '../components/resume/ResumeTopNav'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useAppData } from '../contexts/useAppData'
import { useNotification } from '../contexts/useNotification'
import ScreenHeader from '../components/shared/layout/ScreenHeader'

const wizardSteps = ['Target Role', 'Choose Projects', 'Edit Resume'] as const

const emptySkills: ResumeSkillsValues = {
  programmingLanguages: '',
  frameworksTools: '',
  languages: '',
}

function createEmptyEducation(): ResumeEducationValues {
  return {
    university: '',
    degree: '',
    field: '',
    timePeriod: '',
    gpa: '',
    location: '',
    relevantCoursework: '',
  }
}

function createEmptyProject(): ResumeProjectsValues {
  return {
    title: '',
    dateRange: '',
    githubUrl: '',
    techStack: '',
    bullets: '',
  }
}

function mapProfileToPersonalInfo(profile: ProfileRecord | null): ResumePersonalInfoValues {
  return {
    fullName: profile?.full_name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    address: profile?.address ?? '',
    githubLabel: profile?.github_label ?? 'GitHub',
    githubUrl: profile?.github_url ?? '',
  }
}

function mapEducationRecordToValues(education: EducationRecord): ResumeEducationValues {
  return {
    university: education.university,
    degree: education.degree,
    field: education.field,
    timePeriod: education.time_period,
    gpa: education.gpa ?? '',
    location: education.location ?? '',
    relevantCoursework: education.relevant_coursework ?? '',
  }
}

function mapProjectRecordToValues(project: ProjectRecord): ResumeProjectsValues {
  return {
    title: project.title,
    dateRange: project.date_range,
    githubUrl: project.github_url ?? '',
    techStack: project.tech_stack ?? '',
    bullets: project.bullets.join('\n'),
  }
}

function mapTailoredProjectToValues(project: TailoredProject): ResumeProjectsValues {
  return {
    title: project.title,
    dateRange: project.date_range,
    githubUrl: project.github_url ?? '',
    techStack: project.tech_stack ?? '',
    bullets: project.bullets.join('\n'),
  }
}

function splitTechStack(value: string | null) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function previewText(value: string, maxLength = 180) {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, maxLength).trim()}...`
}

function ResumeBuilderScreen() {
  const { resumeId } = useParams()
  const { notifyError, notifySuccess } = useNotification()
  const { isBootstrapping, isReady, profile, companies, jobs, educations, projects } = useAppData()

  const [step, setStep] = useState(0)
  const [selectedJobId, setSelectedJobId] = useState('')
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])
  const [isTailoring, setIsTailoring] = useState(false)
  const [tailorWarnings, setTailorWarnings] = useState<SkippedProject[]>([])
  const [editorSeed, setEditorSeed] = useState<ResumeEditorInitialValues | null>(null)
  const [editorSeedId, setEditorSeedId] = useState(0)

  const isEditing = Boolean(resumeId)

  const companyMap = useMemo(() => {
    return new Map(companies.map((company) => [company.id, company]))
  }, [companies])

  const selectedJob = useMemo(() => {
    return jobs.find((job) => job.id === selectedJobId) ?? null
  }, [jobs, selectedJobId])

  const projectMap = useMemo(() => {
    return new Map(projects.map((project) => [project.id, project]))
  }, [projects])

  const educationSeed = useMemo(() => {
    if (educations.length === 0) {
      return [createEmptyEducation()]
    }

    return educations.map(mapEducationRecordToValues)
  }, [educations])

  function toggleProject(projectId: string) {
    setSelectedProjectIds((previous) => {
      if (previous.includes(projectId)) {
        return previous.filter((id) => id !== projectId)
      }

      if (previous.length >= 5) {
        notifyError('Select up to 5 projects for tailoring.')
        return previous
      }

      return [...previous, projectId]
    })
  }

  function handleContinueToProjects() {
    if (!selectedJob) {
      notifyError('Select a saved job to continue.')
      return
    }

    setStep(1)
  }

  async function handleGenerateResume() {
    if (selectedProjectIds.length === 0) {
      notifyError('Select at least one project to tailor.')
      return
    }

    if (selectedProjectIds.length > 5) {
      notifyError('Select no more than 5 projects to tailor.')
      return
    }

    if (!selectedJob) {
      notifyError('Select a saved job to continue.')
      setStep(0)
      return
    }

    setIsTailoring(true)

    try {
      const response = await tailorProjects({
        job_title: selectedJob.title,
        job_description: selectedJob.job_description,
        job_requirements: selectedJob.job_requirements,
        project_ids: selectedProjectIds,
      })

      const tailoredMap = new Map(response.tailored_projects.map((item) => [item.project_id, item]))

      const projectValues = selectedProjectIds.map((projectId) => {
        const tailored = tailoredMap.get(projectId)
        if (tailored) {
          return mapTailoredProjectToValues(tailored)
        }

        const original = projectMap.get(projectId)
        return original ? mapProjectRecordToValues(original) : createEmptyProject()
      })

      const resumeTitle = selectedJob.title

      setEditorSeed({
        title: resumeTitle,
        personalInfo: mapProfileToPersonalInfo(profile),
        education: educationSeed,
        projects: projectValues,
        skills: emptySkills,
      })
      setEditorSeedId((previous) => previous + 1)
      setTailorWarnings(response.skipped_projects)
      setStep(2)
      notifySuccess('Tailored projects are ready to edit.')
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to tailor projects.')
    } finally {
      setIsTailoring(false)
    }
  }

  const warningsContent = useMemo(() => {
    if (tailorWarnings.length === 0) {
      return null
    }

    return (
      <div className="alert alert-warning">
        <div>
          <p className="font-semibold">Some projects were not tailored</p>
          <ul className="mt-2 space-y-1 text-sm">
            {tailorWarnings.map((warning) => {
              const project = projectMap.get(warning.project_id)
              const label = project ? project.title : warning.project_id
              return (
                <li key={warning.project_id}>
                  {label}: {warning.detail}
                </li>
              )
            })}
          </ul>
          <p className="mt-2 text-sm">Original project details were kept for those entries.</p>
        </div>
      </div>
    )
  }, [projectMap, tailorWarnings])

  const selectionCount = selectedProjectIds.length

  const stepsContent = useMemo(() => (
    <ul className="steps w-full">
      {wizardSteps.map((label, index) => (
        <li key={label} className={`step ${step >= index ? 'step-primary' : ''}`}>
          {label}
        </li>
      ))}
    </ul>
  ), [step])

  const headerContent = isEditing ? (
    <ScreenHeader
      title="Edit Resume"
      description="Update your resume to match your latest projects, education, and profile information."
    />
  ) : (
    <ScreenHeader
      title="Resume Builder"
      description="Create a tailored resume by matching your projects to a target role."
    />
  )

  if (isBootstrapping || !isReady) {
    return (
      <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
        <ResumeTopNav />
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 md:px-8 md:py-12 lg:py-14">
          <div className="card border border-base-200 bg-base-100">
            <div className="card-body">
              <p className="text-sm text-(--on-surface-variant)">Loading resume builder data...</p>
              <div className="mt-4 skeleton h-6 w-2/3" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-4 w-full" />
            </div>
          </div>
        </main>
        <AppFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ResumeTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {headerContent}

        {isEditing ? (
          <ResumeEditorPane resumeId={resumeId} />
        ) : (
          <div className="space-y-6">
            <div className="card border border-base-200 bg-base-100">
              <div className="card-body gap-6">
                {stepsContent}

                {step === 0 ? (
                  <div className="grid gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold">Choose a saved job</h2>
                        <p className="text-sm text-(--on-surface-variant)">
                          We will tailor project bullets based on the selected job.
                        </p>
                      </div>
                      <Link to="/jobs" className="btn btn-outline btn-sm">
                        Manage Jobs
                      </Link>
                    </div>

                    {jobs.length === 0 ? (
                      <div className="card border border-dashed border-base-300 bg-base-100">
                        <div className="card-body">
                          <h3 className="text-lg font-semibold">No saved jobs found</h3>
                          <p className="text-sm opacity-70">
                            Add a target job before building a tailored resume.
                          </p>
                          <div className="card-actions">
                            <Link to="/jobs" className="btn btn-outline">Go to Saved Jobs</Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {jobs.map((job) => {
                          const selected = selectedJobId === job.id
                          const company = companyMap.get(job.company_id)
                          const companyName = company?.name ?? 'Unknown company'

                          return (
                            <label
                              key={job.id}
                              className={`card cursor-pointer border ${selected
                                ? 'border-primary bg-primary/5'
                                : 'border-base-200 bg-base-100'
                                }`}
                            >
                              <div className="card-body gap-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h3 className="text-lg font-semibold">{job.title}</h3>
                                    <p className="text-sm text-(--on-surface-variant)">{companyName}</p>
                                  </div>
                                  <input
                                    type="radio"
                                    name="resume-target-job"
                                    className="radio radio-primary"
                                    checked={selected}
                                    onChange={() => setSelectedJobId(job.id)}
                                  />
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                  <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase opacity-60">Description</p>
                                    <p className="text-sm text-(--on-surface-variant)">
                                      {previewText(job.job_description)}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase opacity-60">Requirements</p>
                                    <p className="text-sm text-(--on-surface-variant)">
                                      {previewText(job.job_requirements)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="text-sm text-(--on-surface-variant)">
                        Select one saved job to continue.
                      </p>
                      <button type="button" className="btn btn-primary" onClick={handleContinueToProjects}>
                        Continue
                      </button>
                    </div>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold">Select projects to tailor</h2>
                        <p className="text-sm text-(--on-surface-variant)">
                          Choose up to 5 projects to match this role.
                        </p>
                      </div>
                      <div className="text-sm text-(--on-surface-variant)">
                        Selected {selectionCount}/5
                      </div>
                    </div>

                    {projects.length === 0 ? (
                      <div className="card border border-dashed border-base-300 bg-base-100">
                        <div className="card-body">
                          <h3 className="text-lg font-semibold">No projects found</h3>
                          <p className="text-sm opacity-70">Add projects first to tailor a resume.</p>
                          <div className="card-actions">
                            <Link to="/projects" className="btn btn-outline">Go to Projects</Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4 lg:grid-cols-2">
                        {projects.map((project) => {
                          const selected = selectedProjectIds.includes(project.id)
                          const techStack = splitTechStack(project.tech_stack)
                          const isDisabled = !selected && selectionCount >= 5

                          return (
                            <label
                              key={project.id}
                              className={`card cursor-pointer border ${selected
                                ? 'border-primary bg-primary/5'
                                : 'border-base-200 bg-base-100'
                                } ${isDisabled ? 'opacity-60' : ''}`}
                            >
                              <div className="card-body gap-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h3 className="text-lg font-semibold">{project.title}</h3>
                                    <p className="text-sm text-(--on-surface-variant)">
                                      {project.date_range}
                                    </p>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={selected}
                                    disabled={isDisabled}
                                    onChange={() => toggleProject(project.id)}
                                  />
                                </div>

                                {techStack.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech) => (
                                      <span key={`${project.id}-${tech}`} className="badge badge-outline">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}

                                {!project.github_url ? (
                                  <p className="text-xs text-warning">
                                    No GitHub link. Tailoring will keep original details.
                                  </p>
                                ) : null}
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <button type="button" className="btn btn-outline" onClick={() => setStep(0)}>
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => void handleGenerateResume()}
                        disabled={isTailoring || projects.length === 0}
                      >
                        {isTailoring ? 'Tailoring...' : 'Generate Tailored Projects'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {step === 2 && editorSeed ? (
              <div className="space-y-4">
                {warningsContent}
                <ResumeEditorPane key={`resume-editor-${editorSeedId}`} initialValues={editorSeed} />
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                  Back to Project Selection
                </button>
              </div>
            ) : null}
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  )
}

export default ResumeBuilderScreen
