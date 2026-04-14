import ScreenTemplate from './ScreenTemplate'

function ResumeScreen() {
  return (
    <ScreenTemplate
      section="Resume Template"
      title="Resume Builder Placeholder"
      summary="Use this route for resume composition, preview, and export actions once section data and API workflows are wired."
      nextTasks={[
        'Build section tabs and editable resume fields.',
        'Render a live resume preview panel.',
        'Integrate save, generate, and export actions.',
      ]}
    />
  )
}

export default ResumeScreen
