type ScreenTemplateProps = {
  section: string
  title: string
  summary: string
  nextTasks: string[]
}

function ScreenTemplate({ section, title, summary, nextTasks }: ScreenTemplateProps) {
  return (
    <section className="screen-frame reveal-up">
      <header className="space-y-3">
        <p className="blueprint-label">{section}</p>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] md:text-5xl">{title}</h1>
        <p className="max-w-3xl text-base leading-7 text-(--on-surface-variant)">{summary}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="screen-card p-6">
          <h2 className="text-xl font-semibold tracking-[-0.01em]">Implementation Notes</h2>
          <p className="mt-3 text-sm leading-6 text-(--on-surface-variant)">
            This is intentionally a placeholder screen. Wire real data, forms, validation, and API
            requests here during implementation.
          </p>
        </article>

        <article className="screen-card p-6">
          <h2 className="text-xl font-semibold tracking-[-0.01em]">Next Tasks</h2>
          <ul className="screen-checklist mt-3">
            {nextTasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default ScreenTemplate
