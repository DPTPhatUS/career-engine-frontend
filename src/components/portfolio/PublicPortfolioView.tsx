import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import type { PublicPortfolioRecord } from '../../api/portfolioPublications'

type PublicPortfolioViewProps = {
  portfolio: PublicPortfolioRecord
}

function PublicPortfolioView({ portfolio }: PublicPortfolioViewProps) {
  const personalInfo = portfolio.snapshot.personal_info ?? {}
  const education = portfolio.snapshot.education ?? []
  const projects = portfolio.snapshot.projects ?? []
  const skills = portfolio.snapshot.skills ?? []

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8">
      <header className="space-y-3 border-b border-base-300 pb-6">
        <h1 className="text-3xl font-bold">{personalInfo.full_name ?? portfolio.title}</h1>
        <p className="text-lg opacity-80">{portfolio.title}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          {personalInfo.email ? <span className="inline-flex items-center gap-1"><Mail className="size-4" />{personalInfo.email}</span> : null}
          {personalInfo.phone ? <span className="inline-flex items-center gap-1"><Phone className="size-4" />{personalInfo.phone}</span> : null}
          {personalInfo.address ? <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{personalInfo.address}</span> : null}
          {personalInfo.github_url ? (
            <a href={personalInfo.github_url} className="link link-primary inline-flex items-center gap-1" target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              {personalInfo.github_label ?? 'GitHub'}
            </a>
          ) : null}
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <article key={`${project.title ?? 'project'}-${index}`} className="rounded-md border border-base-300 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-medium">{project.title ?? 'Untitled Project'}</h3>
                {project.date_range ? <span className="text-sm opacity-70">{project.date_range}</span> : null}
              </div>
              {project.tech_stack ? <p className="mb-2 text-sm"><span className="font-medium">Tech:</span> {project.tech_stack}</p> : null}
              {project.github_url ? <a href={project.github_url} target="_blank" rel="noreferrer" className="link link-primary mb-2 inline-block text-sm">Repository</a> : null}
              {project.bullets && project.bullets.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {project.bullets.map((bullet, bulletIndex) => (
                    <li key={`${project.title ?? index}-${bulletIndex}`}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Education</h2>
        <div className="space-y-3">
          {education.map((item, index) => (
            <article key={`${item.university ?? 'education'}-${index}`} className="rounded-md border border-base-300 p-4">
              <h3 className="font-medium">{item.university ?? 'University'}</h3>
              <p className="text-sm">{[item.degree, item.field].filter(Boolean).join(', ')}</p>
              {item.time_period ? <p className="text-sm opacity-70">{item.time_period}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <p key={`${skill.label ?? 'skill'}-${index}`} className="text-sm">
              <span className="font-medium">{skill.label ?? 'Skills'}:</span> {skill.values ?? ''}
            </p>
          ))}
        </div>
      </section>
    </div>
  )
}

export default PublicPortfolioView
