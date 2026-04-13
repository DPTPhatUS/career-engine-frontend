"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Code2,
  FilePlus2,
  FolderGit2,
  Hammer,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Button, Card, Chip, Input, Spinner, TextArea } from "@heroui/react";
import { toast } from "sonner";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
  type ProjectRecord,
} from "@/lib/api";

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

  const linkedRepositories = items.filter((item) => item.github_url.trim()).length;
  const impactBulletsCount = items.reduce((sum, item) => sum + bulletsFromText(item.bullets_text).length, 0);
  const fieldClassName = "ce-ghost-border rounded-xl bg-card";
  const labelClassName =
    "mb-2 ml-0.5 block text-[10px] font-semibold uppercase tracking-[0.17em] text-muted-foreground";

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 md:px-8 md:py-12 lg:py-14">
      <header className="mb-11 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Portfolio Curation
          </p>
          <h1 className="font-heading text-5xl leading-none text-primary md:text-6xl">
            Technical Projects
          </h1>
        </div>
        <Button
          onPress={addDraft}
          className="ce-primary-gradient rounded-xl px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-primary-foreground uppercase"
        >
          <Plus className="size-4" />
          New Entry
        </Button>
      </header>

      <section className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="rounded-2xl border-0 bg-secondary/50">
          <Card.Content className="flex h-full flex-col justify-between p-6">
            <Code2 className="size-7 text-primary" />
            <div className="mt-6">
              <div className="font-heading text-3xl text-primary">{items.length}</div>
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Project Entries
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="ce-primary-gradient rounded-2xl text-primary-foreground">
          <Card.Content className="flex h-full flex-col justify-between p-6">
            <FolderGit2 className="size-7 text-primary-foreground/90" />
            <div className="mt-6">
              <div className="font-heading text-3xl">{linkedRepositories}</div>
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-primary-foreground/75">
                Linked Repositories
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="rounded-2xl border-0 bg-secondary/50">
          <Card.Content className="flex h-full flex-col justify-between p-6">
            <Hammer className="size-7 text-primary" />
            <div className="mt-6">
              <div className="font-heading text-3xl text-primary">{impactBulletsCount}</div>
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Impact Bullets
              </p>
            </div>
          </Card.Content>
        </Card>
      </section>

      {errorMessage ? (
        <Card className="mb-6 border border-destructive/35 bg-destructive/10">
          <Card.Content className="p-4 text-sm text-destructive">{errorMessage}</Card.Content>
        </Card>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner aria-label="Loading projects" color="accent" />
        </div>
      ) : items.length === 0 ? (
        <Card className="rounded-2xl border-2 border-dashed border-border/75 bg-card/65">
          <Card.Content className="flex flex-col items-center gap-4 py-14 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
              <FilePlus2 className="size-6" />
            </span>
            <div>
              <h3 className="font-heading text-3xl text-primary">No projects yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first project entry to start curating your technical portfolio.
              </p>
            </div>
            <Button
              onPress={addDraft}
              className="ce-primary-gradient rounded-xl px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-primary-foreground uppercase"
            >
              <Plus className="size-4" />
              Add Project
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <section className="space-y-6">
          {items.map((item, index) => {
            const tags = techTags(item.tech_stack);
            const bullets = bulletsFromText(item.bullets_text);
            const projectName = item.title.trim() || `project ${index + 1}`;

            return (
              <Card key={item.id ?? `draft-${index}`} className="ce-card overflow-hidden rounded-2xl">
                <Card.Content className="space-y-6 p-6 md:p-8">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="grid flex-1 gap-4">
                      <div>
                        <p className={labelClassName}>Project Title</p>
                        <Input
                          aria-label={`Project ${index + 1} title`}
                          value={item.title}
                          onChange={(event) => patchItem(index, { title: event.target.value })}
                          className={`${fieldClassName} text-lg font-heading text-primary`}
                          placeholder="e.g. Quantum-Safe Neural Gateway"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-[13rem_minmax(0,1fr)]">
                        <div>
                          <p className={labelClassName}>Date Range</p>
                          <Input
                            aria-label={`Project ${index + 1} date range`}
                            value={item.date_range}
                            onChange={(event) => patchItem(index, { date_range: event.target.value })}
                            className={fieldClassName}
                            placeholder="Jan 2024 - Present"
                          />
                        </div>

                        <div>
                          <p className={labelClassName}>GitHub URL (optional)</p>
                          <Input
                            aria-label={`Project ${index + 1} GitHub URL`}
                            value={item.github_url}
                            onChange={(event) => patchItem(index, { github_url: event.target.value })}
                            className={fieldClassName}
                            placeholder="https://github.com/org/repo"
                          />
                        </div>
                      </div>

                      <div className="min-h-4">
                        {item.github_url.trim() ? (
                          <a
                            href={item.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                          >
                            {item.github_url.replace(/^https?:\/\//, "")}
                            <ArrowUpRight className="size-3.5" />
                          </a>
                        ) : (
                          <p className="text-xs italic text-muted-foreground/80">No repository linked yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:pt-5">
                      <Button
                        isIconOnly
                        variant="ghost"
                        onPress={() => saveItem(index)}
                        isDisabled={item.saving || item.deleting}
                        aria-label={`Quick save ${projectName}`}
                        className="rounded-full text-muted-foreground hover:text-primary"
                      >
                        {item.saving ? <Spinner aria-label="Saving project" size="sm" color="current" /> : <Pencil className="size-4" />}
                      </Button>

                      <Button
                        isIconOnly
                        variant="danger-soft"
                        onPress={() => removeItem(index)}
                        isDisabled={item.saving || item.deleting}
                        aria-label={`Delete ${projectName}`}
                        className="rounded-full"
                      >
                        {item.deleting ? <Spinner aria-label="Removing project" size="sm" color="danger" /> : <Trash2 className="size-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_17rem]">
                    <div>
                      <p className={labelClassName}>Tech Stack (comma separated)</p>
                      <Input
                        aria-label={`Project ${index + 1} tech stack`}
                        value={item.tech_stack}
                        onChange={(event) => patchItem(index, { tech_stack: event.target.value })}
                        className={fieldClassName}
                        placeholder="Rust, WebAssembly, TensorFlow"
                      />
                    </div>

                    <div className="rounded-xl bg-secondary/45 p-4">
                      <p className="text-[10px] font-semibold tracking-[0.17em] text-muted-foreground uppercase">
                        Stack Signals
                      </p>
                      <p className="mt-1 font-heading text-2xl text-primary">
                        {tags.length.toString().padStart(2, "0")}
                      </p>
                    </div>
                  </div>

                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Chip
                          key={`${item.id ?? index}-${tag}`}
                          size="sm"
                          variant="soft"
                          color="accent"
                          className="rounded-md text-[10px] font-semibold tracking-[0.13em] uppercase"
                        >
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  ) : null}

                  <div>
                    <p className={labelClassName}>Impact Bullets (one per line)</p>
                    <TextArea
                      aria-label={`Project ${index + 1} impact bullets`}
                      rows={5}
                      value={item.bullets_text}
                      onChange={(event) => patchItem(index, { bullets_text: event.target.value })}
                      className={fieldClassName}
                      placeholder="Led migration of distributed services..."
                    />
                  </div>

                  {bullets.length > 0 ? (
                    <div className="space-y-3 rounded-xl bg-secondary/35 p-4 ce-ghost-border">
                      {bullets.map((bullet, bulletIndex) => (
                        <div key={`${item.id ?? index}-bullet-${bulletIndex}`} className="flex gap-3">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                          <p className="text-sm leading-relaxed text-muted-foreground">{bullet}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/55 pt-4">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      {item.id ? "Saved entry" : "Unsaved draft"}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="danger-soft"
                        onPress={() => removeItem(index)}
                        isDisabled={item.saving || item.deleting}
                      >
                        {item.deleting ? (
                          <Spinner aria-label="Deleting project" size="sm" color="danger" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                        Remove
                      </Button>

                      <Button
                        onPress={() => saveItem(index)}
                        isDisabled={item.saving || item.deleting}
                        className="ce-primary-gradient rounded-xl px-5 text-[11px] font-semibold tracking-[0.14em] text-primary-foreground uppercase"
                      >
                        {item.saving ? <Spinner aria-label="Saving project" size="sm" color="current" /> : <Save className="size-4" />}
                        {item.id ? "Save Changes" : "Save Entry"}
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </section>
      )}

      <section className="mt-8">
        <Card className="rounded-2xl border-2 border-dashed border-border/70 bg-card/65">
          <Card.Content className="flex flex-col items-center justify-center gap-4 p-10 text-center md:p-12">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
              <FolderGit2 className="size-5" />
            </span>
            <div>
              <h3 className="font-heading text-3xl text-primary">Import from GitHub</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Sync your public repositories to automatically populate project entries with metadata.
              </p>
            </div>
            <Button variant="ghost" className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
              Connect Account
            </Button>
          </Card.Content>
        </Card>
      </section>
    </main>
  );
}
