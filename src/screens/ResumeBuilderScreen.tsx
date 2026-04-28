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

const wizardSteps = ['Target Role', 'Choose Projects', 'Edit Resume'] as const

const emptySkills: ResumeSkillsValues = {
  programmingLanguages: '',
  frameworksTools: '',
  languages: '',
}

type JobTargetValues = {
  jobTitle: string
  jobDescription: string
  jobRequirements: string
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

function ResumeBuilderScreen() {
  const { resumeId } = useParams()
  const { notifyError, notifySuccess } = useNotification()
  const { isBootstrapping, isReady, profile, educations, projects } = useAppData()

  const [step, setStep] = useState(0)
  const [jobTarget, setJobTarget] = useState<JobTargetValues>({
    jobTitle: '',
    jobDescription: '',
    jobRequirements: '',
  })
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])
  const [isTailoring, setIsTailoring] = useState(false)
  const [tailorWarnings, setTailorWarnings] = useState<SkippedProject[]>([])
  const [editorSeed, setEditorSeed] = useState<ResumeEditorInitialValues | null>(null)
  const [editorSeedId, setEditorSeedId] = useState(0)

  const isEditing = Boolean(resumeId)

  const projectMap = useMemo(() => {
    return new Map(projects.map((project) => [project.id, project]))
  }, [projects])

  const educationSeed = useMemo(() => {
    if (educations.length === 0) {
      return [createEmptyEducation()]
    }

    return educations.map(mapEducationRecordToValues)
  }, [educations])

  function updateJobTarget(field: keyof JobTargetValues, value: string) {
    setJobTarget((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

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
    const title = jobTarget.jobTitle.trim()
    const description = jobTarget.jobDescription.trim()
    const requirements = jobTarget.jobRequirements.trim()

    if (!title || !description || !requirements) {
      notifyError('Job title, description, and requirements are required.')
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

    setIsTailoring(true)

    try {
      const response = await tailorProjects({
        job_title: jobTarget.jobTitle.trim(),
        job_description: jobTarget.jobDescription.trim(),
        job_requirements: jobTarget.jobRequirements.trim(),
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

      const resumeTitle = jobTarget.jobTitle.trim()
        ? `${jobTarget.jobTitle.trim()} Resume`
        : ''

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
    <section className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-(--on-surface-variant)">Resume Editor</p>
        <h1 className="text-4xl font-semibold">Edit Resume</h1>
        <p className="mt-2 text-sm text-(--on-surface-variant)">
          Update the sections and save when you are ready.
        </p>
      </div>
      <Link to="/resumes" className="btn btn-outline">
        Back to Resumes
      </Link>
    </section>
  ) : (
    <section className="relative overflow-hidden rounded-3xl border border-base-200 bg-base-100 p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 55%, #fffbeb 100%)',
        }}
      />
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--on-surface-variant)">New Resume</p>
          <h1 className="text-4xl font-semibold">Tailored Resume Builder</h1>
          <p className="mt-2 text-sm text-(--on-surface-variant)">
            Start with a target role and let the system tailor your project bullets.
          </p>
        </div>
        <Link to="/resumes" className="btn btn-outline">
          Back to Resumes
        </Link>
      </div>
    </section>
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

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 md:px-8 md:py-12 lg:py-14">
        {headerContent}

        <section className="mt-8">
          {isEditing ? (
            <ResumeEditorPane resumeId={resumeId} />
          ) : (
            <div className="space-y-6">
              <div className="card border border-base-200 bg-base-100">
                <div className="card-body gap-6">
                  {stepsContent}

                  {step === 0 ? (
                    <div className="grid gap-4">
                      <div>
                        <label className="label" htmlFor="resume-job-title">Job Title</label>
                        <input
                          id="resume-job-title"
                          type="text"
                          className="input w-full"
                          placeholder="e.g. Backend Engineer"
                          value={jobTarget.jobTitle}
                          onChange={(event) => updateJobTarget('jobTitle', event.target.value)}
                        />
                      </div>

                      <div>
                        <label className="label" htmlFor="resume-job-description">Job Description</label>
                        <textarea
                          id="resume-job-description"
                          rows={4}
                          className="textarea w-full"
                          placeholder="Paste the role summary here..."
                          value={jobTarget.jobDescription}
                          onChange={(event) => updateJobTarget('jobDescription', event.target.value)}
                        ></textarea>
                      </div>

                      <div>
                        <label className="label" htmlFor="resume-job-requirements">Job Requirements</label>
                        <textarea
                          id="resume-job-requirements"
                          rows={4}
                          className="textarea w-full"
                          placeholder="List the must-have skills and tools..."
                          value={jobTarget.jobRequirements}
                          onChange={(event) => updateJobTarget('jobRequirements', event.target.value)}
                        ></textarea>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="text-sm text-(--on-surface-variant)">
                          We will tailor project bullets based on this target.
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
        </section>
      </main>

      <AppFooter />
    </div>
  )
}

export default ResumeBuilderScreen
