function LoginLegalLinks() {
  return (
    <div className="mt-8 text-center">
      <div className="inline-flex items-center gap-4">
        <a
          href="#"
          className="text-xs font-medium text-(--on-surface-variant) transition-colors hover:text-primary"
        >
          Privacy Policy
        </a>

        <span className="text-(--outline-variant)/60">.</span>

        <a
          href="#"
          className="text-xs font-medium text-(--on-surface-variant) transition-colors hover:text-primary"
        >
          Terms of Service
        </a>
      </div>
    </div>
  )
}

export default LoginLegalLinks
