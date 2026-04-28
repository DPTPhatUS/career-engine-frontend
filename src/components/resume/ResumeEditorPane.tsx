import { Fragment, useEffect, useState } from 'react'
import { ApiError } from '../../api/client'
import { createResume, getResume, updateResume, type ResumePayload, type ResumeRecord } from '../../api/resumes'
import { useNotification } from '../../contexts/useNotification'
import ResumeEducationSection, { type ResumeEducationValues } from './ResumeEducationSection'
import ResumeEditorActions from './ResumeEditorActions'
import ResumePersonalInfoSection, { type ResumePersonalInfoValues } from './ResumePersonalInfoSection'
import ResumeProjectsSection, { type ResumeProjectsValues } from './ResumeProjectsSection'
import ResumeSkillsSection, { type ResumeSkillsValues } from './ResumeSkillsSection'

const resumeTabs = ['Personal Info', 'Education', 'Projects', 'Skills'] as const

type ResumeEditorInitialValues = {
  title: string
  personalInfo: ResumePersonalInfoValues
  education: ResumeEducationValues[]
  projects: ResumeProjectsValues[]
  skills: ResumeSkillsValues
}

type ResumeEditorPaneProps = {
  resumeId?: string | null
  initialValues?: ResumeEditorInitialValues
  onSaveSuccess?: (record: ResumeRecord) => void
}

function createInitialPersonalInfoValues(): ResumePersonalInfoValues {
  return {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    githubLabel: 'GitHub',
    githubUrl: '',
  }
}

