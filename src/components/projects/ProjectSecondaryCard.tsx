const imageUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD0wi5i8ibhZnmNKwtjesjGF4ffgePDecdanprTX3rtiSCi2s7B1o4Grlo12MYnybo-xZ8UJUU4CVzRZE3cImrjREi843HStLz9SaCJ6tgh9pZyvwRmnX1_1Hvie9Ihzh2_caPdB33iw--ejCsIB59XKRiwFMPIc03pxrNq3yeebIBJEP6hGKIwr1WfKcwFyObiVJ9YrKtpjhev-DL6MZ1ZDzKn71SgiyHPx1OE_KsN2QJLAXf_bN39nNdJk-exoMLqJyg6KNOiXA'

function ProjectSecondaryCard() {
  return (
    <article className="group overflow-hidden rounded-xl bg-base-200 transition-all duration-300 hover:bg-base-300">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 w-full md:h-auto md:w-1/3">
          <img src={imageUrl} alt="DataSphere CRM" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary/10 transition-colors group-hover:bg-transparent" />
        </div>

        <div className="grow p-6">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-3xl font-bold tracking-tight text-(--on-surface)">DataSphere CRM</h3>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-content">
              LEGACY
            </span>
          </div>

          <p className="mb-4 text-xs text-(--on-surface-variant)">Aug 2022 - Dec 2023</p>

          <p className="mb-6 text-sm italic text-(--on-surface-variant)">
            A customer relationship management tool built specifically for small-scale freelance
            collectives...
          </p>

          <div className="flex gap-4 text-xs text-(--on-surface-variant)">
            <span>Stars 124</span>
            <span>Forks 12</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProjectSecondaryCard
