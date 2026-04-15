function ResumeEditorActions() {
  return (
    <div className="mt-10 space-y-6">
      <div className="soft-divider" />

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="btn btn-ghost h-10 min-h-10 border-0 px-4 text-sm font-bold normal-case text-primary hover:bg-base-300"
        >
          Clear All
        </button>

        <button
          type="button"
          className="btn primary-cta h-12 min-h-12 border-0 px-8 text-sm font-bold normal-case"
        >
          Next: Education
          <span className="ml-1">{'->'}</span>
        </button>
      </div>
    </div>
  )
}

export default ResumeEditorActions
