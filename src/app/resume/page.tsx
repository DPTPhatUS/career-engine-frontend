"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eraser, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8 md:px-8 md:py-10">
      <header className="rounded-2xl border bg-card/95 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-heading text-3xl font-semibold tracking-tight">Resume Builder</p>
            <p className="text-sm text-muted-foreground">
              Signed in as {profile?.full_name || me?.email || "your account"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleInsertMyInfo}
              disabled={isInsertingInfo}
            >
              {isInsertingInfo ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Insert my info
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClearDraft}
              disabled={isClearing}
            >
              {isClearing ? <Loader2 className="size-4 animate-spin" /> : <Eraser className="size-4" />}
              Clear draft
            </Button>
            <Button size="lg" disabled={isGenerating} onClick={form.handleSubmit(onGenerate)}>
              {isGenerating ? <Loader2 className="size-4 animate-spin" /> : null}
              Generate Resume
            </Button>
          </div>
        </div>
      </header>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Resume Details</CardTitle>
          <CardDescription>
            Build from scratch, or import your saved data into empty sections.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6 grid gap-2">
            <Label htmlFor="resume-title">Resume Title</Label>
            <Input id="resume-title" {...form.register("title")} />
            {form.formState.errors.title ? (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            ) : null}
          </div>

          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input id="full_name" {...form.register("payload.personal_info.full_name")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register("payload.personal_info.email")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...form.register("payload.personal_info.phone")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...form.register("payload.personal_info.address")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github_label">GitHub label</Label>
                  <Input id="github_label" {...form.register("payload.personal_info.github_label")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input id="github_url" placeholder="https://github.com/username" {...form.register("payload.personal_info.github_url")} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-4 space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => education.append({ ...emptyEducation })}
              >
                <Plus className="size-4" />
                Add Education
              </Button>

              {education.fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">No education entries yet.</p>
              ) : null}

              {education.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader>
                    <CardTitle>Education #{index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
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
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => education.remove(index)}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="projects" className="mt-4 space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => projects.append({ ...emptyProject })}
              >
                <Plus className="size-4" />
                Add Project
              </Button>

              {projects.fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">No project entries yet.</p>
              ) : null}

              {projects.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader>
                    <CardTitle>Project #{index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
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
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => projects.remove(index)}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="skills" className="mt-4 space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => skills.append({ ...emptySkill })}
              >
                <Plus className="size-4" />
                Add Skill Group
              </Button>

              {skills.fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">No skills added yet.</p>
              ) : null}

              {skills.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader>
                    <CardTitle>Skill Group #{index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
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
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => skills.remove(index)}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>

        <Separator />

        <CardFooter className="justify-between gap-3">
          <p className="text-xs text-muted-foreground">Draft is autosaved in your browser.</p>
          <Button size="lg" disabled={isGenerating} onClick={form.handleSubmit(onGenerate)}>
            {isGenerating ? <Loader2 className="size-4 animate-spin" /> : null}
            Generate Resume
          </Button>
        </CardFooter>
      </Card>

      {hasValidationErrors ? (
        <p className="text-xs text-destructive">
          Please review fields in each tab and fix validation issues before generating.
        </p>
      ) : null}
    </main>
  );
}
