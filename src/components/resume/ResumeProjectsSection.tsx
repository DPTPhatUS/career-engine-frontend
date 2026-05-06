import { useState } from 'react'
import ProjectCard from '../projects/ProjectCard'
import type { ProjectItem } from '../projects/ProjectCard.types'

export type ResumeProjectsValues = {
  title: string
  dateRange: string
  githubUrl: string
  techStack: string
  bullets: string
}

type ResumeProjectsSectionProps = {
  values: ResumeProjectsValues[]
  onChange: (index: number, field: keyof ResumeProjectsValues, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

type ProjectDateFields = {
  startMonth: string
  endMonth: string
}

function parseDateRange(dateRange: string): ProjectDateFields {
  const trimmed = dateRange.trim()
  if (!trimmed) {
    return { startMonth: '', endMonth: '' }
  }

  const parts = trimmed.split(/\s+-\s+/)
  if (parts.length < 2) {
    return {
      startMonth: trimmed,
      endMonth: '',
    }
  }

  return {
    startMonth: (parts[0] ?? '').trim(),
    endMonth: parts.slice(1).join(' - ').trim(),
  }
}

function buildDateRange(values: ProjectDateFields) {
  const start = values.startMonth.trim()
  const end = values.endMonth.trim()

  if (!start || !end) {
    return ''
  }

  return `${start} - ${end}`
}


function parseTechStack(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseBullets(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function mapProjectToCardItem(project: ResumeProjectsValues, index: number): ProjectItem {
  const githubUrl = project.githubUrl.trim()

  return {
    id: `resume-project-${index}`,
    title: project.title.trim(),
    dateRange: project.dateRange.trim(),
    tags: parseTechStack(project.techStack),
    bullets: parseBullets(project.bullets),
    githubUrl: githubUrl.length > 0 ? githubUrl : undefined,
  }
}

function ResumeProjectsSection({ values, onAdd, onChange, onRemove }: ResumeProjectsSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [techInput, setTechInput] = useState('')
  const hasEntries = values.length > 0
  const safeIndex = hasEntries ? Math.min(selectedIndex, values.length - 1) : -1
  const selectedProject = hasEntries ? values[safeIndex] : null
  const dateFields = selectedProject
    ? parseDateRange(selectedProject.dateRange)
    : { startMonth: '', endMonth: '' }
  const techStack = selectedProject ? parseTechStack(selectedProject.techStack) : []

  function handleAdd() {
    onAdd()
    setSelectedIndex(values.length)
    setTechInput('')
  }

  function handleSelect(index: number) {
    setSelectedIndex(index)
    setTechInput('')
  }

  function handleRemove(index: number) {
    onRemove(index)
    setSelectedIndex((previous) => {
      if (values.length <= 1) {
        return 0
      }

      if (index < previous) {
        return previous - 1
      }

      if (index === previous) {
        return Math.min(previous, values.length - 2)
      }

      return previous
    })
  }

  function updateDateRange(fields: Partial<ProjectDateFields>) {
    if (!selectedProject) {
      return
    }

    const next = {
      ...dateFields,
      ...fields,
    }

    onChange(safeIndex, 'dateRange', buildDateRange(next))
  }

  function handleAddTechStack() {
    if (!selectedProject) {
      return
    }

    const nextTech = techInput.trim()
    if (!nextTech) {
      return
    }

    const alreadyPresent = techStack.some((tech) => tech.toLowerCase() === nextTech.toLowerCase())
    if (!alreadyPresent) {
      const updated = [...techStack, nextTech].join(', ')
      onChange(safeIndex, 'techStack', updated)
    }

    setTechInput('')
  }

  function handleRemoveTechStack(techToRemove: string) {
    if (!selectedProject) {
      return
    }

    const updated = techStack.filter((tech) => tech !== techToRemove)
    onChange(safeIndex, 'techStack', updated.join(', '))
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <section className="space-y-4 lg:col-span-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">Project entries</h3>
            <p className="text-xs opacity-70">Select a card to edit.</p>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleAdd}>
            Add Project
          </button>
        </div>

        {hasEntries ? (
          <div className="space-y-4">
            {values.map((project, index) => {
              const item = mapProjectToCardItem(project, index)
              const isSelected = index === safeIndex

              return (
                <ProjectCard
                  item={item}
                  isSelected={isSelected}
                  onEdit={() => handleSelect(index)}
                  onDelete={() => handleRemove(index)}
                />
              )
            })}
          </div>
        ) : (
          <div className="card border border-dashed border-base-300 bg-base-100">
            <div className="card-body">
              <h3 className="text-lg font-semibold">No projects yet</h3>
              <p className="text-sm opacity-70">Add a project you want highlighted in this resume.</p>
            </div>
          </div>
        )}
      </section>

      <section className="self-start lg:col-span-5 lg:sticky lg:top-20">
        {selectedProject ? (
          <fieldset className="fieldset rounded-box border border-base-300 bg-base-200 p-4">
            <legend className="fieldset-legend">Project Editor</legend>

            <div>
              <label className="label" htmlFor={`resume-project-title-${safeIndex}`}>
                Project Title
              </label>
              <input
                id={`resume-project-title-${safeIndex}`}
                type="text"
                className="input w-full"
                placeholder="e.g. Neural Link Dashboard"
                value={selectedProject.title}
                onChange={(event) => onChange(safeIndex, 'title', event.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor={`resume-project-start-${safeIndex}`}>
                  Start Date
                </label>
                <input
                  id={`resume-project-start-${safeIndex}`}
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Sep 2020"
                  value={dateFields.startMonth}
                  onChange={(event) => updateDateRange({ startMonth: event.target.value })}
                />
              </div>

              <div>
                <label className="label" htmlFor={`resume-project-end-${safeIndex}`}>
                  End Date
                </label>
                <input
                  id={`resume-project-end-${safeIndex}`}
                  type="text"
                  className="input w-full"
                  placeholder="e.g. May 2024"
                  value={dateFields.endMonth}
                  onChange={(event) => updateDateRange({ endMonth: event.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor={`resume-project-github-url-${safeIndex}`}>
                Project URL
              </label>
              <input
                id={`resume-project-github-url-${safeIndex}`}
                type="text"
                className="input w-full"
                placeholder="github.com/username/repo"
                value={selectedProject.githubUrl}
                onChange={(event) => onChange(safeIndex, 'githubUrl', event.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor={`resume-project-tech-stack-${safeIndex}`}>
                Tech Stack
              </label>
              <div className={`${techStack.length > 0 ? 'mb-1' : ''} flex flex-wrap gap-1`}>
                {techStack.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    className="badge badge-secondary badge-sm cursor-pointer"
                    onClick={() => handleRemoveTechStack(tech)}
                    title="Click to remove"
                  >
                    {tech}
                  </button>
                ))}
              </div>
              <input
                id={`resume-project-tech-stack-${safeIndex}`}
                type="text"
                placeholder="Add technology..."
                className="input w-full"
                value={techInput}
                onChange={(event) => setTechInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleAddTechStack()
                  }
                }}
              />
            </div>

            <div>
              <label className="label" htmlFor={`resume-project-bullets-${safeIndex}`}>
                Key Accomplishments
              </label>
              <textarea
                id={`resume-project-bullets-${safeIndex}`}
                rows={4}
                placeholder="Bullet points detailing your impact..."
                className="textarea w-full"
                value={selectedProject.bullets}
                onChange={(event) => onChange(safeIndex, 'bullets', event.target.value)}
              />
            </div>
          </fieldset>
        ) : (
          <div className="card border border-dashed border-base-300 bg-base-100">
            <div className="card-body">
              <h3 className="text-lg font-semibold">Start with a new project</h3>
              <p className="text-sm opacity-70">Add a project to edit its details here.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default ResumeProjectsSection
