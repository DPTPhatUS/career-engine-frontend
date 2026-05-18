import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { deleteResume, listResumes, type ResumeRecord } from '../api/resumes'
import {
  listPortfolioPublications,
  updatePortfolioVisibility,
  type PortfolioPublicationRecord,
} from '../api/portfolioPublications'
import PublishPortfolioDialog from '../components/portfolio/PublishPortfolioDialog'
import ResumeTopNav from '../components/resume/ResumeTopNav'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useNotification } from '../contexts/useNotification'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import { ExternalLink, Eye, Pencil, Trash2 } from 'lucide-react'

function formatDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

function ResumesScreen() {
  const { notifyError, notifySuccess } = useNotification()
  const [resumes, setResumes] = useState<ResumeRecord[]>([])
  const [publications, setPublications] = useState<PortfolioPublicationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingVisibilityId, setUpdatingVisibilityId] = useState<string | null>(null)
  const [dialogResume, setDialogResume] = useState<ResumeRecord | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadResumes() {
      setIsLoading(true)

      try {
        const [resumeList, publicationList] = await Promise.all([
          listResumes(),
          listPortfolioPublications(),
        ])
        if (!isActive) {
          return
        }

        setResumes(resumeList)
        setPublications(publicationList)
      } catch (error) {
        if (!isActive) {
          return
        }

        notifyError(error instanceof Error ? error.message : 'Unable to load resumes.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadResumes()

    return () => {
      isActive = false
    }
  }, [notifyError])

  async function handleTogglePublication(publication: PortfolioPublicationRecord, isPublished: boolean) {
    setUpdatingVisibilityId(publication.id)

    try {
      const updated = await updatePortfolioVisibility(publication.id, isPublished)
      setPublications((previous) => previous.map((item) => (item.id === updated.id ? updated : item)))
      notifySuccess(isPublished ? 'Portfolio published.' : 'Portfolio unpublished.')
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Unable to update publication visibility.')
    } finally {
      setUpdatingVisibilityId(null)
    }
  }

  function handlePublished(record: PortfolioPublicationRecord) {
    setPublications((previous) => {
      const existingIndex = previous.findIndex((item) => item.id === record.id)
      if (existingIndex >= 0) {
        return previous.map((item) => (item.id === record.id ? record : item))
      }

      return [...previous, record]
    })

    setDialogResume(null)
    notifySuccess(record.is_published ? 'Portfolio published successfully.' : 'Publish settings saved.')
  }

  async function handleDelete(resume: ResumeRecord) {
    if (!window.confirm(`Delete "${resume.title}"? This cannot be undone.`)) {
      return
    }

    setDeletingId(resume.id)

    try {
      await deleteResume(resume.id)
      setResumes((previous) => previous.filter((item) => item.id !== resume.id))
      notifySuccess('Resume deleted.')
    } catch (error) {
      const message = error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : 'Unable to delete resume.'
      notifyError(message)
    } finally {
      setDeletingId(null)
    }
  }

  function renderListContent() {
    if (isLoading) {
      // return (
      //   <div className="grid gap-6 lg:grid-cols-2">
      //     {Array.from({ length: 4 }).map((_, index) => (
      //       <div key={`resume-skeleton-${index}`} className="card border border-base-200 bg-base-100">
      //         <div className="card-body gap-4">
      //           <div className="skeleton h-6 w-2/3" />
      //           <div className="skeleton h-4 w-1/2" />
      //           <div className="skeleton h-4 w-full" />
      //           <div className="skeleton h-9 w-28" />
      //         </div>
      //       </div>
      //     ))}
      //   </div>
      // )
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card border border-dashed border-base-300 bg-base-100">
          <div className="card-body">
            <h3 className="card-title">New Resume</h3>
            <p className="opacity-70">Start building your next targeted resume. Tailored by AI to match your goals and preferences.</p>
            <div className="card-actions justify-end">
              <Link to="/resumes/new" className="btn btn-primary">
                Create Resume
              </Link>
            </div>
          </div>
        </div>

        {resumes.map((resume) => (
          <div key={resume.id} className="card border border-base-300 bg-base-100">
            <div className="card-body gap-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">{resume.title}</h3>
                <span className="badge badge-outline">
                  {resume.payload.projects.length} projects
                </span>
              </div>
              <p className="text-sm">
                Updated {formatDate(resume.updated_at)}
              </p>

              {/* <div className="flex flex-wrap gap-3 text-sm">
                <span>{resume.payload.education.length} education</span>
                <span>{resume.payload.skills.length} skill groups</span>
              </div> */}

              <div className="card-actions mt-2 justify-between">
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const publication = publications.find((item) => item.source_resume_id === resume.id)

                    if (!publication) {
                      return (
                        <button type="button" className="btn btn-outline" onClick={() => setDialogResume(resume)}>
                          Publish
                        </button>
                      )
                    }

                    return (
                      <>
                        {publication.is_published ? (
                          <a href={publication.public_url} target="_blank" rel="noreferrer" className="btn btn-outline">
                            <Eye className="size-4" />
                            View
                          </a>
                        ) : null}
                        <button type="button" className="btn btn-outline" onClick={() => setDialogResume(resume)}>
                          Edit Publish Settings
                        </button>
                        <button
                          type="button"
                          className={`btn ${publication.is_published ? 'btn-warning' : 'btn-primary'}`}
                          disabled={updatingVisibilityId === publication.id}
                          onClick={() => void handleTogglePublication(publication, !publication.is_published)}
                        >
                          {publication.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                      </>
                    )
                  })()}
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    to={`/resumes/${resume.id}`}
                    aria-label="Edit resume"
                    className="btn btn-ghost"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    aria-label="Delete resume"
                    className="btn btn-ghost"
                    onClick={() => void handleDelete(resume)}
                    disabled={deletingId === resume.id}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
              {(() => {
                const publication = publications.find((item) => item.source_resume_id === resume.id)
                if (!publication) {
                  return null
                }

                return (
                  <a href={publication.public_url} target="_blank" rel="noreferrer" className="link link-primary inline-flex items-center gap-1 text-sm">
                    {publication.public_url}
                    <ExternalLink className="size-3.5" />
                  </a>
                )
              })()}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ResumeTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title="Your Resumes"
          description="Manage your resumes and keep them up to date for every opportunity."
        />

        {renderListContent()}
        <PublishPortfolioDialog
          open={dialogResume !== null}
          resume={dialogResume}
          publication={dialogResume ? publications.find((item) => item.source_resume_id === dialogResume.id) : null}
          onClose={() => setDialogResume(null)}
          onPublished={handlePublished}
        />
      </main>

      <AppFooter />
    </div>
  )
}

export default ResumesScreen
