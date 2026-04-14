import ScreenTemplate from './ScreenTemplate'

function SkillsScreen() {
  return (
    <ScreenTemplate
      section="Skills Template"
      title="Skills Matrix Placeholder"
      summary="Add grouped skills editing and categorization here so resume assembly can consume a normalized skills payload later."
      nextTasks={[
        'Define skill group structure and list controls.',
        'Support add/remove/reorder interactions.',
        'Serialize values for resume generation payloads.',
      ]}
    />
  )
}

export default SkillsScreen
