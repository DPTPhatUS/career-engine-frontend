const footerLinks = ['Documentation', 'Privacy Policy', 'Terms of Service', 'Contact Support']

type AppFooterProps = {
  year?: string
}

function AppFooter({ year = '2026' }: AppFooterProps) {
  return (
    <footer className="mt-auto w-full bg-base-200/78 shadow-[0_-20px_25px_-24px_rgba(0,74,198,0.22)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-bold text-(--on-surface)">Career Engine</p>
          <p className="text-sm text-(--on-surface-variant)">
            © {year} Career Engine. Built with Precision Functionalism.
          </p>
        </div>

        <nav className="flex flex-wrap gap-6 text-sm text-(--on-surface-variant)">
          {footerLinks.map((item) => (
            <a key={item} href="#" className="transition-colors hover:text-(--on-surface)">
              {item}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default AppFooter
