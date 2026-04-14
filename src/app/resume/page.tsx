"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Download,
  Eraser,
  Loader2,
  Plus,
  Printer,
  Save,
  Sparkles,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";
import {
  ApiError,
  createResume,
  generateDoc,
  getProfile,
  listEducations,
  listProjects,
  updateResume,
  type ResumeDraft,
} from "@/lib/api";
import {
  defaultResumeDraft,
  RESUME_DRAFT_STORAGE_KEY,
  RESUME_ID_STORAGE_KEY,
} from "@/lib/resume-defaults";
import { useAuth } from "@/components/app-shell";
import { Button, Card, Input, Tabs, TextArea } from "@heroui/react";
import { ResumePreview } from "./resume-preview";

const optionalUrl = z.union([z.literal(""), z.string().url("Enter a valid URL")]);

const resumeFormSchema = z.object({
  title: z.string().trim().min(1, "Resume title is required."),
  payload: z.object({
    personal_info: z.object({
      full_name: z.string().trim().min(1, "Full name is required."),
      email: z.string().trim().email("Enter a valid email address."),
      phone: z.string().trim().min(1, "Phone is required."),
      address: z.string().trim().min(1, "Address is required."),
      github_label: z.string().trim().min(1, "GitHub label is required."),
      github_url: optionalUrl,
    }),
    education: z.array(
      z.object({
        university: z.string().trim().min(1, "University is required."),
        degree: z.string().trim().min(1, "Degree is required."),
        field: z.string().trim().min(1, "Field is required."),
        time_period: z.string().trim().min(1, "Time period is required."),
        gpa: z.string().trim().optional(),
        location: z.string().trim().optional(),
        relevant_coursework: z.string().trim().optional(),
      })
    ),
    projects: z.array(
      z.object({
        title: z.string().trim().min(1, "Project title is required."),
        date_range: z.string().trim().min(1, "Date range is required."),
        github_url: optionalUrl,
        tech_stack: z.string().trim().optional(),
        bullets_text: z.string().trim(),
      })
    ),
    skills: z.array(
      z.object({
        label: z.string().trim().min(1, "Skill label is required."),
        values: z.string().trim().min(1, "Skill values are required."),
      })
    ),
  }),
});

type ResumeFormValues = z.infer<typeof resumeFormSchema>;

const defaultFormValues: ResumeFormValues = {
  title: defaultResumeDraft.title,
  payload: {
    personal_info: {
      full_name: defaultResumeDraft.payload.personal_info.full_name,
      email: defaultResumeDraft.payload.personal_info.email,
      phone: defaultResumeDraft.payload.personal_info.phone,
      address: defaultResumeDraft.payload.personal_info.address,
      github_label: defaultResumeDraft.payload.personal_info.github_label ?? "GitHub",
      github_url: defaultResumeDraft.payload.personal_info.github_url ?? "",
    },
    education: [],
    projects: [],
    skills: [],
  },
};

const emptyEducation = {
  university: "",
  degree: "",
  field: "",
  time_period: "",
  gpa: "",
  location: "",
  relevant_coursework: "",
};

const emptyProject = {
  title: "",
  date_range: "",
  github_url: "",
  tech_stack: "",
  bullets_text: "",
};

const emptySkill = {
  label: "",
  values: "",
};

const editorCardClassName = "rounded-2xl border border-border/60 bg-card/95";
const inputClassName = "rounded-xl";
const labelClassName =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

function toResumeDraft(values: ResumeFormValues): ResumeDraft {
  return {
    title: values.title.trim(),
    payload: {
      personal_info: {
        full_name: values.payload.personal_info.full_name.trim(),
        email: values.payload.personal_info.email.trim(),
        phone: values.payload.personal_info.phone.trim(),
        address: values.payload.personal_info.address.trim(),
        github_label: values.payload.personal_info.github_label.trim() || "GitHub",
        github_url: values.payload.personal_info.github_url.trim() || undefined,
      },
      education: values.payload.education.map((item) => ({
        university: item.university.trim(),
        degree: item.degree.trim(),
        field: item.field.trim(),
        time_period: item.time_period.trim(),
        gpa: item.gpa?.trim() || undefined,
        location: item.location?.trim() || undefined,
        relevant_coursework: item.relevant_coursework?.trim() || undefined,
      })),
      projects: values.payload.projects.map((item) => ({
        title: item.title.trim(),
        date_range: item.date_range.trim(),
        github_url: item.github_url.trim() || undefined,
        tech_stack: item.tech_stack?.trim() || undefined,
        bullets: item.bullets_text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      })),
      skills: values.payload.skills.map((item) => ({
        label: item.label.trim(),
        values: item.values.trim(),
      })),
    },
  };
}

