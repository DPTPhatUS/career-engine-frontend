type ExperienceItem = {
  role: string
  period: string
  company: string
  location: string
  bullets: string[]
}

const experienceItems: ExperienceItem[] = [
  {
    role: 'Lead Frontend Engineer',
    period: '2020 - Present',
    company: 'TechNova Systems',
    location: 'Remote',
    bullets: [
      'Architected a design system used by 12 internal product teams, reducing development time by 40%.',
      'Implemented performance optimizations that increased mobile conversion rates by 22%.',
      'Mentored a team of 6 junior developers through code reviews and technical workshops.',
    ],
  },
  {
    role: 'Software Developer',
    period: '2017 - 2020',
    company: 'CloudScale Solutions',
    location: 'Austin, TX',
    bullets: [
      'Developed microservices architecture using Node.js and AWS Lambda for high-traffic API.',
      'Managed migration from monolithic legacy system to React-based single page application.',
    ],
  },
]

const skills = [
  'React / Next.js',
  'Node.js',
  'TypeScript',
  'Tailwind CSS',
  'PostgreSQL',
  'AWS (S3, Lambda, EC2)',
  'GraphQL',
  'Docker',
]

function ResumePaperPreview() {
  return (
    <article className="relative flex w-full max-w-[816px] flex-col space-y-8 rounded-sm bg-white p-[10%] shadow-[0_20px_50px_rgba(0,74,198,0.08)] aspect-[1/1.414]">
      <header className="space-y-4 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Alexander Sterling</h2>

        <p className="text-lg font-bold uppercase tracking-wide text-blue-600">
          Senior Full-Stack Engineer and Product Strategist
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
          <span>alex.sterling@dev.io</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>+1 (555) 234-8901</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>San Francisco, CA</span>
        </div>
      </header>

      <div className="h-px w-full bg-slate-100" />

      <section className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Professional Summary
        </h3>

        <p className="text-sm leading-relaxed text-slate-600">
          Results-driven Software Engineer with over 8 years of experience building scalable web
          applications. Expert in React, Node.js, and Cloud Infrastructure. Passionate about
          precision functionalism in UI/UX and creating seamless user experiences that drive
          engagement and business growth.
        </p>
      </section>

      <section className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Professional Experience
        </h3>

        {experienceItems.map((item) => (
          <div key={item.role} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="font-bold text-slate-800">{item.role}</h4>
              <span className="text-xs font-medium text-slate-500">{item.period}</span>
            </div>

            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-blue-600">{item.company}</span>
              <span className="text-xs text-slate-400">{item.location}</span>
            </div>

            <ul className="ml-2 list-inside list-disc space-y-1 text-sm text-slate-600">
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Technical Expertise
        </h3>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <div className="absolute right-4 top-4">
        <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
      </div>
    </article>
  )
}

export default ResumePaperPreview
