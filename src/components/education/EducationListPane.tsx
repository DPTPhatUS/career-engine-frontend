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
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDza-vTYqOmXbDcyDTDEAIZCWxFQO5NzV38A16X3vE8IbS0Xwf07_gSxK1n8H7ImVrEfIfGzMtGxCQogQpm3QRcFQgVbwi9b5EPuf7JvZJTAPzrH7-fKObmB2tiZpdYQsCIaZXg47jUw2jx79QazwMcWXp69Q9aRVpF_kaOUvQv7H9yk06oSQJrkqrkiIXVtXbSOZf453SsDaeT8Nv3YzrnWJArNdwY3DuIS3MEXDo0nQJOYzvTJWocIq8ccUt3QVDbT-6P2GInfg',
  },
  {
    school: 'University of Michigan',
    degree: 'Bachelor of Science in Engineering',
    period: '2017 - 2021',
    location: 'Ann Arbor, MI',
    gpa: '3.85 / 4.0',
    field: 'Software Engineering',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVPZUuvkDe_8-nauZ25iBNsfxv9RLwwBlrW9Is2qzvGsHsRNopEGCkxDgqi19tN_jLE90q00Z4R0Xtl4PxCfjF9rVpmj7XIe4sI3l1hpe9-SuLkH36jHnwJE0yvwMBIv09gYcfi7uzNhaYFzw2IrvquFL1ThrxpakNh3ebc474zIa07qmQDU_BnfgwIh7f9-vI138SEBhnEglTr5To70IUarQgiy3POHTadKKEbgGPJhventUdAcppBZnm2OOswxdjnTGbpE9eqQ',
  },
]

function EducationListPane() {
  return (
    <section className="space-y-6 lg:col-span-7">
      {educations.map((item) => (
        <EducationCard key={item.school} item={item} />
      ))}

      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-(--outline-variant) p-8 text-center opacity-70">
        <p className="text-sm font-medium text-(--on-surface-variant)">
          Adding more credentials strengthens your profile
        </p>
      </div>
    </section>
  )
}

export default EducationListPane
