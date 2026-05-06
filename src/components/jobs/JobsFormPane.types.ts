type JobsFormValues = {
  companyId: string
  title: string
  jobDescription: string
  jobRequirements: string
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
