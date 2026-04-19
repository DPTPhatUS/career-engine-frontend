import { FolderGit2, Pencil, Trash2 } from 'lucide-react'

type ProjectPrimaryCardProps = {
  title?: string
  period?: string
  tags?: string[]
  bullets?: string[]
  repositoryLabel?: string
  contributorCount?: number
}

const defaultTags = ['Rust', 'WebAssembly', 'PostgreSQL']

const defaultBullets = [
  'Architected a high-performance computation engine reducing latency by 45% using Rust/WASM hooks.',
  'Implemented a custom DSL for logical branching that supports over 10k concurrent evaluations.',
]

function ProjectCard({
  title = 'Quantum Logic Engine',
  period = 'Jan 2024 - Present',
  tags = defaultTags,
  bullets = defaultBullets,
  repositoryLabel = 'View Repository',
}: ProjectPrimaryCardProps) {
  return (
    <div className="card border border-base-300 bg-base-100">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <FolderGit2 className="text-primary" aria-hidden="true" />
          <div className="badge badge-outline text-xs opacity-70">{period}</div>
        </div>

        <h2 className="card-title">{title}</h2>

        <div className="divider my-1"></div>

        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="badge badge-ghost badge-sm">
              {tag}
            </span>
          ))}
        </div>

        <ul className="text-sm opacity-80">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="card-actions justify-between mt-2">
          <button type="button" className="btn btn-ghost btn-sm text-primary">
            {repositoryLabel}
          </button>

          <div>
            <button
              type="button"
              aria-label="Edit project"
              className="btn btn-ghost btn-sm"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Delete project"
              className="btn btn-ghost btn-sm"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
