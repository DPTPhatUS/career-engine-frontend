import ResumeEditorActions from './ResumeEditorActions'
import ResumeEditorTabs from './ResumeEditorTabs'
import ResumePersonalInfoSection from './ResumePersonalInfoSection'

function ResumeEditorPane() {
  return (
    <aside className="bg-(--surface-container-low) lg:col-span-5 lg:h-[calc(100vh-64px)] lg:shadow-[10px_0_30px_-26px_rgba(0,74,198,0.42)]">
      <div className="flex h-full flex-col">
        <ResumeEditorTabs />

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <ResumePersonalInfoSection />
          <ResumeEditorActions />
        </div>
      </div>
    </aside>
  )
}

export default ResumeEditorPane
