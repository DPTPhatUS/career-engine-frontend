type CompletionStatus = 'graduated' | 'ongoing'

type EducationFormValues = {
  university: string
  degree: string
  field: string
  startMonth: string
  endMonth: string
  completionStatus: CompletionStatus
  gpa: string
  location: string
  coursework: string
}

export type { CompletionStatus, EducationFormValues }
