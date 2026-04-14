const priorityChips = [
  { label: 'Active Filters', active: true },
  { label: 'Backend Synced', active: false },
  { label: 'Portfolio Ready', active: false },
  { label: 'Interview Mode', active: true },
]

const workflowCards = [
  {
    heading: 'Profile Health',
    value: '92%',
    detail: 'All critical fields are complete and verified.',
  },
  {
    heading: 'Tone Match',
    value: 'Strong',
    detail: 'Content aligns with a senior platform engineering role.',
  },
]

const completionSteps = [
  {
    title: 'Identity Layer',
    text: 'Core profile data is validated against backend session rules.',
  },
  {
    title: 'Evidence Layer',
    text: 'Projects and outcomes are grouped by impact and recency.',
  },
  {
    title: 'Narrative Layer',
    text: 'Summary voice is tuned for clarity, authority, and precision.',
  },
]

function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-(--surface) text-(--on-surface)">
      <div className="atmosphere" aria-hidden="true" />

      <header className="sticky top-4 z-20 px-4 sm:px-6 xl:px-10">
        <nav className="glass-shell mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
          <div>
            <p className="blueprint-label">Career Engine</p>
            <p className="text-sm font-medium tracking-wide text-(--on-surface)">
              Precision Functionalism UI Kit
            </p>
          </div>
          <button
            type="button"
            className="btn border-0 bg-(--surface-container-highest) px-4 text-sm font-semibold normal-case text-(--on-surface) hover:bg-(--surface-container-high)"
          >
            View Tokens
          </button>
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] xl:pl-20 xl:pr-32">
        <section className="reveal-up space-y-8">
          <div className="space-y-4">
            <p className="blueprint-label">Workflow Studio / Frontend Shell</p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.02em] md:text-6xl">
              Build premium career workflows with layered, no-line structure.
            </h1>
            <p className="max-w-xl text-base leading-7 text-(--on-surface-variant) md:text-lg">
              This starter uses tonal depth and editorial spacing to turn utility components
              into a signature interface. Sections are separated by surfaces, never hard lines.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {priorityChips.map((chip) => (
              <span
                key={chip.label}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  chip.active
                    ? 'bg-(--chip-active) text-(--chip-active-content)'
                    : 'bg-(--chip-inactive) text-(--chip-inactive-content)'
                }`}
              >
                {chip.label}
              </span>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {workflowCards.map((card) => (
              <article
                key={card.heading}
                className="rounded-xl bg-(--surface-container-highest) p-5"
              >
                <p className="blueprint-label">{card.heading}</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.02em]">{card.value}</p>
                <p className="mt-2 text-sm leading-6 text-(--on-surface-variant)">
                  {card.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="reveal-up" style={{ animationDelay: '120ms' }}>
          <div className="rounded-2xl bg-(--surface-container-low) p-3 sm:p-4">
            <article className="rounded-2xl bg-(--surface-container-lowest) p-6 shadow-(--ambient-shadow)">
              <div className="space-y-1">
                <p className="blueprint-label">Primary Action</p>
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">Profile Intake</h2>
                <p className="text-sm leading-6 text-(--on-surface-variant)">
                  Collect identity and experience inputs with high-contrast form controls.
                </p>
              </div>

              <form className="mt-6 space-y-4">
                <label className="block space-y-2">
                  <span className="blueprint-label">Full Name</span>
                  <input className="ghost-field w-full rounded-lg px-4 py-3 text-lg" placeholder="Ada Lovelace" />
                </label>

                <label className="block space-y-2">
                  <span className="blueprint-label">Role Target</span>
                  <input
                    className="ghost-field w-full rounded-lg px-4 py-3 text-lg"
                    placeholder="Senior Platform Engineer"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="blueprint-label">Narrative Focus</span>
                  <textarea
                    className="ghost-field min-h-28 w-full rounded-lg px-4 py-3 text-lg"
                    placeholder="Summarize outcomes with quantified impact and platform ownership."
                  />
                </label>

                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  <button type="button" className="btn primary-cta w-full border-0 text-base font-semibold normal-case">
                    Generate Summary
                  </button>
                  <button
                    type="button"
                    className="btn w-full border-0 bg-(--secondary-container) text-base font-semibold normal-case text-(--on-secondary-container) hover:brightness-95"
                  >
                    Save Draft
                  </button>
                </div>
              </form>
            </article>
          </div>
        </section>
      </main>

      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 xl:pl-20 xl:pr-32">
        <div className="reveal-up rounded-2xl bg-(--surface-container-low) p-4 md:p-5" style={{ animationDelay: '220ms' }}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="blueprint-label">Layered Progress</p>
              <h3 className="text-2xl font-semibold tracking-[-0.02em]">Completion Stack</h3>
            </div>
            <p className="text-sm font-medium text-(--on-surface-variant)">No dividers, only spacing and tone shifts</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {completionSteps.map((step, index) => (
              <article
                key={step.title}
                className={`rounded-xl p-5 ${
                  index % 2 === 0
                    ? 'bg-(--surface-container-lowest)'
                    : 'bg-(--surface)'
                }`}
              >
                <p className="blueprint-label">Step {index + 1}</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.01em]">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-(--on-surface-variant)">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
