import { GraduationCap, MapPin, Pencil, Trash2 } from 'lucide-react'
import type { EducationItem } from './EducationCard.types'

type EducationCardProps = {
  item: EducationItem
  isSelected?: boolean
  isDeleting?: boolean
  onEdit: (item: EducationItem) => void
  onDelete: (item: EducationItem) => void
}

function EducationCard({ item, isSelected = false, isDeleting = false, onEdit, onDelete }: EducationCardProps) {
  const hasCoursework = Boolean(item.coursework && item.coursework.length > 0)
  const isOngoing = /\(expected\)|present|expected/i.test(item.timePeriod)

  return (
    <div className={`card bg-base-100 border ${isSelected ? 'border-primary' : 'border-base-300'}`}>
      <div className="card-body">
        <div className="flex justify-between items-start">
          <GraduationCap className="text-primary" aria-hidden="true" />
          <div className="badge badge-outline text-xs opacity-70">{item.timePeriod}</div>
        </div>

        <div>
          <h2 className="card-title text-lg font-bold">{item.degree}</h2>
          <p className="text-sm text-secondary font-medium">{item.university}</p>
          {item.location ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs opacity-70">
              <MapPin className="size-3.5" aria-hidden="true" />
              {item.location}
            </p>
          ) : null}
        </div>

        <div className="divider"></div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            {item.gpa ? (
              <>
                <span className="font-semibold">GPA:</span>
                <span className="badge badge-ghost badge-sm">{item.gpa}</span>
              </>
            ) : null}
            <span className="badge badge-neutral badge-sm">{item.field}</span>
          </div>

          {hasCoursework ? (
            <div className="text-sm">
              <p>
                <strong>Coursework:</strong> {item.coursework?.join(', ')}
              </p>
            </div>
          ) : null}
        </div>

        <div className="card-actions justify-between mt-4">
          <div className="badge badge-success">
            <span className="inline-block size-2 rounded-full bg-success-content" aria-hidden="true" />
            {isOngoing ? 'Ongoing' : 'Graduated'}
          </div>

          <div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              aria-label="Edit education item"
              onClick={() => onEdit(item)}
              disabled={isDeleting}
            >
              <Pencil className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              aria-label="Delete education item"
              onClick={() => onDelete(item)}
              disabled={isDeleting}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EducationCard
