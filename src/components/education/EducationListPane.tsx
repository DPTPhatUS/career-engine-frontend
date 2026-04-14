import EducationCard, { type EducationItem } from './EducationCard'

const educations: EducationItem[] = [
  {
    school: 'Stanford University',
    degree: 'Master of Science in Computer Science',
    period: '2021 - 2023',
    location: 'Palo Alto, CA',
    gpa: '3.92 / 4.0',
    field: 'Artificial Intelligence',
    coursework: [
      'Machine Learning',
      'Natural Language Processing',
      'Distributed Systems',
      'Computer Vision',
    ],
  },
  {
    school: 'University of Michigan',
    degree: 'Bachelor of Science in Engineering',
    period: '2017 - 2021',
    location: 'Ann Arbor, MI',
    gpa: '3.85 / 4.0',
    field: 'Software Engineering',
  },
]

function EducationListPane() {
  return (
    <section className="space-y-6 lg:col-span-7">
      {educations.map((item) => (
        <EducationCard key={item.school} item={item} />
      ))}

      <div className="flex flex-col items-center justify-center rounded-xl bg-base-200/70 p-8 text-center opacity-80">
        <p className="text-sm font-medium text-(--on-surface-variant)">
          Adding more credentials strengthens your profile
        </p>
      </div>
    </section>
  )
}

export default EducationListPane
