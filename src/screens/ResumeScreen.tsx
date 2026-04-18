import ResumeEditorPane from '../components/resume/ResumeEditorPane'
import ResumePreviewPane from '../components/resume/ResumePreviewPane'
import ResumeTopNav from '../components/resume/ResumeTopNav'
import AppFooter from '../components/shared/navigation/AppFooter'

function ResumeScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <ResumeTopNav />

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
        <ResumeEditorPane />
        <ResumePreviewPane />
      </main>

      <AppFooter />
    </div>
  )
}

export default ResumeScreen
