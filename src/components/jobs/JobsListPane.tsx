import JobCard from './JobCard'
import type { JobItem } from './JobCard.types'

type JobsListPaneProps = {
  jobs: JobItem[]
  selectedId?: string | null
  deletingId: string | null
  onEdit: (item: JobItem) => void
  onDelete: (item: JobItem) => void
}

function JobsListPane({ jobs, selectedId, deletingId, onEdit, onDelete }: JobsListPaneProps) {
  if (jobs.length === 0) {
    return (
      <section className="lg:col-span-7">
        <div className="card border border-dashed border-base-300 bg-base-100">
          <div className="card-body">
            <h3 className="text-lg font-semibold">No jobs yet</h3>
            <p className="text-sm opacity-70">Add your first saved job in the editor pane.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-8 lg:col-span-7">
      {jobs.map((item) => (
        <JobCard
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          isDeleting={deletingId === item.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}

export default JobsListPane
