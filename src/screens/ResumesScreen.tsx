import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { deleteResume, listResumes, type ResumeRecord } from '../api/resumes'
import ResumeTopNav from '../components/resume/ResumeTopNav'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useNotification } from '../contexts/useNotification'

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
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadResumes() {
      setIsLoading(true)

      try {
        const list = await listResumes()
        if (!isActive) {
          return
        }

        setResumes(list)
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
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`resume-skeleton-${index}`} className="card border border-base-200 bg-base-100">
              <div className="card-body gap-4">
                <div className="skeleton h-6 w-2/3" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-9 w-28" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (resumes.length === 0) {
      return (
        <div className="card border border-dashed border-base-300 bg-base-100">
          <div className="card-body">
            <h3 className="text-lg font-semibold">No resumes yet</h3>
            <p className="text-sm opacity-70">Start your first targeted resume from your project library.</p>
            <div className="card-actions">
              <Link to="/resumes/new" className="btn btn-primary">
                Create Resume
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {resumes.map((resume) => (
          <div key={resume.id} className="card border border-base-200 bg-base-100">
            <div className="card-body gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{resume.title}</h3>
                  <p className="text-sm text-(--on-surface-variant)">
                    Updated {formatDate(resume.updated_at)}
                  </p>
                </div>
                <span className="badge badge-outline">
                  {resume.payload.projects.length} projects
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-(--on-surface-variant)">
                <span>{resume.payload.education.length} education</span>
                <span>{resume.payload.skills.length} skill groups</span>
              </div>

              <div className="card-actions items-center justify-between">
                <Link to={`/resumes/${resume.id}`} className="btn btn-outline">
                  Edit Resume
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => void handleDelete(resume)}
                  disabled={deletingId === resume.id}
                >
                  {deletingId === resume.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ResumeTopNav />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 md:px-8 md:py-12 lg:py-14">
        <section className="relative overflow-hidden rounded-3xl border border-base-200 bg-base-100 p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 55%, #f0fdfa 100%)',
            }}
          />
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-(--on-surface-variant)">
                Resume Library
              </p>
              <h1 className="text-4xl font-semibold">Resumes</h1>
              <p className="mt-2 text-sm text-(--on-surface-variant)">
                Keep a curated set of targeted resumes ready for every role.
              </p>
            </div>
            <Link to="/resumes/new" className="btn btn-primary">
              New Resume
            </Link>
          </div>
        </section>

        <section className="mt-8">{renderListContent()}</section>
      </main>

      <AppFooter />
    </div>
  )
}

export default ResumesScreen
