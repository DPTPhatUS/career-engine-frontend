import ScreenTemplate from './ScreenTemplate'

function EducationScreen() {
  return (
    <ScreenTemplate
      section="Education Template"
      title="Education Timeline Placeholder"
      summary="Use this space for CRUD controls around education entries and timeline management for resume generation."
      nextTasks={[
        'Implement add/edit/remove education entry forms.',
        'Persist timeline ordering with API data.',
        'Show empty, loading, and error states.',
      ]}
    />
  )
}

export default EducationScreen
