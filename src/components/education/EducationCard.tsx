import { GraduationCap, Pencil, Trash2 } from 'lucide-react'

type EducationItem = {
  school: string
  degree: string
  period: string
  location: string
  gpa: string
  field: string
  coursework?: string[]
}

type EducationCardProps = {
  item: EducationItem
}

function EducationCard({ item }: EducationCardProps) {
  return (
    <article className="group rounded-xl bg-base-100 p-6 shadow-(--ambient-shadow) transition-colors hover:bg-base-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="grid h-14 w-14 place-content-center rounded-xl bg-base-300 text-primary">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </div>

          <div>
            <h3 className="text-3xl font-bold tracking-tight text-(--on-surface)">{item.school}</h3>
            <p className="font-medium text-primary">{item.degree}</p>

            <p className="mt-1 text-sm text-(--on-surface-variant)">
              {item.period} | {item.location}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Edit education"
            className="btn btn-ghost btn-sm btn-square border-0 text-(--on-surface-variant) hover:bg-base-200"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Delete education"
            className="btn btn-ghost btn-sm btn-square border-0 text-(--on-surface-variant) hover:bg-error/15 hover:text-error"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-base-100/70 p-4">
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div>
            <p className="form-label">GPA</p>
            <p className="mt-1 font-semibold text-(--on-surface)">{item.gpa}</p>
          </div>

          <div className="col-span-2">
            <p className="form-label">Field of Study</p>
            <p className="mt-1 font-semibold text-(--on-surface)">{item.field}</p>
          </div>
        </div>

        {item.coursework && item.coursework.length > 0 ? (
          <div>
            <p className="form-label">
              Relevant Coursework
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.coursework.map((course) => (
                <span key={course} className="rounded-full bg-base-300 px-3 py-1 text-xs text-(--on-surface-variant)">
                  {course}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export type { EducationItem }
export default EducationCard
