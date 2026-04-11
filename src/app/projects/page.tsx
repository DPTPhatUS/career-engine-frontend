"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
  CardDescription,
  CardHeader,
  CardTitle,
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
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-8 md:py-14">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage project entries for your resume drafts.</p>
        </div>
        <Button onClick={addDraft}>
          <Plus className="size-4" />
          Add Project
        </Button>
      </div>

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
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No project entries yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={item.id ?? `draft-${index}`}>
              <CardHeader>
                <CardTitle>Project #{index + 1}</CardTitle>
                <CardDescription>Use concise bullets and impact-oriented language.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Title</Label>
                    <Input value={item.title} onChange={(event) => patchItem(index, { title: event.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Date Range</Label>
                    <Input
                      value={item.date_range}
                      onChange={(event) => patchItem(index, { date_range: event.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>GitHub URL (optional)</Label>
                    <Input
                      placeholder="https://github.com/org/repo"
                      value={item.github_url}
                      onChange={(event) => patchItem(index, { github_url: event.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Tech Stack (optional)</Label>
                    <Input
                      value={item.tech_stack}
                      onChange={(event) => patchItem(index, { tech_stack: event.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Bullets (one per line)</Label>
                  <Textarea
                    rows={5}
                    value={item.bullets_text}
                    onChange={(event) => patchItem(index, { bullets_text: event.target.value })}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={() => saveItem(index)} disabled={item.saving || item.deleting}>
                    {item.saving ? <Loader2 className="size-4 animate-spin" /> : null}
                    {item.id ? "Update" : "Save"}
                  </Button>
                  <Button
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
        </div>
      )}
    </main>
  );
}
