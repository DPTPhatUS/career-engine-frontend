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
      'Reinforcement Learning',
      'Deep Learning',
      'AI Ethics',
      'Data Mining',
    ],
  },
  {
    school: 'University of Michigan',
    degree: 'Bachelor of Science in Engineering',
    period: '2017 - 2021',
    location: 'Ann Arbor, MI',
    gpa: '3.85 / 4.0',
    field: 'Software Engineering',
    coursework: [
      'Data Structures and Algorithms',
      'Operating Systems',
      'Database Systems',
      'Software Design and Architecture',
      'Computer Networks',
      'Web Development',
      'Mobile App Development',
      'Cloud Computing',
    ],
  },
  {
    school: 'Massachusetts Institute of Technology',
    degree: 'Ph.D. in Computer Science',
    period: '2023 - Present',
    location: 'Cambridge, MA',
    gpa: '4.0 / 4.0',
    field: 'Human-Computer Interaction',
    coursework: [
      'User-Centered Design',
      'Usability Testing',
      'Interaction Design',
      'Cognitive Psychology for HCI',
      'HCI Research Methods',
      'Augmented Reality',
      'Virtual Reality',
      'HCI and Accessibility',
    ],
  },
  {
    school: 'University of California, Berkeley',
    degree: 'Master of Science in Data Science',
    period: '2020 - 2022',
    location: 'Berkeley, CA',
    gpa: '3.88 / 4.0',
    field: 'Data Science',
    coursework: [
      'Statistical Inference',
      'Data Visualization',
      'Big Data Analytics',
      'Machine Learning for Data Science',
      'Data Ethics and Privacy',
      'Time Series Analysis',
      'Natural Language Processing for Data Science',
      'Data Science Capstone Project',
    ],
  }
]

function EducationListPane() {
  return (
    <div className="space-y-8 lg:col-span-7">
      {educations.map((item) => (
        <EducationCard key={item.school} item={item} />
      ))}
    </div>
  )
}

export default EducationListPane
