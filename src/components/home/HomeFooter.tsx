function HomeFooter() {
  return (
    <footer className="mt-auto w-full border-t border-base-300 bg-base-200/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-bold text-(--on-surface)">Career Engine</p>
          <p className="text-sm text-(--on-surface-variant)">
            © 2026 Career Engine. Built with Precision Functionalism.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-(--on-surface-variant)">
          <a href="#" className="hover:text-(--on-surface) hover:underline">
            Documentation
          </a>
          <a href="#" className="hover:text-(--on-surface) hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-(--on-surface) hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:text-(--on-surface) hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  )
}

export default HomeFooter
