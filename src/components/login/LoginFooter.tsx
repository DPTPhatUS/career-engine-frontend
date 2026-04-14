function LoginFooter() {
  return (
    <footer className="mt-auto w-full border-t border-(--outline-variant)/10 bg-base-100/70 px-8 py-10 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-lg font-bold text-(--on-surface)">Career Engine</p>

        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-(--on-surface-variant)">
          (c) 2024 Career Engine. Precision in Recruitment.
        </p>

        <a
          href="#"
          className="text-xs font-medium uppercase tracking-[0.2em] text-(--on-surface-variant) transition-colors hover:text-primary"
        >
          Contact Support
        </a>
      </div>
    </footer>
  )
}

export default LoginFooter
