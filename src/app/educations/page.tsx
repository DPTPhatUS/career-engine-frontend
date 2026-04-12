"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  GraduationCap,
  Lightbulb,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
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

  const primaryItem = items[0] ?? null;
  const secondaryItems = items.slice(1);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 md:px-8 md:py-12 lg:py-14">
      <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Curation Hub
          </p>
          <h1 className="font-heading text-4xl leading-tight text-primary md:text-5xl">
            Academic History
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Organize your educational credentials with the precision of a curated portfolio. Each entry strengthens your professional narrative.
          </p>
        </div>

        <Button
          onClick={addDraft}
          size="lg"
          className="ce-primary-gradient rounded-lg text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
        >
          <Plus className="size-4" />
          Add Education
        </Button>
      </header>

      {errorMessage ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <Card className="ce-card rounded-xl">
          <CardContent className="space-y-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">No education entries yet.</p>
            <Button
              onClick={addDraft}
              className="ce-primary-gradient rounded-lg text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
            >
              <Plus className="size-4" />
              Add your first education
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="space-y-6 md:col-span-8">
            {primaryItem ? (
              <Card className="ce-card rounded-xl">
                <CardContent className="p-6 md:p-8 lg:p-9">
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                        Primary Credential
                      </p>
                      <h2 className="mt-2 font-heading text-3xl text-primary">
                        {primaryItem.university.trim() || "Education #1"}
                      </h2>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span className="h-2 w-2 rounded-full bg-border" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                    <div className="grid gap-2 md:col-span-2">
                      <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        University Name
                      </Label>
                      <Input
                        value={primaryItem.university}
                        onChange={(event) => patchItem(0, { university: event.target.value })}
                        className="h-10 border-border/80 bg-card"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Degree
                      </Label>
                      <Input
                        value={primaryItem.degree}
                        onChange={(event) => patchItem(0, { degree: event.target.value })}
                        className="h-10 border-border/80 bg-card"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Field of Study
                      </Label>
                      <Input
                        value={primaryItem.field}
                        onChange={(event) => patchItem(0, { field: event.target.value })}
                        className="h-10 border-border/80 bg-card"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Time Period
                      </Label>
                      <Input
                        value={primaryItem.time_period}
                        onChange={(event) => patchItem(0, { time_period: event.target.value })}
                        className="h-10 border-border/80 bg-card"
                        placeholder="e.g. 2018 - 2020"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        GPA (optional)
                      </Label>
                      <Input
                        value={primaryItem.gpa}
                        onChange={(event) => patchItem(0, { gpa: event.target.value })}
                        className="h-10 border-border/80 bg-card"
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                      <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Location (optional)
                      </Label>
                      <Input
                        value={primaryItem.location}
                        onChange={(event) => patchItem(0, { location: event.target.value })}
                        className="h-10 border-border/80 bg-card"
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                      <Label className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Relevant Coursework (optional)
                      </Label>
                      <Textarea
                        rows={4}
                        value={primaryItem.relevant_coursework}
                        onChange={(event) =>
                          patchItem(0, { relevant_coursework: event.target.value })
                        }
                        className="border-border/80 bg-card"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeItem(0)}
                      disabled={primaryItem.saving || primaryItem.deleting}
                    >
                      {primaryItem.deleting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                      Delete Entry
                    </Button>
                    <Button
                      onClick={() => saveItem(0)}
                      disabled={primaryItem.saving || primaryItem.deleting}
                      className="ce-primary-gradient rounded-lg text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
                    >
                      {primaryItem.saving ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Save className="size-4" />
                      )}
                      {primaryItem.id ? "Save Changes" : "Save Entry"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-xl border-border/70 bg-card/95 shadow-sm">
                <CardContent className="space-y-2 p-5">
                  <div className="inline-flex rounded-lg bg-secondary p-2 text-primary">
                    <Lightbulb className="size-4" />
                  </div>
                  <h3 className="font-heading text-xl text-primary">Curator Tip</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Keep coursework concise and relevant to the roles you target most often.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-border/70 bg-card/95 shadow-sm">
                <CardContent className="space-y-2 p-5">
                  <div className="inline-flex rounded-lg bg-secondary p-2 text-primary">
                    <Sparkles className="size-4" />
                  </div>
                  <h3 className="font-heading text-xl text-primary">Profile Strength</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Use consistent time periods and complete location fields for stronger resume parsing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <aside className="space-y-5 md:col-span-4">
            <Card className="rounded-xl border-border/70 bg-card/95 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Your Curriculum
                  </h3>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                    {items.length} Entries
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => {
                    const isPrimary = index === 0;
                    return (
                      <div
                        key={item.id ?? `sidebar-${index}`}
                        className={
                          isPrimary
                            ? "rounded-xl border border-primary/20 bg-primary/5 p-4"
                            : "rounded-xl border border-border/70 bg-background/80 p-4"
                        }
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
                            <GraduationCap className="size-4" />
                          </span>
                          {isPrimary ? (
                            <span className="text-[10px] font-semibold tracking-wide text-primary uppercase">
                              Active
                            </span>
                          ) : null}
                        </div>
                        <h4 className="font-heading text-xl leading-tight text-primary">
                          {item.university.trim() || `Education #${index + 1}`}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.degree.trim() || "Degree"}
                          {item.field.trim() ? ` in ${item.field.trim()}` : ""}
                        </p>
                        <p className="mt-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {item.time_period.trim() || "No time period"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {secondaryItems.length > 0 ? (
              <div className="space-y-3">
                {secondaryItems.map((item, offset) => {
                  const realIndex = offset + 1;
                  return (
                    <Card key={item.id ?? `secondary-${realIndex}`} className="ce-card rounded-xl">
                      <CardContent className="space-y-4 p-4">
                        <div>
                          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                            Entry {realIndex + 1}
                          </p>
                          <h4 className="mt-1 font-heading text-2xl text-primary">
                            {item.university.trim() || "New Education"}
                          </h4>
                        </div>

                        <div className="grid gap-3">
                          <Input
                            value={item.university}
                            onChange={(event) =>
                              patchItem(realIndex, { university: event.target.value })
                            }
                            placeholder="University"
                            className="h-9 border-border/80 bg-card"
                          />
                          <Input
                            value={item.degree}
                            onChange={(event) =>
                              patchItem(realIndex, { degree: event.target.value })
                            }
                            placeholder="Degree"
                            className="h-9 border-border/80 bg-card"
                          />
                          <Input
                            value={item.field}
                            onChange={(event) =>
                              patchItem(realIndex, { field: event.target.value })
                            }
                            placeholder="Field"
                            className="h-9 border-border/80 bg-card"
                          />
                          <Input
                            value={item.time_period}
                            onChange={(event) =>
                              patchItem(realIndex, { time_period: event.target.value })
                            }
                            placeholder="Time period"
                            className="h-9 border-border/80 bg-card"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            onClick={() => saveItem(realIndex)}
                            disabled={item.saving || item.deleting}
                            className="ce-primary-gradient rounded-lg text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
                          >
                            {item.saving ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <ArrowRight className="size-4" />
                            )}
                            {item.id ? "Update" : "Save"}
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeItem(realIndex)}
                            disabled={item.saving || item.deleting}
                          >
                            {item.deleting ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="rounded-xl border-border/70 bg-card/95">
                <CardContent className="space-y-3 p-5">
                  <h3 className="font-heading text-xl text-primary">Need More Entries?</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Add certifications, bootcamps, or additional degrees to strengthen your academic profile.
                  </p>
                  <Button
                    onClick={addDraft}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="size-4" />
                    Add Another Entry
                  </Button>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
