import ResumeEditorPane from '../components/resume/ResumeEditorPane'
import ResumeFooter from '../components/resume/ResumeFooter'
import ResumePreviewPane from '../components/resume/ResumePreviewPane'
import ResumeTopNav from '../components/resume/ResumeTopNav'

function ResumeScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ResumeTopNav />

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
        <ResumeEditorPane />
        <ResumePreviewPane />
      </main>

      <ResumeFooter />
    </div>
  )
}

export default ResumeScreen
