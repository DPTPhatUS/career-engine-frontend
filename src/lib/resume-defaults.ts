import type { ResumeDraft } from "@/lib/api";

export const RESUME_DRAFT_STORAGE_KEY = "ce_resume_draft_v1";
export const RESUME_ID_STORAGE_KEY = "ce_resume_id_v1";

export const defaultResumeDraft: ResumeDraft = {
  title: "Software Engineer Resume",
  payload: {
    personal_info: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      github_label: "GitHub",
      github_url: "",
    },
    education: [],
    projects: [],
    skills: [],
  },
};
