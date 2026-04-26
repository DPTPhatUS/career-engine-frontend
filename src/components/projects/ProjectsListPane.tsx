import ProjectCard from './ProjectCard'
import type { ProjectItem } from './ProjectCard.types'

type ProjectsListPaneProps = {
  projects: ProjectItem[]
  deletingId: string | null
  onEdit: (item: ProjectItem) => void
  onDelete: (item: ProjectItem) => void
}

function ProjectsListPane({ projects, deletingId, onEdit, onDelete }: ProjectsListPaneProps) {
  if (projects.length === 0) {
    return (
      <section className="lg:col-span-7">
        <div className="card border border-dashed border-base-300 bg-base-100">
          <div className="card-body">
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="text-sm opacity-70">Save your first project from the editor pane.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-8 lg:col-span-7">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          item={project}
          isDeleting={deletingId === project.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}

export default ProjectsListPane
