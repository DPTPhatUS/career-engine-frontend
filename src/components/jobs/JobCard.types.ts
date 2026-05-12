import type { JobStage } from '../../api/jobs'

type JobItem = {
  id: string
  companyId: string
  companyName: string
  companyUrl?: string
  title: string
  jobDescription: string
  jobRequirements: string
  stage: JobStage
  deadline: string | null
}

export type { JobItem }
