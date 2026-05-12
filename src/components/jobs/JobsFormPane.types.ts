import type { JobStage } from '../../api/jobs'

type JobsFormValues = {
  companyId: string
  title: string
  jobDescription: string
  jobRequirements: string
  stage: JobStage
  deadline: string
}

type InlineCompanyFormValues = {
  name: string
  companyUrl: string
  overview: string
}

type CompanyOption = {
  id: string
  name: string
}

export type { CompanyOption, InlineCompanyFormValues, JobsFormValues }
