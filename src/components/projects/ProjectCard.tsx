import { FolderGit2, Pencil, Trash2 } from 'lucide-react'

type ProjectItem = {
  id: string
  title: string
  dateRange: string
  tags: string[]
  bullets: string[]
  githubUrl?: string
}

function ProjectCard({
  item,
  isDeleting = false,
  onEdit,
  onDelete,
}: {
  item: ProjectItem
  isDeleting?: boolean
  onEdit: (item: ProjectItem) => void
  onDelete: (item: ProjectItem) => void
}) {
  return (
    <div className="card border border-base-300 bg-base-100">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <FolderGit2 className="text-primary" aria-hidden="true" />
          <div className="badge badge-outline text-xs opacity-70">{item.dateRange}</div>
        </div>

        <h2 className="card-title">{item.title}</h2>

        <div className="divider my-1"></div>

        <div className="mb-2 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="badge badge-ghost badge-sm">
              {tag}
            </span>
          ))}
        </div>

        <ul className="text-sm opacity-80">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="card-actions justify-between mt-2">
          {item.githubUrl ? (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm text-primary"
            >
              View Repository
            </a>
          ) : (
            <span className="btn btn-ghost btn-sm btn-disabled">No Repository</span>
          )}

          <div>
            <button
              type="button"
              aria-label="Edit project"
              className="btn btn-ghost btn-sm"
              onClick={() => onEdit(item)}
              disabled={isDeleting}
            >
              <Pencil className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Delete project"
              className="btn btn-ghost btn-sm"
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

export type { ProjectItem }
export default ProjectCard
