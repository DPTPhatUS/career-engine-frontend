import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import type { PublicPortfolioRecord } from '../../api/portfolio'
import EducationCard from '../education/EducationCard'
import type { EducationItem } from '../education/EducationCard.types'
import ProjectCard from '../projects/ProjectCard'
import type { ProjectItem } from '../projects/ProjectCard.types'

type PublicPortfolioViewProps = {
  portfolio: PublicPortfolioRecord
}

const cardListClassName = 'w-full space-y-8'

function parseCoursework(value: string | null | undefined) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseTechStack(value: string | null | undefined) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function PublicPortfolioView({ portfolio }: PublicPortfolioViewProps) {
  const personalInfo = portfolio.snapshot.personal_info ?? {}
  const education = portfolio.snapshot.education ?? []
  const projects = portfolio.snapshot.projects ?? []
  const skills = portfolio.snapshot.skills ?? []

  const educationItems: EducationItem[] = education.map((item, index) => ({
    id: `education-${index}`,
    university: item.university ?? 'University',
    degree: item.degree ?? '',
    field: item.field ?? '',
    timePeriod: item.time_period ?? '',
    location: item.location ?? undefined,
    gpa: item.gpa ?? undefined,
    coursework: parseCoursework(item.relevant_coursework),
  }))

  const projectItems: ProjectItem[] = projects.map((project, index) => ({
    id: `project-${index}`,
    title: project.title ?? 'Untitled Project',
    dateRange: project.date_range ?? '',
    tags: parseTechStack(project.tech_stack),
    bullets: project.bullets ?? [],
    githubUrl: project.github_url ?? undefined,
  }))

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
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
        <h2 className="text-xl font-semibold">Education</h2>
        <div className={cardListClassName}>
          {educationItems.map((item) => (
            <EducationCard key={item.id} item={item} showActions={false} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <div className={cardListClassName}>
          {projectItems.map((item) => (
            <ProjectCard key={item.id} item={item} showActions={false} />
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
