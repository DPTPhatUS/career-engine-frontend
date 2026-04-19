import ProjectCard from './ProjectCard'

const portfolioEntries = [
  {
    title: 'Quantum Logic Engine',
    period: 'Jan 2024 - Apr 2024',
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
    title: 'Long Project Name That Might Overflow in the UI and Needs to Be Tested for Responsiveness',
    period: 'Jul 2023 - Dec 2023',
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
    <section className="space-y-8 lg:col-span-7">
      {portfolioEntries.map((entry) => (
        <ProjectCard key={entry.title} {...entry} />
      ))}
    </section>
  )
}

export default ProjectsListPane
