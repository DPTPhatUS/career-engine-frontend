const tabs = ['Personal Info', 'Education', 'Experience', 'Projects', 'Skills']

function ResumeEditorTabs() {
  return (
    <div className="bg-(--surface-container-low) px-6 pt-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-(--on-surface)">Editor</h1>

        <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          AI Assist
        </span>
      </div>

      <div className="-mx-1 mb-2 flex gap-2 overflow-x-auto px-1 pb-2">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={
              index === 0
                ? 'btn h-9 min-h-9 rounded-full border-0 bg-primary px-4 text-xs font-bold uppercase tracking-wide text-white'
                : 'btn h-9 min-h-9 rounded-full border-0 bg-base-200 px-4 text-xs font-medium text-(--on-surface-variant) hover:bg-base-300'
            }
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ResumeEditorTabs
