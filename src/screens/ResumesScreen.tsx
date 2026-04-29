import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { deleteResume, listResumes, type ResumeRecord } from '../api/resumes'
import ResumeTopNav from '../components/resume/ResumeTopNav'
import AppFooter from '../components/shared/navigation/AppFooter'
import { useNotification } from '../contexts/useNotification'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import { Pencil, Trash2 } from 'lucide-react'

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
            <div className="card-body">
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

              <div className="card-actions justify-between mt-2">
                <a
                  href={/* placeholder for now */ '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  Preview
                </a>
                <div>
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
      </main>

      <AppFooter />
    </div>
  )
}

export default ResumesScreen
