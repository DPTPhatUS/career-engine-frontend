import ProjectPrimaryCard from './ProjectPrimaryCard'

const portfolioEntries = [
  {
    title: 'Quantum Logic Engine',
    period: 'Jan 2024 - Present',
    tags: ['Rust', 'WebAssembly', 'PostgreSQL'],
    bullets: [
      'Architected a high-performance computation engine reducing latency by 45% using Rust/WASM hooks.',
      'Implemented a custom DSL for logical branching that supports over 10k concurrent evaluations.',
    ],
    repositoryLabel: 'View Repository',
    contributorCount: 4,
  },
  {
    title: 'DataSphere CRM',
    period: 'Aug 2022 - Dec 2023',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    bullets: [
      'Built a multi-tenant CRM platform for freelance collectives with role-based access controls.',
      'Improved lead conversion visibility through custom reporting dashboards and event tracking.',
    ],
    repositoryLabel: 'View Repository',
    contributorCount: 3,
  },
  {
    title: 'Terminal.ui Theme',
    period: 'Jul 2023 - Open Source',
    tags: ['TypeScript', 'Design System', 'Open Source'],
    bullets: [
      'Designed a terminal-inspired UI theme package adopted by community contributors.',
      'Shipped reusable components with accessibility-first tokens and keyboard interaction support.',
    ],
    repositoryLabel: 'View Repository',
    contributorCount: 2,
  },
]

function ProjectsListPane() {
  return (
    <section className="space-y-6">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-(--on-surface)">
          Active Portfolio <span className="ml-2 text-base font-normal text-(--on-surface-variant)">(3)</span>
        </h2>

        <button type="button" className="btn btn-ghost btn-sm border-0 gap-1 font-medium normal-case text-primary hover:bg-base-200">
          Sort by Date
        </button>
      </div>

      {portfolioEntries.map((entry) => (
        <ProjectPrimaryCard key={entry.title} {...entry} />
      ))}
    </section>
  )
}

export default ProjectsListPane
