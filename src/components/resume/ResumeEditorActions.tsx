type ResumeEditorActionsProps = {
  tabs: readonly string[]
  activeTab: number
  onPrevious: () => void
  onNext: () => void
  // onClearTab: () => void
  onSave: () => void
  isSaving: boolean
  isBusy?: boolean
}

function ResumeEditorActions({
  tabs,
  activeTab,
  onPrevious,
  onNext,
  // onClearTab,
  onSave,
  isSaving,
  isBusy = false,
}: ResumeEditorActionsProps) {
  const isFirstTab = activeTab === 0
  const isLastTab = activeTab === tabs.length - 1
  const nextTabLabel = isLastTab ? 'All sections complete' : `Next: ${tabs[activeTab + 1]}`
  const isDisabled = isSaving || isBusy

  return (
    <div className="mt-4 space-y-4">
      {/* <div className="divider my-0" />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-(--on-surface-variant)">
          Step {activeTab + 1} of {tabs.length}
        </p>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onClearTab}
          disabled={isDisabled}
        >
          Clear This Tab
        </button>
      </div> */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" className="btn btn-primary" onClick={onSave} disabled={isDisabled}>
          {isSaving ? 'Saving...' : 'Save Resume'}
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onPrevious}
            disabled={isFirstTab || isDisabled}
          >
            Previous
          </button>

          <button
            type="button"
            className="btn btn-neutral"
            onClick={onNext}
            disabled={isLastTab || isDisabled}
          >
            {nextTabLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResumeEditorActions
