import ResumeEditorActions from './ResumeEditorActions'
import ResumeEditorTabs from './ResumeEditorTabs'
import ResumePersonalInfoSection from './ResumePersonalInfoSection'

function ResumeEditorPane() {
  return (
    <aside className="bg-(--surface-container-low) lg:col-span-5 lg:h-[calc(100vh-64px)] lg:border-r lg:border-(--outline-variant)/15">
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
