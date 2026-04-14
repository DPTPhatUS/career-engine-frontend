import {
  FileText,
  FolderKanban,
  GraduationCap,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

type StatCard = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  progress?: number
}

const statCards: StatCard[] = [
  {
    label: 'Profile Strength',
    value: '88%',
    detail: '',
    icon: UserRound,
    progress: 88,
  },
  {
    label: 'Education Credits',
    value: '124',
    detail: '+4 since last month',
    icon: GraduationCap,
  },
  {
    label: 'Active Projects',
    value: '06',
    detail: '2 nearing completion',
    icon: FolderKanban,
  },
  {
    label: 'Resume Views',
    value: '342',
    detail: 'Top 5% in your field',
    icon: FileText,
  },
]

function HomeStatsGrid() {
  return (
    <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
      {statCards.map((card) => (
        <article key={card.label} className="rounded-xl bg-base-100 p-6 shadow-(--ambient-shadow) transition-all hover:scale-[1.02]">
          <div className="mb-4 flex items-center justify-between">
            <p className="blueprint-label text-primary">{card.label}</p>
            <span className="grid h-6 w-6 place-content-center rounded bg-base-200 text-xs font-bold text-primary">
              <card.icon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>

          <p className="text-3xl font-black text-(--on-surface)">{card.value}</p>

          {card.progress ? (
            <progress className="progress progress-primary mt-2 w-full" max={100} value={card.progress} />
          ) : (
            <p className="mt-2 text-xs text-(--on-surface-variant)">{card.detail}</p>
          )}
        </article>
      ))}
    </section>
  )
}

export default HomeStatsGrid
