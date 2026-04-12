"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  ApiError,
  createEducation,
  deleteEducation,
  listEducations,
  updateEducation,
  type EducationRecord,
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

type EducationDraft = {
  id: string | null;
  university: string;
  degree: string;
  field: string;
  time_period: string;
  gpa: string;
  location: string;
  relevant_coursework: string;
  saving: boolean;
  deleting: boolean;
};

function toDraft(item: EducationRecord): EducationDraft {
  return {
    id: item.id,
    university: item.university,
    degree: item.degree,
    field: item.field,
    time_period: item.time_period,
    gpa: item.gpa ?? "",
    location: item.location ?? "",
    relevant_coursework: item.relevant_coursework ?? "",
    saving: false,
    deleting: false,
  };
}

function emptyDraft(): EducationDraft {
  return {
    id: null,
    university: "",
    degree: "",
    field: "",
    time_period: "",
    gpa: "",
    location: "",
    relevant_coursework: "",
    saving: false,
    deleting: false,
  };
}

export default function EducationsPage() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [items, setItems] = useState<EducationDraft[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setErrorMessage("");
      try {
        const data = await listEducations();
        if (!active) return;
        setItems(data.map(toDraft));
      } catch (error) {
        if (!active) return;
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load educations."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  function patchItem(index: number, patch: Partial<EducationDraft>) {
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

    if (!item.university.trim() || !item.degree.trim() || !item.field.trim() || !item.time_period.trim()) {
      toast.error("University, degree, field, and time period are required.");
      return;
    }

    patchItem(index, { saving: true });

    try {
      if (!item.id) {
        const created = await createEducation({
          university: item.university.trim(),
          degree: item.degree.trim(),
          field: item.field.trim(),
          time_period: item.time_period.trim(),
          gpa: item.gpa.trim() || undefined,
          location: item.location.trim() || undefined,
          relevant_coursework: item.relevant_coursework.trim() || undefined,
        });
        patchItem(index, { ...toDraft(created), saving: false });
        toast.success("Education added.");
      } else {
        const updated = await updateEducation(item.id, {
          university: item.university.trim(),
          degree: item.degree.trim(),
          field: item.field.trim(),
          time_period: item.time_period.trim(),
          gpa: item.gpa.trim() || undefined,
          location: item.location.trim() || undefined,
          relevant_coursework: item.relevant_coursework.trim() || undefined,
        });
        patchItem(index, { ...toDraft(updated), saving: false });
        toast.success("Education updated.");
      }
    } catch (error) {
      patchItem(index, { saving: false });
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Your session expired. Please login again.");
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to save education.");
      }
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
      await deleteEducation(item.id);
      setItems((prev) => prev.filter((_, i) => i !== index));
      toast.success("Education removed.");
    } catch (error) {
      patchItem(index, { deleting: false });
      toast.error(error instanceof Error ? error.message : "Failed to remove education.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-8 md:py-12">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
            Academic History
          </p>
          <h1 className="font-heading text-4xl leading-tight text-primary md:text-5xl">Educations</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your education timeline and highlights.</p>
        </div>
        <Button onClick={addDraft} className="ce-primary-gradient rounded-lg text-primary-foreground">
          <Plus className="size-4" />
          Add Education
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
        <Card className="ce-card rounded-xl">
          <CardContent className="py-10 text-center text-muted-foreground">
            No education entries yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={item.id ?? `draft-${index}`} className="ce-card rounded-xl">
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-primary">Education #{index + 1}</CardTitle>
                <CardDescription>Keep this concise and recruiter-friendly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>University</Label>
                    <Input
                      value={item.university}
                      onChange={(event) => patchItem(index, { university: event.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Degree</Label>
                    <Input value={item.degree} onChange={(event) => patchItem(index, { degree: event.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Field</Label>
                    <Input value={item.field} onChange={(event) => patchItem(index, { field: event.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Time Period</Label>
                    <Input
                      value={item.time_period}
                      onChange={(event) => patchItem(index, { time_period: event.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>GPA (optional)</Label>
                    <Input value={item.gpa} onChange={(event) => patchItem(index, { gpa: event.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Location (optional)</Label>
                    <Input value={item.location} onChange={(event) => patchItem(index, { location: event.target.value })} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Relevant Coursework (optional)</Label>
                  <Textarea
                    rows={3}
                    value={item.relevant_coursework}
                    onChange={(event) =>
                      patchItem(index, { relevant_coursework: event.target.value })
                    }
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={() => saveItem(index)}
                    disabled={item.saving || item.deleting}
                    className="ce-primary-gradient rounded-lg text-primary-foreground"
                  >
                    {item.saving ? <Loader2 className="size-4 animate-spin" /> : null}
                    {item.id ? "Update" : "Save"}
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
        </div>
      )}
    </main>
  );
}
