import { Pencil, Trash2 } from 'lucide-react'

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
    <article className="group rounded-xl bg-base-200 p-6 shadow-(--ambient-shadow) transition-colors duration-300 hover:bg-base-300">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-(--on-surface) transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="text-xs text-(--on-surface-variant)">{period}</p>
        </div>

        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            aria-label="Edit project"
            className="btn btn-ghost btn-sm btn-square border-0 text-(--on-surface-variant) hover:bg-base-100 hover:text-primary"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Delete project"
            className="btn btn-ghost btn-sm btn-square border-0 text-(--on-surface-variant) hover:bg-base-100 hover:text-error"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-base-100 text-(--on-surface-variant)">
            {tag}
          </span>
        ))}
      </div>

      <ul className="mb-6 space-y-3 text-sm text-(--on-surface-variant)">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center justify-between rounded-lg bg-base-100/70 px-3 py-3">
        <button type="button" className="btn btn-ghost btn-sm border-0 gap-2 px-0 text-xs font-bold uppercase tracking-wide text-primary hover:bg-transparent">
          {repositoryLabel}
          <span>{'->'}</span>
        </button>
      </div>
    </article>
  )
}

export default ProjectCard
