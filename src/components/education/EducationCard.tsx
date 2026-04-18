import { GraduationCap, MapPin, Pencil, Trash2 } from 'lucide-react'

type EducationItem = {
  school: string
  degree: string
  period: string
  location: string
  gpa: string
  field: string
  coursework: string[]
}

type EducationCardProps = {
  item: EducationItem
}

function EducationCard({ item }: EducationCardProps) {
  const hasCoursework = Boolean(item.coursework && item.coursework.length > 0)

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <GraduationCap className="text-primary" aria-hidden="true" />
          <div className="badge badge-outline text-xs opacity-70">{item.period}</div>
        </div>

        <div>
          <h2 className="card-title text-lg font-bold">{item.degree}</h2>
          <p className="text-sm text-secondary font-medium">{item.school}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs opacity-70">
            <MapPin className="size-3.5" aria-hidden="true" />
            {item.location}
          </p>
        </div>

        <div className="divider"></div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">GPA:</span>
            <span className="badge badge-ghost badge-sm">{item.gpa}</span>
            <span className="badge badge-neutral badge-sm">{item.field}</span>
          </div>

          {hasCoursework ? (
            <div className="text-sm opacity-80">
              <p>
                <strong>Coursework:</strong> {item.coursework?.join(', ')}
              </p>
            </div>
          ) : null}
        </div>

        <div className="card-actions justify-between mt-4">
          <div className="badge badge-success gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-success-content" aria-hidden="true" />
            Graduated
          </div>

          <div>
            <button type="button" className="btn btn-ghost btn-sm" aria-label="Edit education item">
              <Pencil className="size-4" aria-hidden="true" />
            </button>
            <button type="button" className="btn btn-ghost btn-sm" aria-label="Delete education item">
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export type { EducationItem }
export default EducationCard
