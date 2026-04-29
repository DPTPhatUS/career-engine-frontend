import { useState } from 'react'
import EducationCard from '../education/EducationCard'
import type { EducationItem } from '../education/EducationCard.types'

export type ResumeEducationValues = {
  university: string
  degree: string
  field: string
  timePeriod: string
  gpa: string
  location: string
  relevantCoursework: string
}

type ResumeEducationSectionProps = {
  values: ResumeEducationValues[]
  onChange: (index: number, field: keyof ResumeEducationValues, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

type CompletionStatus = 'graduated' | 'ongoing'

type EducationTimeFields = {
  startMonth: string
  endMonth: string
  completionStatus: CompletionStatus
}

const defaultTimeFields: EducationTimeFields = {
  startMonth: '',
  endMonth: '',
  completionStatus: 'graduated',
}

function parseTimePeriod(timePeriod: string): EducationTimeFields {
  const trimmed = timePeriod.trim()
  if (!trimmed) {
    return defaultTimeFields
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

function buildTimePeriod(values: EducationTimeFields) {
  const start = values.startMonth.trim()
  const end = values.endMonth.trim()

  if (!start || !end) {
    return ''
  }

  return values.completionStatus === 'ongoing'
    ? `${start} - ${end} (Expected)`
    : `${start} - ${end}`
}

function parseCoursework(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function mapEducationToCardItem(education: ResumeEducationValues, index: number): EducationItem {
  const location = education.location.trim()
  const gpa = education.gpa.trim()

  return {
    id: `resume-education-${index}`,
    university: education.university.trim(),
    degree: education.degree.trim(),
    timePeriod: education.timePeriod.trim(),
    location: location.length > 0 ? location : undefined,
    gpa: gpa.length > 0 ? gpa : undefined,
    field: education.field.trim(),
    coursework: parseCoursework(education.relevantCoursework),
  }
}

function ResumeEducationSection({ values, onAdd, onChange, onRemove }: ResumeEducationSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const hasEntries = values.length > 0
  const safeIndex = hasEntries ? Math.min(selectedIndex, values.length - 1) : -1
  const selectedEducation = hasEntries ? values[safeIndex] : null
  const timeFields = selectedEducation
    ? parseTimePeriod(selectedEducation.timePeriod)
    : defaultTimeFields

  function handleAdd() {
    onAdd()
    setSelectedIndex(values.length)
  }

  function handleSelect(index: number) {
    setSelectedIndex(index)
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

  function updateTimePeriod(fields: Partial<EducationTimeFields>) {
    if (!selectedEducation) {
      return
    }

    const next = {
      ...timeFields,
      ...fields,
    }

    onChange(safeIndex, 'timePeriod', buildTimePeriod(next))
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">Education entries</h3>
            <p className="text-xs opacity-70">Select a card to edit.</p>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleAdd}>
            Add Education
          </button>
        </div>

        {hasEntries ? (
          <div className="space-y-4">
            {values.map((education, index) => {
              const item = mapEducationToCardItem(education, index)
              const isSelected = index === safeIndex

              return (
                <EducationCard
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
              <h3 className="text-lg font-semibold">No education entries yet</h3>
              <p className="text-sm opacity-70">Add your first education entry to start editing.</p>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-5 lg:sticky lg:top-20">
        {selectedEducation ? (
          <fieldset className="fieldset rounded-box border border-base-300 bg-base-200 p-4">
            <legend className="fieldset-legend">Education Editor</legend>

            <div>
              <label className="label" htmlFor={`resume-education-university-${safeIndex}`}>
                University Name
              </label>
              <input
                id={`resume-education-university-${safeIndex}`}
                type="text"
                className="input w-full"
                placeholder="e.g. Massachusetts Institute of Technology"
                value={selectedEducation.university}
                onChange={(event) => onChange(safeIndex, 'university', event.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor={`resume-education-degree-${safeIndex}`}>
                  Degree
                </label>
                <input
                  id={`resume-education-degree-${safeIndex}`}
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Bachelor of Arts"
                  value={selectedEducation.degree}
                  onChange={(event) => onChange(safeIndex, 'degree', event.target.value)}
                />
              </div>

              <div>
                <label className="label" htmlFor={`resume-education-field-${safeIndex}`}>
                  Field of Study
                </label>
                <input
                  id={`resume-education-field-${safeIndex}`}
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Economics"
                  value={selectedEducation.field}
                  onChange={(event) => onChange(safeIndex, 'field', event.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor={`resume-education-start-${safeIndex}`}>
                  Start Date
                </label>
                <input
                  id={`resume-education-start-${safeIndex}`}
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Sep 2020"
                  value={timeFields.startMonth}
                  onChange={(event) => updateTimePeriod({ startMonth: event.target.value })}
                />
              </div>

              <div>
                <label className="label" htmlFor={`resume-education-end-${safeIndex}`}>
                  End Date
                </label>
                <input
                  id={`resume-education-end-${safeIndex}`}
                  type="text"
                  className="input w-full"
                  placeholder="e.g. May 2024"
                  value={timeFields.endMonth}
                  onChange={(event) => updateTimePeriod({ endMonth: event.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor={`resume-education-completion-${safeIndex}`}>
                Completion Status
              </label>
              <select
                id={`resume-education-completion-${safeIndex}`}
                className="select w-full"
                value={timeFields.completionStatus}
                onChange={(event) => updateTimePeriod({ completionStatus: event.target.value as CompletionStatus })}
              >
                <option value="graduated">Graduated</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="label" htmlFor={`resume-education-gpa-${safeIndex}`}>
                  GPA
                </label>
                <input
                  id={`resume-education-gpa-${safeIndex}`}
                  type="text"
                  className="input w-full"
                  placeholder="e.g. 3.8 / 4.0"
                  value={selectedEducation.gpa}
                  onChange={(event) => onChange(safeIndex, 'gpa', event.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="label" htmlFor={`resume-education-location-${safeIndex}`}>
                  Location
                </label>
                <input
                  id={`resume-education-location-${safeIndex}`}
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Cambridge, MA"
                  value={selectedEducation.location}
                  onChange={(event) => onChange(safeIndex, 'location', event.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor={`resume-education-coursework-${safeIndex}`}>
                Coursework
              </label>
              <textarea
                id={`resume-education-coursework-${safeIndex}`}
                className="textarea w-full"
                placeholder="e.g. Data Structures, Algorithms, Computer Networks"
                value={selectedEducation.relevantCoursework}
                onChange={(event) => onChange(safeIndex, 'relevantCoursework', event.target.value)}
              ></textarea>
            </div>
          </fieldset>
        ) : (
          <div className="card border border-dashed border-base-300 bg-base-100">
            <div className="card-body">
              <h3 className="text-lg font-semibold">Start with a new education entry</h3>
              <p className="text-sm opacity-70">Add an entry to edit its details here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeEducationSection
