function ResumeFooter() {
  return (
    <footer className="mt-auto w-full bg-base-100/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 px-12 py-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-(--on-surface)">Career Engine</p>
          <p className="text-sm text-(--on-surface-variant)">
            (c) 2024 Career Engine. Built with Precision Functionalism.
          </p>
        </div>

        <div className="flex flex-wrap gap-8">
          <a
            href="#"
            className="text-sm text-(--on-surface-variant) opacity-80 transition-all hover:text-(--on-surface) hover:underline hover:opacity-100"
          >
            Documentation
          </a>
          <a
            href="#"
            className="text-sm text-(--on-surface-variant) opacity-80 transition-all hover:text-(--on-surface) hover:underline hover:opacity-100"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-(--on-surface-variant) opacity-80 transition-all hover:text-(--on-surface) hover:underline hover:opacity-100"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm text-(--on-surface-variant) opacity-80 transition-all hover:text-(--on-surface) hover:underline hover:opacity-100"
          >
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  )
}

export default ResumeFooter
