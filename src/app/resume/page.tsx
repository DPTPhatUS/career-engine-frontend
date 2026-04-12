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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    <main className="mx-auto flex w-full max-w-375 flex-1 px-4 py-5 md:px-8 md:py-8">
      <div className="flex min-h-[calc(100vh-10.5rem)] w-full overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-xl shadow-primary/5">
        <section className="w-full overflow-y-auto bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_84%,white_16%)_0%,color-mix(in_oklab,var(--muted)_58%,white_42%)_100%)] lg:w-1/2">
          <div className="sticky top-0 z-20 border-b border-border/50 bg-background/84 px-5 py-5 backdrop-blur-md md:px-8">
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
                  variant="outline"
                  onClick={handleInsertMyInfo}
                  disabled={isInsertingInfo}
                  className="rounded-lg border-border/70 bg-background/90"
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
                  variant="secondary"
                  onClick={handleClearDraft}
                  disabled={isClearing}
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
                  size="lg"
                  disabled={isGenerating}
                  onClick={form.handleSubmit(onGenerate)}
                  className="rounded-lg bg-linear-to-br from-primary via-primary to-primary/70 text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
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

          <Tabs defaultValue="personal" className="flex flex-col">
            <div className="border-b border-border/50 px-5 md:px-8">
              <TabsList className="h-auto rounded-none bg-transparent p-0">
                <TabsTrigger value="personal" className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary">Personal Info</TabsTrigger>
                <TabsTrigger value="education" className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary">Education</TabsTrigger>
                <TabsTrigger value="projects" className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary">Projects</TabsTrigger>
                <TabsTrigger value="skills" className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary">Skills</TabsTrigger>
              </TabsList>
            </div>

            <div className="space-y-6 p-5 md:p-8">
              <div className="rounded-xl border border-border/60 bg-background/90 p-4 shadow-sm">
                <div className="grid gap-2">
                  <Label htmlFor="resume-title" className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Resume Title</Label>
                  <Input id="resume-title" className="h-10 border-border/70 bg-card" {...form.register("title")} />
                  {form.formState.errors.title ? (
                    <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                  ) : null}
                </div>
              </div>

              <TabsContent value="personal" className="mt-0 rounded-xl border border-border/60 bg-background/88 p-4 shadow-sm md:p-5">
                <div className="mb-4">
                  <h2 className="font-heading text-2xl text-primary">Personal Details</h2>
                  <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">Contact information shown on your resume</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="full_name" className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">Full Name</Label>
                    <Input id="full_name" className="h-10 border-border/70 bg-card" {...form.register("payload.personal_info.full_name")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">Email Address</Label>
                    <Input id="email" type="email" className="h-10 border-border/70 bg-card" {...form.register("payload.personal_info.email")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">Phone Number</Label>
                    <Input id="phone" className="h-10 border-border/70 bg-card" {...form.register("payload.personal_info.phone")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address" className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">Address</Label>
                    <Input id="address" className="h-10 border-border/70 bg-card" {...form.register("payload.personal_info.address")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="github_label" className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">GitHub Label</Label>
                    <Input id="github_label" className="h-10 border-border/70 bg-card" {...form.register("payload.personal_info.github_label")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="github_url" className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">GitHub URL</Label>
                    <Input id="github_url" className="h-10 border-border/70 bg-card" placeholder="https://github.com/username" {...form.register("payload.personal_info.github_url")} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="education" className="mt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl text-primary">Education</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => education.append({ ...emptyEducation })}
                    className="rounded-lg border-border/70 bg-background/85"
                  >
                    <Plus className="size-4" />
                    Add Education
                  </Button>
                </div>

                {education.fields.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border/70 bg-background/80 px-4 py-5 text-sm text-muted-foreground">
                    No education entries yet.
                  </p>
                ) : null}

                {education.fields.map((field, index) => (
                  <Card key={field.id} className="rounded-xl border-border/65 bg-background/92 shadow-sm">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-xl text-primary">Education #{index + 1}</h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => education.remove(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>University</Label>
                          <Input {...form.register(`payload.education.${index}.university`)} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Degree</Label>
                          <Input {...form.register(`payload.education.${index}.degree`)} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Field</Label>
                          <Input {...form.register(`payload.education.${index}.field`)} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Time Period</Label>
                          <Input {...form.register(`payload.education.${index}.time_period`)} />
                        </div>
                        <div className="grid gap-2">
                          <Label>GPA (optional)</Label>
                          <Input {...form.register(`payload.education.${index}.gpa`)} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Location (optional)</Label>
                          <Input {...form.register(`payload.education.${index}.location`)} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                          <Label>Relevant Coursework (optional)</Label>
                          <Textarea rows={3} {...form.register(`payload.education.${index}.relevant_coursework`)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="projects" className="mt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl text-primary">Projects</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => projects.append({ ...emptyProject })}
                    className="rounded-lg border-border/70 bg-background/85"
                  >
                    <Plus className="size-4" />
                    Add Project
                  </Button>
                </div>

                {projects.fields.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border/70 bg-background/80 px-4 py-5 text-sm text-muted-foreground">
                    No project entries yet.
                  </p>
                ) : null}

                {projects.fields.map((field, index) => (
                  <Card key={field.id} className="rounded-xl border-border/65 bg-background/92 shadow-sm">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-xl text-primary">Project #{index + 1}</h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => projects.remove(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Title</Label>
                          <Input {...form.register(`payload.projects.${index}.title`)} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Date Range</Label>
                          <Input {...form.register(`payload.projects.${index}.date_range`)} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                          <Label>GitHub URL (optional)</Label>
                          <Input placeholder="https://github.com/org/repo" {...form.register(`payload.projects.${index}.github_url`)} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                          <Label>Tech Stack (optional)</Label>
                          <Input {...form.register(`payload.projects.${index}.tech_stack`)} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                          <Label>Bullets (one line per bullet)</Label>
                          <Textarea rows={5} {...form.register(`payload.projects.${index}.bullets_text`)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="skills" className="mt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl text-primary">Skills</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => skills.append({ ...emptySkill })}
                    className="rounded-lg border-border/70 bg-background/85"
                  >
                    <Plus className="size-4" />
                    Add Skill Group
                  </Button>
                </div>

                {skills.fields.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border/70 bg-background/80 px-4 py-5 text-sm text-muted-foreground">
                    No skills added yet.
                  </p>
                ) : null}

                {skills.fields.map((field, index) => (
                  <Card key={field.id} className="rounded-xl border-border/65 bg-background/92 shadow-sm">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-xl text-primary">Skill Group #{index + 1}</h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => skills.remove(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>Label</Label>
                          <Input placeholder="Languages" {...form.register(`payload.skills.${index}.label`)} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Values</Label>
                          <Input
                            placeholder="Python, TypeScript, SQL"
                            {...form.register(`payload.skills.${index}.values`)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Save className="size-3.5" />
                  Draft autosaves in your browser. Signed in as {profile?.full_name || me?.email || "your account"}.
                </div>
                <Button
                  size="lg"
                  disabled={isGenerating}
                  onClick={form.handleSubmit(onGenerate)}
                  className="rounded-lg bg-linear-to-br from-primary via-primary to-primary/70 text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
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
          </Tabs>
        </section>

        <section className="hidden w-1/2 flex-col overflow-y-auto bg-[linear-gradient(165deg,color-mix(in_oklab,var(--muted)_62%,white_38%)_0%,color-mix(in_oklab,var(--secondary)_75%,white_25%)_100%)] p-6 lg:flex">
          <div className="sticky top-0 z-10 mb-5 flex w-fit items-center gap-2 rounded-full border border-border/65 bg-background/70 px-3 py-1.5 backdrop-blur">
            <button type="button" className="inline-flex size-8 items-center justify-center rounded-full bg-card text-primary shadow-sm transition-transform hover:scale-105" aria-label="Zoom in">
              <ZoomIn className="size-4" />
            </button>
            <button type="button" className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary" aria-label="Zoom out">
              <ZoomOut className="size-4" />
            </button>
            <span className="mx-1 h-5 w-px bg-border" />
            <button type="button" className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary" aria-label="Print preview">
              <Printer className="size-4" />
            </button>
          </div>

          <ResumePreview draft={previewDraft} />
          <p className="mt-6 text-center text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Rendering in Real-Time Engine v4.2
          </p>
        </section>
      </div>
    </main>
  );
}
