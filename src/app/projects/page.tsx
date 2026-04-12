"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Code2,
  FilePlus2,
  FolderGit2,
  Hammer,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
  type ProjectRecord,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ProjectDraft = {
  id: string | null;
  title: string;
  date_range: string;
  github_url: string;
  tech_stack: string;
  bullets_text: string;
  saving: boolean;
  deleting: boolean;
};

function toDraft(item: ProjectRecord): ProjectDraft {
  return {
    id: item.id,
    title: item.title,
    date_range: item.date_range,
    github_url: item.github_url ?? "",
    tech_stack: item.tech_stack ?? "",
    bullets_text: item.bullets.join("\n"),
    saving: false,
    deleting: false,
  };
}

function emptyDraft(): ProjectDraft {
  return {
    id: null,
    title: "",
    date_range: "",
    github_url: "",
    tech_stack: "",
    bullets_text: "",
    saving: false,
    deleting: false,
  };
}

function bulletsFromText(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function techTags(value: string) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [items, setItems] = useState<ProjectDraft[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setErrorMessage("");
      try {
        const data = await listProjects();
        if (!active) return;
        setItems(data.map(toDraft));
      } catch (error) {
        if (!active) return;
        setErrorMessage(error instanceof Error ? error.message : "Failed to load projects.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  function patchItem(index: number, patch: Partial<ProjectDraft>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function addDraft() {
    setItems((prev) => [...prev, emptyDraft()]);
  }

  async function saveItem(index: number) {
    const item = items[index];
    if (!item) return;

    if (!item.title.trim() || !item.date_range.trim()) {
      toast.error("Title and date range are required.");
      return;
    }

    patchItem(index, { saving: true });

    try {
      if (!item.id) {
        const created = await createProject({
          title: item.title.trim(),
          date_range: item.date_range.trim(),
          github_url: item.github_url.trim() || undefined,
          tech_stack: item.tech_stack.trim() || undefined,
          bullets: bulletsFromText(item.bullets_text),
        });
        patchItem(index, { ...toDraft(created), saving: false });
        toast.success("Project added.");
      } else {
        const updated = await updateProject(item.id, {
          title: item.title.trim(),
          date_range: item.date_range.trim(),
          github_url: item.github_url.trim() || undefined,
          tech_stack: item.tech_stack.trim() || undefined,
          bullets: bulletsFromText(item.bullets_text),
        });
        patchItem(index, { ...toDraft(updated), saving: false });
        toast.success("Project updated.");
      }
    } catch (error) {
      patchItem(index, { saving: false });
      toast.error(error instanceof Error ? error.message : "Failed to save project.");
    }
  }

  async function removeItem(index: number) {
    const item = items[index];
    if (!item) return;

    if (!item.id) {
      setItems((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    patchItem(index, { deleting: true });

    try {
      await deleteProject(item.id);
      setItems((prev) => prev.filter((_, i) => i !== index));
      toast.success("Project removed.");
    } catch (error) {
      patchItem(index, { deleting: false });
      toast.error(error instanceof Error ? error.message : "Failed to remove project.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 md:px-8 md:py-12 lg:py-14">
      <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Portfolio Curation
          </p>
          <h1 className="font-heading text-4xl leading-tight text-primary md:text-5xl">
            Technical Projects
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Showcase your strongest technical work with clear impact bullets and repository context tailored for resume generation.
          </p>
        </div>
        <Button
          onClick={addDraft}
          size="lg"
          className="ce-primary-gradient rounded-lg text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
        >
          <Plus className="size-4" />
          New Entry
        </Button>
      </header>

      <section className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-xl border-border/70 bg-card/95 shadow-sm">
          <CardContent className="flex h-full flex-col justify-between p-5">
            <Code2 className="size-8 text-primary" />
            <div className="mt-6">
              <div className="font-heading text-3xl text-primary">{items.length}</div>
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Project Entries
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="ce-primary-gradient rounded-xl text-primary-foreground shadow-sm">
          <CardContent className="flex h-full flex-col justify-between p-5">
            <FolderGit2 className="size-8 text-primary-foreground/90" />
            <div className="mt-6">
              <div className="font-heading text-3xl">{items.filter((item) => item.github_url.trim()).length}</div>
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-primary-foreground/75">
                Linked Repositories
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/95 shadow-sm">
          <CardContent className="flex h-full flex-col justify-between p-5">
            <Hammer className="size-8 text-primary" />
            <div className="mt-6">
              <div className="font-heading text-3xl text-primary">
                {items.reduce((sum, item) => sum + techTags(item.tech_stack).length, 0)}
              </div>
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Tech Tags Captured
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {errorMessage ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <Card className="ce-card rounded-xl border-2 border-dashed border-border/80 bg-card/70">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
              <FilePlus2 className="size-6" />
            </span>
            <div>
              <h3 className="font-heading text-2xl text-primary">No projects yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first project entry to start curating your technical portfolio.
              </p>
            </div>
            <Button
              onClick={addDraft}
              className="ce-primary-gradient rounded-lg text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
            >
              <Plus className="size-4" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="space-y-5">
          {items.map((item, index) => (
            <Card key={item.id ?? `draft-${index}`} className="ce-card rounded-xl">
              <CardContent className="space-y-6 p-5 md:p-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="grid flex-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2 md:col-span-2">
                      <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Project Title
                      </Label>
                      <Input
                        value={item.title}
                        onChange={(event) => patchItem(index, { title: event.target.value })}
                        className="h-10 border-border/80 bg-card"
                        placeholder="e.g. Autonomous Supply Intelligence"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Date Range
                      </Label>
                      <Input
                        value={item.date_range}
                        onChange={(event) => patchItem(index, { date_range: event.target.value })}
                        className="h-10 border-border/80 bg-card"
                        placeholder="e.g. Jan 2024 - Present"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        GitHub URL (optional)
                      </Label>
                      <Input
                        placeholder="https://github.com/org/repo"
                        value={item.github_url}
                        onChange={(event) => patchItem(index, { github_url: event.target.value })}
                        className="h-10 border-border/80 bg-card"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => saveItem(index)}
                      disabled={item.saving || item.deleting}
                      className="transition-transform hover:scale-105"
                      aria-label={`Edit ${item.title || `project ${index + 1}`}`}
                    >
                      {item.saving ? <Loader2 className="size-4 animate-spin" /> : <Pencil className="size-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => removeItem(index)}
                      disabled={item.saving || item.deleting}
                      className="transition-transform hover:scale-105"
                      aria-label={`Delete ${item.title || `project ${index + 1}`}`}
                    >
                      {item.deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Tech Stack (optional)
                    </Label>
                    <Input
                      value={item.tech_stack}
                      onChange={(event) => patchItem(index, { tech_stack: event.target.value })}
                      className="h-10 border-border/80 bg-card"
                      placeholder="React, Next.js, Tailwind"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Repository Link Preview
                    </Label>
                    <div className="flex h-10 items-center rounded-lg border border-border/80 bg-card px-3 text-xs text-muted-foreground">
                      {item.github_url.trim() ? (
                        <a
                          href={item.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          {item.github_url}
                          <ArrowUpRight className="size-3.5" />
                        </a>
                      ) : (
                        <span>No repository linked</span>
                      )}
                    </div>
                  </div>
                </div>

                {techTags(item.tech_stack).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {techTags(item.tech_stack).map((tag) => (
                      <span
                        key={`${item.id ?? index}-${tag}`}
                        className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-secondary-foreground uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="grid gap-2">
                  <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Impact Bullets (one per line)
                  </Label>
                  <Textarea
                    rows={5}
                    value={item.bullets_text}
                    onChange={(event) => patchItem(index, { bullets_text: event.target.value })}
                    className="border-border/80 bg-card"
                  />
                </div>

                {bulletsFromText(item.bullets_text).length > 0 ? (
                  <div className="space-y-2 rounded-xl border border-border/70 bg-background/70 p-4">
                    {bulletsFromText(item.bullets_text).map((bullet, bulletIndex) => (
                      <div key={`${item.id ?? index}-bullet-${bulletIndex}`} className="flex gap-3">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        <p className="text-sm leading-relaxed text-muted-foreground">{bullet}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={() => saveItem(index)}
                    disabled={item.saving || item.deleting}
                    className="ce-primary-gradient rounded-lg text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
                  >
                    {item.saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    {item.id ? "Save Changes" : "Save Entry"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeItem(index)}
                    disabled={item.saving || item.deleting}
                  >
                    {item.deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}