export default function ResumePage() {
  const router = useRouter();
  const { me, profile } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInsertingInfo, setIsInsertingInfo] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
  });

  const education = useFieldArray({
    control: form.control,
    name: "payload.education",
  });

  const projects = useFieldArray({
    control: form.control,
    name: "payload.projects",
  });

  const skills = useFieldArray({
    control: form.control,
    name: "payload.skills",
  });

  useEffect(() => {
    const draftRaw = window.localStorage.getItem(RESUME_DRAFT_STORAGE_KEY);
    if (draftRaw) {
      try {
        const parsed = JSON.parse(draftRaw) as ResumeFormValues;
        const validated = resumeFormSchema.safeParse(parsed);
        if (validated.success) {
          form.reset(validated.data);
        }
      } catch {
        // Ignore malformed local draft data and keep defaults.
      }
    }

    const storedResumeId = window.localStorage.getItem(RESUME_ID_STORAGE_KEY);
    if (storedResumeId) setResumeId(storedResumeId);
  }, [form]);

  useEffect(() => {
    let timer: number | undefined;

    const subscription = form.watch((value) => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        window.localStorage.setItem(RESUME_DRAFT_STORAGE_KEY, JSON.stringify(value));
      }, 300);
    });

    return () => {
      if (timer) window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [form]);

  const hasValidationErrors = useMemo(
    () => Object.keys(form.formState.errors).length > 0,
    [form.formState.errors]
  );

  useWatch({ control: form.control });
  const previewDraft = toResumeDraft(form.getValues());

  async function onGenerate(values: ResumeFormValues) {
    setIsGenerating(true);
    try {
      const draft = toResumeDraft(values);
      let currentResumeId = resumeId;

      if (!currentResumeId) {
        const created = await createResume(draft);
        currentResumeId = created.id;
        setResumeId(created.id);
        window.localStorage.setItem(RESUME_ID_STORAGE_KEY, created.id);
      } else {
        await updateResume(currentResumeId, draft);
      }

      const generated = await generateDoc(currentResumeId, draft.title);
      toast.success("Resume generated. Opening Google Doc...");
      window.open(generated.document_url, "_blank", "noopener,noreferrer");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.replace("/login");
        return;
      }
      toast.error(error instanceof Error ? error.message : "Failed to generate resume.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleInsertMyInfo() {
    setIsInsertingInfo(true);

    try {
      const current = form.getValues();
      const [freshProfile, educations, projectItems] = await Promise.all([
        getProfile().catch((error) => {
          if (error instanceof ApiError && error.status === 404) return null;
          throw error;
        }),
        listEducations(),
        listProjects(),
      ]);

      const fallbackProfile = profile ?? null;
      const profileToUse = freshProfile ?? fallbackProfile;

      let insertedPersonal = false;
      let insertedEducation = false;
      let insertedProjects = false;

      const nextPersonal = { ...current.payload.personal_info };
      if (profileToUse) {
        if (!nextPersonal.full_name.trim() && profileToUse.full_name?.trim()) {
          nextPersonal.full_name = profileToUse.full_name;
          insertedPersonal = true;
        }
        if (!nextPersonal.email.trim() && profileToUse.email?.trim()) {
          nextPersonal.email = profileToUse.email;
          insertedPersonal = true;
        }
        if (!nextPersonal.phone.trim() && profileToUse.phone?.trim()) {
          nextPersonal.phone = profileToUse.phone;
          insertedPersonal = true;
        }
        if (!nextPersonal.address.trim() && profileToUse.address?.trim()) {
          nextPersonal.address = profileToUse.address;
          insertedPersonal = true;
        }
        if (!nextPersonal.github_label.trim() && profileToUse.github_label?.trim()) {
          nextPersonal.github_label = profileToUse.github_label;
          insertedPersonal = true;
        }
        if (!nextPersonal.github_url.trim() && profileToUse.github_url?.trim()) {
          nextPersonal.github_url = profileToUse.github_url;
          insertedPersonal = true;
        }
      }

      if (current.payload.education.length === 0 && educations.length > 0) {
        insertedEducation = true;
      }

      if (current.payload.projects.length === 0 && projectItems.length > 0) {
        insertedProjects = true;
      }

      form.reset({
        ...current,
        payload: {
          ...current.payload,
          personal_info: nextPersonal,
          education:
            current.payload.education.length === 0
              ? educations.map((item) => ({
                  university: item.university,
                  degree: item.degree,
                  field: item.field,
                  time_period: item.time_period,
                  gpa: item.gpa ?? "",
                  location: item.location ?? "",
                  relevant_coursework: item.relevant_coursework ?? "",
                }))
              : current.payload.education,
          projects:
            current.payload.projects.length === 0
              ? projectItems.map((item) => ({
                  title: item.title,
                  date_range: item.date_range,
                  github_url: item.github_url ?? "",
                  tech_stack: item.tech_stack ?? "",
                  bullets_text: item.bullets.join("\n"),
                }))
              : current.payload.projects,
        },
      });

      if (!insertedPersonal && !insertedEducation && !insertedProjects) {
        toast.info("No empty section was available for import.");
        return;
      }

      const insertedParts = [
        insertedPersonal ? "personal info" : "",
        insertedEducation ? "education" : "",
        insertedProjects ? "projects" : "",
      ].filter(Boolean);

      toast.success(`Inserted ${insertedParts.join(", ")} into the draft.`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.replace("/login");
        return;
      }
      toast.error(error instanceof Error ? error.message : "Failed to insert data.");
    } finally {
      setIsInsertingInfo(false);
    }
  }

  function handleClearDraft() {
    setIsClearing(true);
    form.reset(defaultFormValues);
    setResumeId(null);
    window.localStorage.removeItem(RESUME_DRAFT_STORAGE_KEY);
    window.localStorage.removeItem(RESUME_ID_STORAGE_KEY);
    toast.success("Draft cleared.");
    setIsClearing(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 px-6 py-10 md:px-8 md:py-12 lg:py-14">
      <div className="flex min-h-[calc(100vh-10.5rem)] w-full overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-xl shadow-primary/5">
        <section className="w-full overflow-y-auto bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_82%,white_18%)_0%,color-mix(in_oklab,var(--muted)_54%,white_46%)_100%)] lg:w-1/2">
          <div className="sticky top-0 z-20 border-b border-border/45 bg-background/82 px-5 py-5 backdrop-blur-md md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="font-heading text-3xl text-primary">Resume Editor</h1>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                  {form.getValues("title") || "Untitled Resume"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onPress={handleInsertMyInfo}
                  isDisabled={isInsertingInfo}
                  className="rounded-lg"
                >
                  {isInsertingInfo ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Sync Data
                </Button>

                <Button
                  type="button"
                  variant="tertiary"
                  onPress={handleClearDraft}
                  isDisabled={isClearing}
                  className="rounded-lg"
                >
                  {isClearing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Eraser className="size-4" />
                  )}
                  Clear
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  isDisabled={isGenerating}
                  onPress={() => {
                    void form.handleSubmit(onGenerate)();
                  }}
                  className="rounded-lg"
                >
                  {isGenerating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  Export Doc
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-5 py-5 md:px-8 md:py-7">
            <Card className={editorCardClassName}>
              <Card.Content className="p-5">
                <div className="grid gap-2">
                  <label htmlFor="resume-title" className={labelClassName}>
                    Resume Title
                  </label>
                  <Input id="resume-title" className={inputClassName} {...form.register("title")} />
                  {form.formState.errors.title ? (
                    <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                  ) : null}
                </div>
              </Card.Content>
            </Card>

            <Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(String(key))}
              variant="secondary"
              className="rounded-2xl bg-card/45 p-2 md:p-3"
            >
              <Tabs.ListContainer className="mb-5 border-b border-border/50 px-2 pt-1">
                <Tabs.List aria-label="Resume sections" className="bg-transparent">
                  <Tabs.Tab id="personal" className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                    Personal Info
                  </Tabs.Tab>
                  <Tabs.Tab id="education" className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                    Education
                  </Tabs.Tab>
                  <Tabs.Tab id="projects" className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                    Projects
                  </Tabs.Tab>
                  <Tabs.Tab id="skills" className="text-[11px] font-semibold tracking-[0.12em] uppercase">
                    Skills
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>

              <Tabs.Panel id="personal" className="space-y-4 px-2 pb-2 md:px-3">
                <Card className={editorCardClassName}>
                  <Card.Content className="space-y-4 p-5">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <h2 className="font-heading text-2xl text-primary">Personal Details</h2>
                      <span className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Contact Header
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <label htmlFor="full_name" className={labelClassName}>
                          Full Name
                        </label>
                        <Input id="full_name" className={inputClassName} {...form.register("payload.personal_info.full_name")} />
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor="email" className={labelClassName}>
                          Email Address
                        </label>
                        <Input id="email" type="email" className={inputClassName} {...form.register("payload.personal_info.email")} />
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor="phone" className={labelClassName}>
                          Phone Number
                        </label>
                        <Input id="phone" className={inputClassName} {...form.register("payload.personal_info.phone")} />
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor="address" className={labelClassName}>
                          Address
                        </label>
                        <Input id="address" className={inputClassName} {...form.register("payload.personal_info.address")} />
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor="github_label" className={labelClassName}>
                          GitHub Label
                        </label>
                        <Input id="github_label" className={inputClassName} {...form.register("payload.personal_info.github_label")} />
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor="github_url" className={labelClassName}>
                          GitHub URL
                        </label>
                        <Input
                          id="github_url"
                          className={inputClassName}
                          placeholder="https://github.com/username"
                          {...form.register("payload.personal_info.github_url")}
                        />
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </Tabs.Panel>

              <Tabs.Panel id="education" className="space-y-4 px-2 pb-2 md:px-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl text-primary">Education</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onPress={() => education.append({ ...emptyEducation })}
                  >
                    <Plus className="size-4" />
                    Add Education
                  </Button>
                </div>

                {education.fields.length === 0 ? (
                  <Card className="rounded-xl border border-dashed border-border/70 bg-card/60">
                    <Card.Content className="px-4 py-5 text-sm text-muted-foreground">
                      No education entries yet.
                    </Card.Content>
                  </Card>
                ) : null}

                {education.fields.map((field, index) => (
                  <Card key={field.id} className={editorCardClassName}>
                    <Card.Content className="space-y-4 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-xl text-primary">Education #{index + 1}</h3>
                        <Button
                          type="button"
                          variant="danger-soft"
                          size="sm"
                          isIconOnly
                          onPress={() => education.remove(index)}
                          aria-label={`Remove education ${index + 1}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <label className={labelClassName}>University</label>
                          <Input className={inputClassName} {...form.register(`payload.education.${index}.university`)} />
                        </div>

                        <div className="grid gap-2">
                          <label className={labelClassName}>Degree</label>
                          <Input className={inputClassName} {...form.register(`payload.education.${index}.degree`)} />
                        </div>

                        <div className="grid gap-2">
                          <label className={labelClassName}>Field</label>
                          <Input className={inputClassName} {...form.register(`payload.education.${index}.field`)} />
                        </div>

                        <div className="grid gap-2">
                          <label className={labelClassName}>Time Period</label>
                          <Input className={inputClassName} {...form.register(`payload.education.${index}.time_period`)} />
                        </div>

                        <div className="grid gap-2">
                          <label className={labelClassName}>GPA (optional)</label>
                          <Input className={inputClassName} {...form.register(`payload.education.${index}.gpa`)} />
                        </div>

                        <div className="grid gap-2">
                          <label className={labelClassName}>Location (optional)</label>
                          <Input className={inputClassName} {...form.register(`payload.education.${index}.location`)} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                          <label className={labelClassName}>Relevant Coursework (optional)</label>
                          <TextArea rows={3} className={inputClassName} {...form.register(`payload.education.${index}.relevant_coursework`)} />
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                ))}
              </Tabs.Panel>

              <Tabs.Panel id="projects" className="space-y-4 px-2 pb-2 md:px-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl text-primary">Projects</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onPress={() => projects.append({ ...emptyProject })}
                  >
                    <Plus className="size-4" />
                    Add Project
                  </Button>
                </div>

                {projects.fields.length === 0 ? (
                  <Card className="rounded-xl border border-dashed border-border/70 bg-card/60">
                    <Card.Content className="px-4 py-5 text-sm text-muted-foreground">
                      No project entries yet.
                    </Card.Content>
                  </Card>
                ) : null}

                {projects.fields.map((field, index) => (
                  <Card key={field.id} className={editorCardClassName}>
                    <Card.Content className="space-y-4 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-xl text-primary">Project #{index + 1}</h3>
                        <Button
                          type="button"
                          variant="danger-soft"
                          size="sm"
                          isIconOnly
                          onPress={() => projects.remove(index)}
                          aria-label={`Remove project ${index + 1}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <label className={labelClassName}>Title</label>
                          <Input className={inputClassName} {...form.register(`payload.projects.${index}.title`)} />
                        </div>

                        <div className="grid gap-2">
                          <label className={labelClassName}>Date Range</label>
                          <Input className={inputClassName} {...form.register(`payload.projects.${index}.date_range`)} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                          <label className={labelClassName}>GitHub URL (optional)</label>
                          <Input
                            className={inputClassName}
                            placeholder="https://github.com/org/repo"
                            {...form.register(`payload.projects.${index}.github_url`)}
                          />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                          <label className={labelClassName}>Tech Stack (optional)</label>
                          <Input className={inputClassName} {...form.register(`payload.projects.${index}.tech_stack`)} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                          <label className={labelClassName}>Bullets (one line per bullet)</label>
                          <TextArea rows={5} className={inputClassName} {...form.register(`payload.projects.${index}.bullets_text`)} />
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                ))}
              </Tabs.Panel>

              <Tabs.Panel id="skills" className="space-y-4 px-2 pb-2 md:px-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl text-primary">Skills</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onPress={() => skills.append({ ...emptySkill })}
                  >
                    <Plus className="size-4" />
                    Add Skill Group
                  </Button>
                </div>

                {skills.fields.length === 0 ? (
                  <Card className="rounded-xl border border-dashed border-border/70 bg-card/60">
                    <Card.Content className="px-4 py-5 text-sm text-muted-foreground">
                      No skills added yet.
                    </Card.Content>
                  </Card>
                ) : null}

                {skills.fields.map((field, index) => (
                  <Card key={field.id} className={editorCardClassName}>
                    <Card.Content className="space-y-4 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-xl text-primary">Skill Group #{index + 1}</h3>
                        <Button
                          type="button"
                          variant="danger-soft"
                          size="sm"
                          isIconOnly
                          onPress={() => skills.remove(index)}
                          aria-label={`Remove skill group ${index + 1}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <label className={labelClassName}>Label</label>
                          <Input
                            className={inputClassName}
                            placeholder="Languages"
                            {...form.register(`payload.skills.${index}.label`)}
                          />
                        </div>

                        <div className="grid gap-2">
                          <label className={labelClassName}>Values</label>
                          <Input
                            className={inputClassName}
                            placeholder="Python, TypeScript, SQL"
                            {...form.register(`payload.skills.${index}.values`)}
                          />
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                ))}
              </Tabs.Panel>
            </Tabs>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/55 pt-4">
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Save className="size-3.5" />
                Draft autosaves in your browser. Signed in as {profile?.full_name || me?.email || "your account"}.
              </div>

              <Button
                type="button"
                variant="primary"
                isDisabled={isGenerating}
                onPress={() => {
                  void form.handleSubmit(onGenerate)();
                }}
                className="rounded-lg"
              >
                {isGenerating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                Export Doc
              </Button>
            </div>

            {hasValidationErrors ? (
              <p className="text-xs text-destructive">
                Please review fields in each tab and fix validation issues before exporting.
              </p>
            ) : null}
          </div>
        </section>

        <section className="hidden w-1/2 flex-col overflow-y-auto bg-[linear-gradient(165deg,color-mix(in_oklab,var(--muted)_62%,white_38%)_0%,color-mix(in_oklab,var(--secondary)_76%,white_24%)_100%)] p-6 lg:flex">
          <Card className="mb-5 w-fit rounded-full border border-border/65 bg-background/74 backdrop-blur">
            <Card.Content className="flex items-center gap-1 p-1.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                isIconOnly
                aria-label="Zoom in"
                className="rounded-full"
              >
                <ZoomIn className="size-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                isIconOnly
                aria-label="Zoom out"
                className="rounded-full"
              >
                <ZoomOut className="size-4" />
              </Button>

              <span className="mx-1 h-5 w-px bg-border" />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                isIconOnly
                aria-label="Print preview"
                className="rounded-full"
              >
                <Printer className="size-4" />
              </Button>
            </Card.Content>
          </Card>

          <ResumePreview draft={previewDraft} />

          <p className="mt-6 text-center text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Rendering in Real-Time Engine v4.2
          </p>
        </section>
      </div>
    </main>
  );
}
