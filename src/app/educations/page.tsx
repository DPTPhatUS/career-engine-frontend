"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Input,
  ProgressBar,
  Spinner,
  TextArea,
} from "@heroui/react";
import { toast } from "sonner";
import {
  ApiError,
  createEducation,
  deleteEducation,
  listEducations,
  updateEducation,
  type EducationRecord,
} from "@/lib/api";

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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setErrorMessage("");
      try {
        const data = await listEducations();
        if (!active) return;
        setItems(data.map(toDraft));
        setActiveIndex(0);
      } catch (error) {
        if (!active) return;
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load education entries."
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

  useEffect(() => {
    if (items.length === 0 && activeIndex !== 0) {
      setActiveIndex(0);
      return;
    }
    if (items.length > 0 && activeIndex > items.length - 1) {
      setActiveIndex(items.length - 1);
    }
  }, [activeIndex, items.length]);

  function patchItem(index: number, patch: Partial<EducationDraft>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function addDraft() {
    setItems((prev) => [...prev, emptyDraft()]);
    setActiveIndex(items.length);
  }

  function removeDraftFromState(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex((current) => {
      const nextLength = Math.max(items.length - 1, 0);
      if (nextLength === 0) return 0;
      if (current === index) return Math.min(index, nextLength - 1);
      if (current > index) return current - 1;
      return current;
    });
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
      removeDraftFromState(index);
      return;
    }

    patchItem(index, { deleting: true });

    try {
      await deleteEducation(item.id);
      removeDraftFromState(index);
      toast.success("Education removed.");
    } catch (error) {
      patchItem(index, { deleting: false });
      toast.error(error instanceof Error ? error.message : "Failed to remove education.");
    }
  }

  const activeItem = items[activeIndex] ?? null;

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8 md:py-12 lg:py-14">
      <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
            Curation Hub
          </p>
          <h1 className="font-heading text-4xl leading-tight text-primary md:text-5xl">
            Academic History
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Organize your educational credentials like a curated portfolio. Each entry sharpens
            your professional narrative.
          </p>
        </div>

        <Button
          onPress={addDraft}
          className="ce-primary-gradient rounded-xl px-6 py-3 text-primary-foreground"
        >
          <Plus className="size-4" />
          Add Education
        </Button>
      </header>

      {errorMessage ? (
        <Card className="mb-6 border border-destructive/35 bg-destructive/10">
          <Card.Content className="p-4 text-sm text-destructive">{errorMessage}</Card.Content>
        </Card>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner aria-label="Loading education entries" color="accent" />
        </div>
      ) : items.length === 0 ? (
        <Card className="ce-card rounded-2xl">
          <Card.Content className="space-y-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">No education entries yet.</p>
            <Button
              onPress={addDraft}
              className="ce-primary-gradient rounded-xl text-primary-foreground"
            >
              <Plus className="size-4" />
              Add your first education
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <section className="space-y-6 md:col-span-8">
            {activeItem ? (
              <Card className="ce-card rounded-2xl">
                <Card.Content className="p-6 md:p-8 lg:p-10">
                  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                        Primary Credential
                      </p>
                      <h2 className="mt-2 font-heading text-3xl text-primary">
                        {activeItem.university.trim() || `Education #${activeIndex + 1}`}
                      </h2>
                    </div>

                    <Chip size="sm" variant="soft" color="accent" className="w-fit">
                      Editing Entry {activeIndex + 1}
                    </Chip>
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        University Name
                      </p>
                      <Input
                        aria-label="University name"
                        value={activeItem.university}
                        onChange={(event) =>
                          patchItem(activeIndex, { university: event.target.value })
                        }
                        className="bg-card"
                        placeholder="Stanford University"
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Degree
                      </p>
                      <Input
                        aria-label="Degree"
                        value={activeItem.degree}
                        onChange={(event) => patchItem(activeIndex, { degree: event.target.value })}
                        className="bg-card"
                        placeholder="Master of Science"
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Field of Study
                      </p>
                      <Input
                        aria-label="Field of study"
                        value={activeItem.field}
                        onChange={(event) => patchItem(activeIndex, { field: event.target.value })}
                        className="bg-card"
                        placeholder="Computer Science"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Time Period
                      </p>
                      <Input
                        aria-label="Education time period"
                        value={activeItem.time_period}
                        onChange={(event) =>
                          patchItem(activeIndex, { time_period: event.target.value })
                        }
                        className="bg-card"
                        placeholder="e.g. 2018 - 2020"
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        GPA (optional)
                      </p>
                      <Input
                        aria-label="Grade point average"
                        value={activeItem.gpa}
                        onChange={(event) => patchItem(activeIndex, { gpa: event.target.value })}
                        className="bg-card"
                        placeholder="3.92"
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Location (optional)
                      </p>
                      <Input
                        aria-label="Education location"
                        value={activeItem.location}
                        onChange={(event) => patchItem(activeIndex, { location: event.target.value })}
                        className="bg-card"
                        placeholder="Stanford, CA"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Relevant Coursework (optional)
                      </p>
                      <TextArea
                        aria-label="Relevant coursework"
                        rows={4}
                        value={activeItem.relevant_coursework}
                        onChange={(event) =>
                          patchItem(activeIndex, { relevant_coursework: event.target.value })
                        }
                        className="bg-card"
                        placeholder="Advanced Machine Learning, Distributed Systems..."
                      />
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      onPress={() => removeItem(activeIndex)}
                      isDisabled={activeItem.saving || activeItem.deleting}
                      className="text-destructive"
                    >
                      {activeItem.deleting ? (
                        <Spinner aria-label="Deleting education" size="sm" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                      Delete Entry
                    </Button>

                    <Button
                      onPress={() => saveItem(activeIndex)}
                      isDisabled={activeItem.saving || activeItem.deleting}
                      className="ce-primary-gradient rounded-xl text-primary-foreground"
                    >
                      {activeItem.saving ? (
                        <Spinner aria-label="Saving education" size="sm" />
                      ) : (
                        <Save className="size-4" />
                      )}
                      {activeItem.id ? "Save Changes" : "Save Entry"}
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card className="rounded-2xl border border-border/70 bg-card/95 shadow-sm">
                <Card.Content className="space-y-2 p-5">
                  <span className="inline-flex w-fit rounded-lg bg-secondary p-2 text-primary">
                    <Lightbulb className="size-4" />
                  </span>
                  <h3 className="font-heading text-xl text-primary">Curator Tip</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Highlight coursework connected to your target role to improve ATS keyword
                    coverage.
                  </p>
                </Card.Content>
              </Card>

              <Card className="rounded-2xl border border-border/70 bg-card/95 shadow-sm">
                <Card.Content className="space-y-2 p-5">
                  <span className="inline-flex w-fit rounded-lg bg-secondary p-2 text-primary">
                    <Sparkles className="size-4" />
                  </span>
                  <h3 className="font-heading text-xl text-primary">Verification</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Keep institution and date values consistent with your transcript to avoid
                    verification friction.
                  </p>
                </Card.Content>
              </Card>
            </div>
          </section>

          <aside className="space-y-5 md:col-span-4">
            <Card className="rounded-2xl border border-border/70 bg-card/95 shadow-sm">
              <Card.Content className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Your Curriculum
                  </h3>
                  <Chip size="sm" variant="soft" color="accent">
                    {items.length} Entries
                  </Chip>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={item.id ?? `curriculum-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={
                          isActive
                            ? "w-full rounded-xl border border-primary/25 bg-primary/5 p-4 text-left"
                            : "w-full rounded-xl border border-border/70 bg-background/80 p-4 text-left transition-colors hover:bg-card"
                        }
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <Avatar size="sm" className="border border-border/70 bg-card">
                            <Avatar.Fallback className="text-xs font-semibold text-primary">
                              {index + 1}
                            </Avatar.Fallback>
                          </Avatar>
                          {isActive ? <CheckCircle2 className="size-4 text-primary" /> : null}
                        </div>

                        <h4 className="font-heading text-2xl leading-tight text-primary">
                          {item.university.trim() || `Education #${index + 1}`}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.degree.trim() || "Degree"}
                          {item.field.trim() ? ` in ${item.field.trim()}` : ""}
                        </p>
                        <p className="mt-3 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                          {item.time_period.trim() || "No date range yet"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </Card.Content>
            </Card>

            <Card className="ce-primary-gradient overflow-hidden rounded-2xl border-0 text-primary-foreground">
              <Card.Content className="space-y-4 p-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.12em]">
                  <GraduationCap className="size-3.5" />
                  Strength Profile
                </div>

                <div>
                  <h3 className="font-heading text-2xl">Education Scoring</h3>
                  <p className="mt-1 text-xs text-primary-foreground/80">
                    Your education section ranks strongly for your target market.
                  </p>
                </div>

                <ProgressBar
                  aria-label="Education strength"
                  value={85}
                  className="mt-1 gap-0"
                >
                  <ProgressBar.Track className="h-1.5 rounded-full bg-white/20">
                    <ProgressBar.Fill className="rounded-full bg-blue-100" />
                  </ProgressBar.Track>
                </ProgressBar>

                <p className="text-right text-[11px] text-primary-foreground/70">Top 5% for your industry</p>
              </Card.Content>
            </Card>
          </aside>
        </div>
      )}
    </main>
  );
}