import ScreenTemplate from './ScreenTemplate'

function ProjectsScreen() {
  return (
    <ScreenTemplate
      section="Projects Template"
      title="Projects Workspace Placeholder"
      summary="Build project portfolio CRUD and impact bullet management in this route, then connect it to your project endpoints."
      nextTasks={[
        'Model project draft state and editing controls.',
        'Save and delete projects through API requests.',
        'Display tech stack tags and impact bullet previews.',
      ]}
    />
  )
}

export default ProjectsScreen
