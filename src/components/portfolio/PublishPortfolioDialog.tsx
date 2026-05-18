import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { ResumeRecord } from '../../api/resumes'
import {
  publishPortfolio,
  updatePortfolioPublication,
  type PortfolioPublicationRecord,
} from '../../api/portfolioPublications'
import { ExternalLink, X } from 'lucide-react'

type PublishPortfolioDialogProps = {
  open: boolean
  resume: ResumeRecord | null
  publication?: PortfolioPublicationRecord | null
  onClose: () => void
  onPublished: (record: PortfolioPublicationRecord) => void
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function createAllIndexes(length: number) {
  return Array.from({ length }, (_, index) => index)
}

function findSelectedIndexes(sourceItems: unknown[], snapshotItems: unknown[] | undefined) {
  if (!snapshotItems) {
    return createAllIndexes(sourceItems.length)
  }

  const usedIndexes = new Set<number>()
  return snapshotItems.flatMap((snapshotItem) => {
    const snapshotKey = JSON.stringify(snapshotItem)
    const sourceIndex = sourceItems.findIndex((sourceItem, index) => {
      return !usedIndexes.has(index) && JSON.stringify(sourceItem) === snapshotKey
    })

    if (sourceIndex < 0) {
      return []
    }

    usedIndexes.add(sourceIndex)
    return [sourceIndex]
  })
}

function PublishPortfolioDialog({ open, resume, publication, onClose, onPublished }: PublishPortfolioDialogProps) {
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [educationIndexes, setEducationIndexes] = useState<number[]>([])
  const [projectIndexes, setProjectIndexes] = useState<number[]>([])
  const [skillIndexes, setSkillIndexes] = useState<number[]>([])
  const [includeEmail, setIncludeEmail] = useState(false)
  const [includePhone, setIncludePhone] = useState(false)
  const [includeAddress, setIncludeAddress] = useState(false)
  const [includeGithub, setIncludeGithub] = useState(true)
  const [isPublished, setIsPublished] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [savedPublicUrl, setSavedPublicUrl] = useState<string | null>(null)

  const educationItems = useMemo(() => resume?.payload.education ?? [], [resume])
  const projectItems = useMemo(() => resume?.payload.projects ?? [], [resume])
  const skillItems = useMemo(() => resume?.payload.skills ?? [], [resume])

  useEffect(() => {
    if (!open || !resume) {
      return
    }

    setSlug(publication?.slug ?? slugify(resume.title))
    setTitle(publication?.title ?? resume.title)
    setEducationIndexes(findSelectedIndexes(educationItems, publication?.snapshot.education))
    setProjectIndexes(findSelectedIndexes(projectItems, publication?.snapshot.projects))
    setSkillIndexes(findSelectedIndexes(skillItems, publication?.snapshot.skills))
    setIncludeEmail(Boolean(publication?.snapshot.personal_info?.email))
    setIncludePhone(Boolean(publication?.snapshot.personal_info?.phone))
    setIncludeAddress(Boolean(publication?.snapshot.personal_info?.address))
    setIncludeGithub(
      publication
        ? Boolean(publication.snapshot.personal_info?.github_url || publication.snapshot.personal_info?.github_label)
        : true,
    )
    setIsPublished(publication?.is_published ?? true)
    setErrorMessage(null)
    setSavedPublicUrl(null)
  }, [educationItems, open, projectItems, publication, resume, skillItems])

  const canSubmit = useMemo(() => {
    return Boolean(resume && slug.trim())
  }, [resume, slug])

  function toggleIndex(indexes: number[], setIndexes: (value: number[]) => void, index: number) {
    if (indexes.includes(index)) {
      setIndexes(indexes.filter((item) => item !== index))
      return
    }

    setIndexes([...indexes, index].sort((a, b) => a - b))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!resume) {
      return
    }

    setIsSaving(true)
    setErrorMessage(null)

    try {
      const payload = {
        source_resume_id: resume.id,
        slug: slug.trim(),
        title: title.trim() || resume.title,
        contact: {
          include_email: includeEmail,
          include_phone: includePhone,
          include_address: includeAddress,
          include_github: includeGithub,
        },
        selection: {
          education_indexes: educationIndexes,
          project_indexes: projectIndexes,
          skill_indexes: skillIndexes,
        },
        is_published: isPublished,
      }

      const record = publication
        ? await updatePortfolioPublication(publication.id, payload)
        : await publishPortfolio(payload)

      onPublished(record)
      setSavedPublicUrl(record.public_url)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save publication settings.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!open || !resume) {
    return null
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold">{publication ? 'Edit Publish Settings' : 'Publish Portfolio'}</h3>
          <button type="button" aria-label="Close dialog" className="btn btn-ghost btn-sm" onClick={onClose}>
            <X className="size-4" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Public Slug</legend>
            <input className="input w-full" value={slug} onChange={(event) => setSlug(slugify(event.target.value))} />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Portfolio Title</legend>
            <input className="input w-full" value={title} onChange={(event) => setTitle(event.target.value)} />
          </fieldset>

          <div className="grid gap-4 md:grid-cols-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Education</legend>
              {educationItems.length === 0 ? <p className="text-sm opacity-70">No education entries.</p> : null}
              {educationItems.map((item, index) => (
                <label key={`${item.university}-${index}`} className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={educationIndexes.includes(index)}
                    onChange={() => toggleIndex(educationIndexes, setEducationIndexes, index)}
                  />
                  <span className="label-text">{item.university}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Projects</legend>
              {projectItems.length === 0 ? <p className="text-sm opacity-70">No projects.</p> : null}
              {projectItems.map((item, index) => (
                <label key={`${item.title}-${index}`} className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={projectIndexes.includes(index)}
                    onChange={() => toggleIndex(projectIndexes, setProjectIndexes, index)}
                  />
                  <span className="label-text">{item.title}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Skills</legend>
              {skillItems.length === 0 ? <p className="text-sm opacity-70">No skill groups.</p> : null}
              {skillItems.map((item, index) => (
                <label key={`${item.label}-${index}`} className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={skillIndexes.includes(index)}
                    onChange={() => toggleIndex(skillIndexes, setSkillIndexes, index)}
                  />
                  <span className="label-text">{item.label}</span>
                </label>
              ))}
            </fieldset>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Contact Visibility</legend>
            <div className="grid gap-2 md:grid-cols-2">
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox checkbox-sm" checked={includeEmail} onChange={(event) => setIncludeEmail(event.target.checked)} />
                <span className="label-text">Email</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox checkbox-sm" checked={includePhone} onChange={(event) => setIncludePhone(event.target.checked)} />
                <span className="label-text">Phone</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox checkbox-sm" checked={includeAddress} onChange={(event) => setIncludeAddress(event.target.checked)} />
                <span className="label-text">Address</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox checkbox-sm" checked={includeGithub} onChange={(event) => setIncludeGithub(event.target.checked)} />
                <span className="label-text">GitHub</span>
              </label>
            </div>
          </fieldset>

          <label className="label cursor-pointer justify-start gap-2">
            <input type="checkbox" className="checkbox checkbox-sm" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
            <span className="label-text">Published</span>
          </label>

          {errorMessage ? <p className="text-sm text-error">{errorMessage}</p> : null}
          {savedPublicUrl ? (
            <a href={savedPublicUrl} target="_blank" rel="noreferrer" className="link link-primary inline-flex items-center gap-1 text-sm">
              View public URL
              <ExternalLink className="size-4" />
            </a>
          ) : null}

          <div className="modal-action mt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
            <button type="submit" className="btn btn-primary" disabled={!canSubmit || isSaving}>
              {isSaving ? 'Saving...' : publication ? 'Save Settings' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  )
}

export default PublishPortfolioDialog
