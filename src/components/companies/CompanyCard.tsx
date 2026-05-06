import { Building2, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import type { CompanyItem } from './CompanyCard.types'

type CompanyCardProps = {
  item: CompanyItem
  isSelected?: boolean
  isDeleting?: boolean
  onEdit: (item: CompanyItem) => void
  onDelete: (item: CompanyItem) => void
}

function CompanyCard({ item, isSelected = false, isDeleting = false, onEdit, onDelete }: CompanyCardProps) {
  return (
    <div className={`card border ${isSelected ? 'border-primary' : 'border-base-300'} bg-base-100`}>
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <Building2 className="text-primary" aria-hidden="true" />
          {item.companyUrl ? (
            <a
              href={item.companyUrl}
              target="_blank"
              rel="noreferrer"
              className="badge badge-outline gap-1"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              Site
            </a>
          ) : (
            <div className="badge badge-outline text-xs opacity-70">No site</div>
          )}
        </div>

        <div>
          <h2 className="card-title text-lg font-bold">{item.name}</h2>
          {item.overview ? <p className="mt-2 text-sm opacity-80">{item.overview}</p> : null}
        </div>

        <div className="card-actions justify-end mt-4">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            aria-label="Edit company"
            onClick={() => onEdit(item)}
            disabled={isDeleting}
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            aria-label="Delete company"
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

export default CompanyCard
