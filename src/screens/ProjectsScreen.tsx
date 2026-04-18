import ProjectsFormPane from '../components/projects/ProjectsFormPane'
import ProjectsListPane from '../components/projects/ProjectsListPane'
import ProjectsTopNav from '../components/projects/ProjectsTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'

function ProjectsScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ProjectsTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title="Your Projects"
          description="Manage your projects, track progress, and collaborate with your team all in one place."
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ProjectsFormPane />
          </div>

          <div className="lg:col-span-7">
            <ProjectsListPane />
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

export default ProjectsScreen
