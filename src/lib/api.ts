export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestBody = BodyInit | Record<string, unknown> | undefined;

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: RequestBody;
};

async function request<T>(path: string, init: RequestOptions = {}): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  const bodyInput = init.body as RequestBody;

  let body: BodyInit | undefined;
  if (
    bodyInput &&
    typeof bodyInput === "object" &&
    !(bodyInput instanceof FormData) &&
    !(bodyInput instanceof URLSearchParams) &&
    !(bodyInput instanceof Blob) &&
    !(bodyInput instanceof ArrayBuffer)
  ) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(bodyInput);
  } else {
    body = bodyInput as BodyInit | undefined;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers,
    body,
  });

  if (!res.ok) {
    let detail = "Request failed";
    try {
      const parsed = (await res.json()) as { detail?: string };
      if (parsed?.detail) detail = parsed.detail;
    } catch {
      detail = res.statusText || detail;
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export type MeResponse = {
  user_id: string;
  email: string;
};

export type ProfilePayload = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  github_label?: string;
  github_url?: string;
};

export type ProfileRecord = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  github_label: string;
  github_url?: string;
  created_at: string;
  updated_at: string;
};

export type EducationPayload = {
  university: string;
  degree: string;
  field: string;
  time_period: string;
  gpa?: string;
  location?: string;
  relevant_coursework?: string;
  sort_order?: number;
};

export type EducationRecord = {
  id: string;
  user_id: string;
  sort_order: number;
  university: string;
  degree: string;
  field: string;
  time_period: string;
  gpa?: string;
  location?: string;
  relevant_coursework?: string;
  created_at: string;
  updated_at: string;
};

export type ProjectPayload = {
  title: string;
  date_range: string;
  github_url?: string;
  tech_stack?: string;
  bullets?: string[];
  sort_order?: number;
};

export type ProjectRecord = {
  id: string;
  user_id: string;
  sort_order: number;
  title: string;
  date_range: string;
  github_url?: string;
  tech_stack?: string;
  bullets: string[];
  created_at: string;
  updated_at: string;
};

export type ResumePayload = {
  personal_info: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    github_label?: string;
    github_url?: string;
  };
  education: Array<{
    university: string;
    degree: string;
    field: string;
    time_period: string;
    gpa?: string;
    location?: string;
    relevant_coursework?: string;
  }>;
  projects: Array<{
    title: string;
    date_range: string;
    github_url?: string;
    tech_stack?: string;
    bullets: string[];
  }>;
  skills: Array<{
    label: string;
    values: string;
  }>;
};

export type ResumeDraft = {
  title: string;
  payload: ResumePayload;
};

export type ResumeRecord = {
  id: string;
  user_id: string;
  title: string;
  payload: ResumePayload;
  created_at: string;
  updated_at: string;
};

export async function startGoogleLogin(nextPath = "/resume") {
  return request<{ authorization_url: string; state: string }>(
    `/api/v1/auth/google/login/start?next=${encodeURIComponent(nextPath)}`,
    { method: "GET" }
  );
}

export async function getMe() {
  return request<MeResponse>("/api/v1/auth/me", { method: "GET" });
}

export async function getProfile() {
  return request<ProfileRecord>("/api/v1/profile", { method: "GET" });
}

export async function putProfile(body: ProfilePayload) {
  return request<ProfileRecord>("/api/v1/profile", {
    method: "PUT",
    body,
  });
}

export async function listEducations() {
  return request<EducationRecord[]>("/api/v1/educations", { method: "GET" });
}

export async function createEducation(body: EducationPayload) {
  return request<EducationRecord>("/api/v1/educations", {
    method: "POST",
    body,
  });
}

export async function updateEducation(
  educationId: string,
  patch: Partial<EducationPayload>
) {
  return request<EducationRecord>(`/api/v1/educations/${educationId}`, {
    method: "PATCH",
    body: patch,
  });
}

export async function deleteEducation(educationId: string) {
  return request<void>(`/api/v1/educations/${educationId}`, {
    method: "DELETE",
  });
}

export async function listProjects() {
  return request<ProjectRecord[]>("/api/v1/projects", { method: "GET" });
}

export async function createProject(body: ProjectPayload) {
  return request<ProjectRecord>("/api/v1/projects", {
    method: "POST",
    body,
  });
}

export async function updateProject(
  projectId: string,
  patch: Partial<ProjectPayload>
) {
  return request<ProjectRecord>(`/api/v1/projects/${projectId}`, {
    method: "PATCH",
    body: patch,
  });
}

export async function deleteProject(projectId: string) {
  return request<void>(`/api/v1/projects/${projectId}`, {
    method: "DELETE",
  });
}

export async function logout() {
  return request<{ success: boolean }>("/api/v1/auth/logout", { method: "POST" });
}

export async function createResume(body: ResumeDraft) {
  return request<ResumeRecord>("/api/v1/resumes", {
    method: "POST",
    body,
  });
}

export async function updateResume(
  resumeId: string,
  patch: Partial<ResumeDraft>
) {
  return request<ResumeRecord>(`/api/v1/resumes/${resumeId}`, {
    method: "PATCH",
    body: patch,
  });
}

export async function generateDoc(resumeId: string, documentTitle?: string) {
  return request<{ document_id: string; document_url: string }>(
    `/api/v1/resumes/${resumeId}/generate-doc`,
    {
      method: "POST",
      body: documentTitle ? { document_title: documentTitle } : {},
    }
  );
}
