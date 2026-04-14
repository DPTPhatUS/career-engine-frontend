function ProjectCompactCard() {
  return (
    <article className="group rounded-xl bg-base-200 p-6 transition-all duration-300 hover:bg-base-300">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-content-center rounded-lg bg-base-100 text-primary">
            &gt;_
          </div>

          <div>
            <h3 className="font-bold text-(--on-surface)">Terminal.ui Theme</h3>
            <p className="text-xs text-(--on-surface-variant)">Open Source - Jul 2023</p>
          </div>
        </div>

        <button type="button" className="btn border-0 bg-base-100 px-4 text-sm font-bold text-(--on-surface) group-hover:bg-primary group-hover:text-white">
          Details
        </button>
      </div>
    </article>
  )
}

export default ProjectCompactCard
