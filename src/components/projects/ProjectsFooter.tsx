function ProjectsFooter() {
  return (
    <footer className="mt-auto w-full bg-base-200/70">
      <div className="h-1 w-full bg-base-300" />
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 px-12 py-10 md:flex-row md:items-center">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="font-bold text-(--on-surface)">Career Engine</p>
          <p className="text-sm opacity-80 text-(--on-surface-variant)">
            (c) 2026 Career Engine. Built with Precision Functionalism.
          </p>
        </div>

        <div className="flex flex-wrap gap-8">
          <a href="#" className="text-sm opacity-80 text-(--on-surface-variant) transition-all hover:opacity-100 hover:text-(--on-surface) hover:underline">
            Documentation
          </a>
          <a href="#" className="text-sm opacity-80 text-(--on-surface-variant) transition-all hover:opacity-100 hover:text-(--on-surface) hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="text-sm opacity-80 text-(--on-surface-variant) transition-all hover:opacity-100 hover:text-(--on-surface) hover:underline">
            Terms of Service
          </a>
          <a href="#" className="text-sm opacity-80 text-(--on-surface-variant) transition-all hover:opacity-100 hover:text-(--on-surface) hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  )
}

export default ProjectsFooter
