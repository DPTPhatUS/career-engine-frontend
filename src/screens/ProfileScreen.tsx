import ScreenTemplate from './ScreenTemplate'

function ProfileScreen() {
  return (
    <ScreenTemplate
      section="Profile Template"
      title="Profile Editor Placeholder"
      summary="Implement account identity and contact fields here, including validation, save states, and backend profile endpoints."
      nextTasks={[
        'Add form schema and validation rules.',
        'Fetch existing profile values on load.',
        'Submit updates via API and show feedback states.',
      ]}
    />
  )
}

export default ProfileScreen