function createInitialEducationValues(): ResumeEducationValues {
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

function createInitialProjectsValues(): ResumeProjectsValues {
  return {
    title: '',
    dateRange: '',
    githubUrl: '',
    techStack: '',
    bullets: '',
  }
}

function createInitialSkillsValues(): ResumeSkillsValues {
  return {
    programmingLanguages: '',
    frameworksTools: '',
    languages: '',
  }
}

function cloneEducationValues(values: ResumeEducationValues[]) {
  return values.map((item) => ({ ...item }))
}

function cloneProjectValues(values: ResumeProjectsValues[]) {
  return values.map((item) => ({ ...item }))
}

function getInitialValues(seed?: ResumeEditorInitialValues) {
  return {
    title: seed?.title ?? '',
    personalInfo: seed?.personalInfo ? { ...seed.personalInfo } : createInitialPersonalInfoValues(),
    education:
      seed?.education && seed.education.length > 0
        ? cloneEducationValues(seed.education)
        : [createInitialEducationValues()],
    projects:
      seed?.projects && seed.projects.length > 0
        ? cloneProjectValues(seed.projects)
        : [createInitialProjectsValues()],
    skills: seed?.skills ? { ...seed.skills } : createInitialSkillsValues(),
  }
}

function toOptionalString(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function parseBullets(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function mapSkillsFromPayload(skills: ResumePayload['skills']): ResumeSkillsValues {
  const mapped: ResumeSkillsValues = {
    programmingLanguages: '',
    frameworksTools: '',
    languages: '',
  }

  for (const item of skills) {
    const normalizedLabel = item.label.trim().toLowerCase()

    if (normalizedLabel === 'programming languages' || normalizedLabel === 'programming language') {
      mapped.programmingLanguages = item.values
      continue
    }

    if (
      normalizedLabel === 'frameworks/tools' ||
      normalizedLabel === 'frameworks and tools' ||
      normalizedLabel === 'frameworks' ||
      normalizedLabel === 'tools'
    ) {
      mapped.frameworksTools = item.values
      continue
    }

    if (normalizedLabel === 'languages' || normalizedLabel === 'spoken languages') {
      mapped.languages = item.values
    }
  }

  return mapped
}

function ResumeEditorPane({ resumeId: resumeIdProp, initialValues, onSaveSuccess }: ResumeEditorPaneProps) {
  const { notifyError, notifySuccess } = useNotification()
  const seed = getInitialValues(initialValues)
  const routeResumeId = resumeIdProp ?? null

  const [activeTab, setActiveTab] = useState(0)
  const [resumeId, setResumeId] = useState<string | null>(routeResumeId)
  const [resumeTitle, setResumeTitle] = useState(seed.title)
  const [personalInfoValues, setPersonalInfoValues] = useState<ResumePersonalInfoValues>(seed.personalInfo)
  const [educationValues, setEducationValues] = useState<ResumeEducationValues[]>(seed.education)
  const [projectsValues, setProjectsValues] = useState<ResumeProjectsValues[]>(seed.projects)
  const [skillsValues, setSkillsValues] = useState<ResumeSkillsValues>(seed.skills)
  const [isHydrating, setIsHydrating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  function updatePersonalInfo(field: keyof ResumePersonalInfoValues, value: string) {
    setPersonalInfoValues((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function updateEducation(index: number, field: keyof ResumeEducationValues, value: string) {
    setEducationValues((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
            ...item,
            [field]: value,
          }
          : item,
      ),
    )
  }

  function updateProjects(index: number, field: keyof ResumeProjectsValues, value: string) {
    setProjectsValues((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
            ...item,
            [field]: value,
          }
          : item,
      ),
    )
  }

  function updateSkills(field: keyof ResumeSkillsValues, value: string) {
    setSkillsValues((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function addEducation() {
    setEducationValues((previous) => [...previous, createInitialEducationValues()])
  }

  function removeEducation(index: number) {
    setEducationValues((previous) => previous.filter((_, itemIndex) => itemIndex !== index))
  }

  function addProject() {
    setProjectsValues((previous) => [...previous, createInitialProjectsValues()])
  }

  function removeProject(index: number) {
    setProjectsValues((previous) => previous.filter((_, itemIndex) => itemIndex !== index))
  }

  function handlePrevious() {
    setActiveTab((previous) => Math.max(previous - 1, 0))
  }

  function handleNext() {
    setActiveTab((previous) => Math.min(previous + 1, resumeTabs.length - 1))
  }

  function handleClearActiveTab() {
    if (activeTab === 0) {
      setPersonalInfoValues(createInitialPersonalInfoValues())
      return
    }

    if (activeTab === 1) {
      setEducationValues([createInitialEducationValues()])
      return
    }

    if (activeTab === 2) {
      setProjectsValues([createInitialProjectsValues()])
      return
    }

    setSkillsValues(createInitialSkillsValues())
  }

  function buildEducationPayload(values: ResumeEducationValues[]): ResumePayload['education'] {
    return values.flatMap((item, index) => {
      const hasInput = Object.values(item).some((value) => value.trim().length > 0)
      if (!hasInput) {
        return []
      }

      const university = item.university.trim()
      const degree = item.degree.trim()
      const field = item.field.trim()
      const timePeriod = item.timePeriod.trim()

      if (!university || !degree || !field || !timePeriod) {
        throw new Error(`Education ${index + 1} requires university, degree, field, and time period.`)
      }

      const educationItem: ResumePayload['education'][number] = {
        university,
        degree,
        field,
        time_period: timePeriod,
      }

      const gpa = toOptionalString(item.gpa)
      const location = toOptionalString(item.location)
      const relevantCoursework = toOptionalString(item.relevantCoursework)

      if (gpa) {
        educationItem.gpa = gpa
      }

      if (location) {
        educationItem.location = location
      }

      if (relevantCoursework) {
        educationItem.relevant_coursework = relevantCoursework
      }

      return [educationItem]
    })
  }

  function buildProjectsPayload(values: ResumeProjectsValues[]): ResumePayload['projects'] {
    return values.flatMap((item, index) => {
      const hasInput = Object.values(item).some((value) => value.trim().length > 0)
      if (!hasInput) {
        return []
      }

      const title = item.title.trim()
      const dateRange = item.dateRange.trim()

      if (!title || !dateRange) {
        throw new Error(`Project ${index + 1} requires title and date range.`)
      }

      const projectItem: ResumePayload['projects'][number] = {
        title,
        date_range: dateRange,
        bullets: parseBullets(item.bullets),
      }

      const githubUrl = toOptionalString(item.githubUrl)
      const techStack = toOptionalString(item.techStack)

      if (githubUrl) {
        projectItem.github_url = githubUrl
      }

      if (techStack) {
        projectItem.tech_stack = techStack
      }

      return [projectItem]
    })
  }

  function buildResumePayload(): ResumePayload {
    const fullName = personalInfoValues.fullName.trim()
    const email = personalInfoValues.email.trim()

    if (!fullName || !email) {
      throw new Error('Personal info requires full name and email.')
    }

    const personalInfo: ResumePayload['personal_info'] = {
      full_name: fullName,
      email,
    }

    const phone = toOptionalString(personalInfoValues.phone)
    const address = toOptionalString(personalInfoValues.address)
    const githubLabel = toOptionalString(personalInfoValues.githubLabel)
    const githubUrl = toOptionalString(personalInfoValues.githubUrl)

    if (phone) {
      personalInfo.phone = phone
    }

    if (address) {
      personalInfo.address = address
    }

    if (githubLabel) {
      personalInfo.github_label = githubLabel
    }

    if (githubUrl) {
      personalInfo.github_url = githubUrl
    }

    const education = buildEducationPayload(educationValues)
    const projects = buildProjectsPayload(projectsValues)

    const skills: ResumePayload['skills'] = []
    const programmingLanguages = toOptionalString(skillsValues.programmingLanguages)
    const frameworksTools = toOptionalString(skillsValues.frameworksTools)
    const languages = toOptionalString(skillsValues.languages)

    if (programmingLanguages) {
      skills.push({
        label: 'Programming Languages',
        values: programmingLanguages,
      })
    }

    if (frameworksTools) {
      skills.push({
        label: 'Frameworks/Tools',
        values: frameworksTools,
      })
    }

    if (languages) {
      skills.push({
        label: 'Languages',
        values: languages,
      })
    }

    return {
      personal_info: personalInfo,
      education,
      projects,
      skills,
    }
  }

  function applyResumeRecord(record: ResumeRecord) {
    setResumeId(record.id)
    setResumeTitle(record.title)

    const personalInfo = record.payload.personal_info
    setPersonalInfoValues({
      fullName: personalInfo.full_name,
      email: personalInfo.email,
      phone: personalInfo.phone ?? '',
      address: personalInfo.address ?? '',
      githubLabel: personalInfo.github_label ?? 'GitHub',
      githubUrl: personalInfo.github_url ?? '',
    })

    const educationList = record.payload.education.map((item) => ({
      university: item.university,
      degree: item.degree,
      field: item.field,
      timePeriod: item.time_period,
      gpa: item.gpa ?? '',
      location: item.location ?? '',
      relevantCoursework: item.relevant_coursework ?? '',
    }))

    setEducationValues(educationList.length > 0 ? educationList : [createInitialEducationValues()])

    const projectList = record.payload.projects.map((item) => ({
      title: item.title,
      dateRange: item.date_range,
      githubUrl: item.github_url ?? '',
      techStack: item.tech_stack ?? '',
      bullets: item.bullets?.join('\n') ?? '',
    }))

    setProjectsValues(projectList.length > 0 ? projectList : [createInitialProjectsValues()])
    setSkillsValues(mapSkillsFromPayload(record.payload.skills))
  }

  useEffect(() => {
    const resumeId = routeResumeId
    if (!resumeId) {
      return
    }

    let isDisposed = false

    async function hydrateResume(targetResumeId: string) {
      setIsHydrating(true)

      try {
        const resume = await getResume(targetResumeId)
        if (isDisposed) {
          return
        }

        applyResumeRecord(resume)
      } catch (error) {
        if (isDisposed) {
          return
        }

        if (error instanceof ApiError && error.status === 404) {
          notifyError('Resume was not found. Return to the list and create a new one.')
          return
        }

        notifyError(error instanceof Error ? error.message : 'Unable to load resume.')
      } finally {
        if (!isDisposed) {
          setIsHydrating(false)
        }
      }
    }

    void hydrateResume(resumeId)

    return () => {
      isDisposed = true
    }
  }, [notifyError, routeResumeId])

  async function handleSaveResume() {
    const title = resumeTitle.trim()

    if (!title) {
      notifyError('Resume title is required.')
      return
    }

    setIsSaving(true)

    try {
      const payload = buildResumePayload()

      if (resumeId) {
        const updated = await updateResume(resumeId, { title, payload })
        applyResumeRecord(updated)
        notifySuccess('Resume updated successfully.')
        onSaveSuccess?.(updated)
      } else {
        const created = await createResume({ title, payload })
        applyResumeRecord(created)
        notifySuccess('Resume created successfully.')
        onSaveSuccess?.(created)
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 404 && resumeId) {
        notifyError('Saved resume reference expired. Return to the list and create a new resume.')
      } else {
        notifyError(error instanceof Error ? error.message : 'Unable to save resume.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  function renderActiveSection() {
    switch (activeTab) {
      case 0:
        return <ResumePersonalInfoSection values={personalInfoValues} onChange={updatePersonalInfo} />
      case 1:
        return (
          <ResumeEducationSection
            values={educationValues}
            onChange={updateEducation}
            onAdd={addEducation}
            onRemove={removeEducation}
          />
        )
      case 2:
        return (
          <ResumeProjectsSection
            values={projectsValues}
            onChange={updateProjects}
            onAdd={addProject}
            onRemove={removeProject}
          />
        )
      default:
        return <ResumeSkillsSection values={skillsValues} onChange={updateSkills} />
    }
  }

  return (
    <div className="space-y-4">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Resume Title</legend>
        <input
          id="resume-title"
          type="text"
          className="input w-full"
          placeholder="e.g. Software Engineer Resume"
          value={resumeTitle}
          onChange={(event) => setResumeTitle(event.target.value)}
        />
      </fieldset>

      <div className="tabs tabs-lift">
        {resumeTabs.map((tab, index) => (
          <Fragment key={tab}>
            <input
              type="radio"
              name="resume-tabs"
              className="tab"
              aria-label={tab}
              checked={activeTab === index}
              onChange={() => setActiveTab(index)}
            />

            <div className="tab-content bg-base-100 border-base-300 p-4">
              {isHydrating ? (
                <div className="py-10 text-center text-sm text-(--on-surface-variant)">
                  Loading resume data...
                </div>
              ) : (
                <>
                  {renderActiveSection()}

                  <ResumeEditorActions
                    tabs={resumeTabs}
                    activeTab={activeTab}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onClearTab={handleClearActiveTab}
                    onSave={() => void handleSaveResume()}
                    isSaving={isSaving}
                    isBusy={isHydrating}
                  />
                </>
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default ResumeEditorPane
export type { ResumeEditorInitialValues }
