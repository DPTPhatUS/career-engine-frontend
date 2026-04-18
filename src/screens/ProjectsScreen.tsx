import ProjectsFormPane from '../components/projects/ProjectsFormPane'
import ProjectsHeader from '../components/projects/ProjectsHeader'
import ProjectsListPane from '../components/projects/ProjectsListPane'
import ProjectsTopNav from '../components/projects/ProjectsTopNav'
import AppFooter from '../components/shared/navigation/AppFooter'

function ProjectsScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ProjectsTopNav />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 pb-28 md:px-8 md:pb-12 lg:pl-14 lg:pr-20">
        <ProjectsHeader />

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
