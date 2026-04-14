import ProjectCompactCard from './ProjectCompactCard'
import ProjectPrimaryCard from './ProjectPrimaryCard'
import ProjectSecondaryCard from './ProjectSecondaryCard'

function ProjectsListPane() {
  return (
    <section className="space-y-6">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-(--on-surface)">
          Active Portfolio <span className="ml-2 text-base font-normal text-(--on-surface-variant)">(3)</span>
        </h2>

        <button type="button" className="btn btn-ghost btn-sm border-0 gap-1 font-medium normal-case text-primary hover:bg-base-200">
          Sort by Date
        </button>
      </div>

      <ProjectPrimaryCard />
      <ProjectSecondaryCard />
      <ProjectCompactCard />
    </section>
  )
}

export default ProjectsListPane
