import { Building2, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import type { JobItem } from './JobCard.types'

type JobCardProps = {
  item: JobItem
  isSelected?: boolean
  isDeleting?: boolean
  onEdit: (item: JobItem) => void
  onDelete: (item: JobItem) => void
}

const stageLabels: Record<JobItem['stage'], string> = {
  saved: 'Saved',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
  expired: 'Expired',
}

function isOverdue(item: JobItem) {
  if (!item.deadline) {
    return false
  }

  if (item.stage === 'expired' || item.stage === 'offer' || item.stage === 'rejected') {
    return false
  }

  return item.deadline < new Date().toISOString().slice(0, 10)
}

function JobCard({ item, isSelected = false, isDeleting = false, onEdit, onDelete }: JobCardProps) {
  const overdue = isOverdue(item)

  return (
    <div className={`card border ${isSelected ? 'border-primary' : 'border-base-300'} bg-base-100`}>
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Building2 className="mt-1 text-primary" aria-hidden="true" />
            <div>
              <h2 className="card-title text-lg font-bold">{item.title}</h2>
              {item.companyUrl ? (
                <a
                  href={item.companyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm text-secondary hover:underline"
                >
                  {item.companyName}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              ) : (
                <p className="mt-1 text-sm text-secondary">{item.companyName}</p>
              )}
            </div>
          </div>

          <div className="badge badge-outline text-xs opacity-70">{stageLabels[item.stage]}</div>
        </div>

        <div className="divider my-1" />

        <div className="space-y-4">
          {item.deadline ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-60">Deadline</p>
              <p className={`text-sm ${overdue ? 'font-semibold text-error' : 'opacity-80'}`}>{item.deadline}</p>
            </div>
          ) : null}

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-60">Description</p>
            <p className="whitespace-pre-line text-sm opacity-80">{item.jobDescription}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-60">Requirements</p>
            <p className="whitespace-pre-line text-sm opacity-80">{item.jobRequirements}</p>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            aria-label="Edit job"
            onClick={() => onEdit(item)}
            disabled={isDeleting}
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            aria-label="Delete job"
            onClick={() => onDelete(item)}
            disabled={isDeleting}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default JobCard
