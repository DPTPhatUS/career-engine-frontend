import ResumePaperPreview from './ResumePaperPreview'
import ResumePreviewControls from './ResumePreviewControls'

function ResumePreviewPane() {
  return (
    <section className="flex flex-col items-center bg-(--surface-container-high) p-8 lg:col-span-7 lg:p-12">
      <ResumePreviewControls />
      <ResumePaperPreview />

      <p className="mt-8 text-center text-sm font-medium text-(--on-surface-variant)/70">
        Auto-generated based on Career Engine Blueprint 2.0
      </p>
    </section>
  )
}

export default ResumePreviewPane
