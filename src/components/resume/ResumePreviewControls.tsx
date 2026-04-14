function ResumePreviewControls() {
  return (
    <div className="mb-8 flex w-full max-w-[816px] flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3 rounded-full bg-base-100 px-4 py-2 shadow-(--ambient-shadow)">
        <button
          type="button"
          className="btn btn-ghost h-7 min-h-7 w-7 rounded-full border-0 p-0 text-sm text-(--on-surface-variant) hover:text-primary"
        >
          -
        </button>

        <span className="text-xs font-bold text-(--on-surface-variant)">100%</span>

        <button
          type="button"
          className="btn btn-ghost h-7 min-h-7 w-7 rounded-full border-0 p-0 text-sm text-(--on-surface-variant) hover:text-primary"
        >
          +
        </button>

        <span className="h-1.5 w-1.5 rounded-full bg-base-300" />

        <button
          type="button"
          className="btn btn-ghost h-7 min-h-7 rounded-full border-0 px-3 text-xs font-medium normal-case text-(--on-surface-variant) hover:text-primary"
        >
          Print
        </button>
      </div>

      <span className="rounded-md bg-base-100 px-3 py-1 text-xs font-medium text-(--on-surface-variant) shadow-[0_8px_16px_-14px_rgba(0,74,198,0.45)]">
        Draft Saved 2m ago
      </span>
    </div>
  )
}

export default ResumePreviewControls
