import { FilePenLine, FolderPlus, type LucideIcon } from 'lucide-react'

type ActivityItem = {
  title: string
  description: string
  timestamp: string
  icon: LucideIcon
}

const activityItems: ActivityItem[] = [
  {
    title: 'Updated Resume',
    description: "Applied 'Modern Minimalist' template to Main CV",
    timestamp: '2H AGO',
    icon: FilePenLine,
  },
  {
    title: 'New Project Added',
    description: "Added 'Social Media API' to showcase skills",
    timestamp: 'YESTERDAY',
    icon: FolderPlus,
  },
]

function HomeRecentActivity() {
  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-(--on-surface)">Recent Activity</h2>
        <button type="button" className="btn btn-ghost btn-sm normal-case text-primary hover:bg-base-200">
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {activityItems.map((item) => (
          <article
            key={item.title}
            className="flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-colors hover:bg-base-200"
          >
            <div className="grid h-12 w-12 place-content-center rounded-lg bg-base-300 text-sm font-bold text-primary">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="grow">
              <h3 className="font-bold text-(--on-surface)">{item.title}</h3>
              <p className="text-sm text-(--on-surface-variant)">{item.description}</p>
            </div>

            <span className="text-xs font-semibold uppercase tracking-widest text-(--on-surface-variant)">
              {item.timestamp}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HomeRecentActivity
