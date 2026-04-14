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
  start_period: string;
  end_period: string;
  gpa: string;
  location: string;
  relevant_coursework: string;
  saving: boolean;
  deleting: boolean;
};

function splitTimePeriod(timePeriod: string): {
  start_period: string;
  end_period: string;
} {
  const trimmed = timePeriod.trim();
  if (!trimmed) {
    return { start_period: "", end_period: "" };
  }

  const separatorMatch = trimmed.match(/^(.*?)\s+[-\u2013\u2014]\s+(.*)$/);
  if (separatorMatch) {
    return {
      start_period: separatorMatch[1]?.trim() ?? "",
      end_period: separatorMatch[2]?.trim() ?? "",
    };
  }

  const toMatch = trimmed.match(/^(.*?)\s+to\s+(.*)$/i);
  if (toMatch) {
    return {
      start_period: toMatch[1]?.trim() ?? "",
      end_period: toMatch[2]?.trim() ?? "",
    };
  }

  return { start_period: "", end_period: "" };
}

function resolveTimePeriod(item: EducationDraft): string {
  const start = item.start_period.trim();
  const end = item.end_period.trim();

  if (start && end) return `${start} - ${end}`;
  if (start) return `${start} - Present`;
  if (end) return end;
  return item.time_period.trim();
}

function displayTimePeriod(item: EducationDraft): string {
  return resolveTimePeriod(item) || "No date range yet";
}

function toDraft(item: EducationRecord): EducationDraft {
  const period = splitTimePeriod(item.time_period);
  return {
    id: item.id,
    university: item.university,
    degree: item.degree,
    field: item.field,
    time_period: item.time_period,
    start_period: period.start_period,
    end_period: period.end_period,
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
    start_period: "",
    end_period: "",
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

    const normalizedTimePeriod = resolveTimePeriod(item);

    if (
      !item.university.trim() ||
      !item.degree.trim() ||
      !item.field.trim() ||
      !normalizedTimePeriod
    ) {
      toast.error("University, degree, field, and date period are required.");
      return;
    }

    patchItem(index, { saving: true });

    try {
      if (!item.id) {
        const created = await createEducation({
          university: item.university.trim(),
          degree: item.degree.trim(),
          field: item.field.trim(),
          time_period: normalizedTimePeriod,
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
          time_period: normalizedTimePeriod,
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
  const fieldClassName = "ce-ghost-border rounded-xl bg-secondary/45";
  const labelClassName =
    "mb-2 ml-0.5 block text-[10px] font-semibold uppercase tracking-[0.17em] text-muted-foreground";

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 md:px-8 md:py-12 lg:py-14">
      <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Curation Hub
          </p>
          <h1 className="font-heading text-5xl leading-tight text-primary">
            Academic History
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            Organize your educational credentials with the precision of a curated portfolio. Each
            entry contributes to your professional narrative.
          </p>
        </div>

        <Button
          onPress={addDraft}
          className="ce-primary-gradient rounded-xl px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="space-y-7 lg:col-span-8">
            <Card className="overflow-hidden rounded-2xl border-0 bg-card/96 shadow-[0_28px_60px_-38px_rgba(0,32,69,0.45)]">
              <Card.Content className="p-7 md:p-8 lg:p-9">
                <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-[2rem] italic leading-none text-primary">
                      Primary Credential
                    </h2>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                      Start your academic timeline with your most impactful credential. You can add
                      multiple entries after creating the first one.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="h-2 w-2 rounded-full bg-border/70" />
                  </div>
                </div>

                <div className="rounded-2xl bg-secondary/40 p-6 ce-ghost-border">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    No entries added yet
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add your first education to unlock editing, scoring, and curriculum overview.
                  </p>

                  <Button
                    onPress={addDraft}
                    className="ce-primary-gradient mt-5 rounded-xl px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                  >
                    <Plus className="size-4" />
                    Add your first education
                  </Button>
                </div>
              </Card.Content>
            </Card>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Card className="rounded-2xl border-0 bg-secondary/55">
                <Card.Content className="space-y-3 p-5">
                  <span className="inline-flex w-fit rounded-lg bg-background/75 p-2 text-primary">
                    <Lightbulb className="size-4" />
                  </span>
                  <h3 className="font-heading text-xl text-primary">Curator&apos;s Tip</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Start with your most recent degree first. This creates stronger narrative
                    momentum and improves resume readability.
                  </p>
                </Card.Content>
              </Card>

              <Card className="rounded-2xl border-0 bg-secondary/55">
                <Card.Content className="space-y-3 p-5">
                  <span className="inline-flex w-fit rounded-lg bg-background/75 p-2 text-primary">
                    <Sparkles className="size-4" />
                  </span>
                  <h3 className="font-heading text-xl text-primary">Verification</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Enter school names exactly as they appear on your transcript to make future
                    verification faster.
                  </p>
                </Card.Content>
              </Card>
            </div>
          </section>

          <aside className="space-y-5 lg:col-span-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Your Curriculum
              </h3>
              <Chip size="sm" variant="soft" color="accent">
                0 Entries
              </Chip>
            </div>

            <Card className="rounded-2xl border-0 bg-secondary/45">
              <Card.Content className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <Avatar size="sm" className="border border-border/70 bg-background/75">
                    <Avatar.Fallback className="text-xs font-semibold text-primary">0</Avatar.Fallback>
                  </Avatar>
                  <div>
                    <p className="font-heading text-2xl leading-none text-primary">Curriculum is Empty</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Your entries will appear here once you add your first education record.
                    </p>
                  </div>
                </div>

                <Button onPress={addDraft} variant="secondary" className="w-full rounded-xl">
                  <Plus className="size-4" />
                  Create First Entry
                </Button>
              </Card.Content>
            </Card>

            <Card className="ce-primary-gradient relative overflow-hidden rounded-2xl border-0 text-primary-foreground">
              <div className="pointer-events-none absolute -top-14 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <Card.Content className="relative z-10 space-y-4 p-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.12em]">
                  <GraduationCap className="size-3.5" />
                  Strength Profile
                </div>

                <div>
                  <h3 className="font-heading text-2xl">Education Scoring</h3>
                  <p className="mt-1 text-xs text-primary-foreground/80">
                    Add your first entry to generate an academic strength score.
                  </p>
                </div>

                <ProgressBar aria-label="Education strength" value={0} className="mt-1 gap-0">
                  <ProgressBar.Track className="h-1.5 rounded-full bg-white/20">
                    <ProgressBar.Fill className="rounded-full bg-blue-100" />
                  </ProgressBar.Track>
                </ProgressBar>

                <p className="text-right text-[11px] text-primary-foreground/70">
                  Waiting for first entry
                </p>
              </Card.Content>
            </Card>
          </aside>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="space-y-7 lg:col-span-8">
            {activeItem ? (
              <Card className="overflow-hidden rounded-2xl border-0 bg-card/96 shadow-[0_28px_60px_-38px_rgba(0,32,69,0.45)]">
                <Card.Content className="p-7 md:p-8 lg:p-9">
                  <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-[2rem] italic leading-none text-primary">
                        Primary Credential
                      </h2>
                      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Editing Entry {activeIndex + 1} of {items.length}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span className="h-2 w-2 rounded-full bg-border/70" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <p className={labelClassName}>University Name</p>
                      <Input
                        aria-label="University name"
                        value={activeItem.university}
                        onChange={(event) =>
                          patchItem(activeIndex, { university: event.target.value })
                        }
                        className={fieldClassName}
                        placeholder="Stanford University"
                      />
                    </div>

                    <div>
                      <p className={labelClassName}>Degree</p>
                      <Input
                        aria-label="Degree"
                        value={activeItem.degree}
                        onChange={(event) => patchItem(activeIndex, { degree: event.target.value })}
                        className={fieldClassName}
                        placeholder="Master of Science"
                      />
                    </div>

                    <div>
                      <p className={labelClassName}>Field of Study</p>
                      <Input
                        aria-label="Field of study"
                        value={activeItem.field}
                        onChange={(event) => patchItem(activeIndex, { field: event.target.value })}
                        className={fieldClassName}
                        placeholder="Computer Science and Engineering"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2">
                      <div>
                        <p className={labelClassName}>Start Date</p>
                        <Input
                          aria-label="Education start date"
                          value={activeItem.start_period}
                          onChange={(event) =>
                            patchItem(activeIndex, { start_period: event.target.value })
                          }
                          className={fieldClassName}
                          placeholder="09/01/2018"
                        />
                      </div>

                      <div>
                        <p className={labelClassName}>End Date</p>
                        <Input
                          aria-label="Education end date"
                          value={activeItem.end_period}
                          onChange={(event) =>
                            patchItem(activeIndex, { end_period: event.target.value })
                          }
                          className={fieldClassName}
                          placeholder="06/15/2020"
                        />
                      </div>
                    </div>

                    <div>
                      <p className={labelClassName}>GPA (optional)</p>
                      <Input
                        aria-label="Grade point average"
                        value={activeItem.gpa}
                        onChange={(event) => patchItem(activeIndex, { gpa: event.target.value })}
                        className={fieldClassName}
                        placeholder="3.92"
                      />
                    </div>

                    <div>
                      <p className={labelClassName}>Location (optional)</p>
                      <Input
                        aria-label="Education location"
                        value={activeItem.location}
                        onChange={(event) =>
                          patchItem(activeIndex, { location: event.target.value })
                        }
                        className={fieldClassName}
                        placeholder="Stanford, CA"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <p className={labelClassName}>Relevant Coursework (optional)</p>
                      <TextArea
                        aria-label="Relevant coursework"
                        rows={4}
                        value={activeItem.relevant_coursework}
                        onChange={(event) =>
                          patchItem(activeIndex, { relevant_coursework: event.target.value })
                        }
                        className={fieldClassName}
                        placeholder="Advanced Machine Learning, Distributed Systems, Graduate Algorithms..."
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      onPress={() => removeItem(activeIndex)}
                      isDisabled={activeItem.saving || activeItem.deleting}
                      className="text-[11px] font-semibold uppercase tracking-[0.13em] text-destructive"
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
                      className="ce-primary-gradient rounded-xl px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
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

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Card className="rounded-2xl border-0 bg-secondary/55">
                <Card.Content className="space-y-3 p-5">
                  <span className="inline-flex w-fit rounded-lg bg-background/75 p-2 text-primary">
                    <Lightbulb className="size-4" />
                  </span>
                  <h3 className="font-heading text-xl text-primary">Curator&apos;s Tip</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Focus your coursework on skills relevant to your current career trajectory. AI
                    and cloud systems are high-impact keywords in most technical markets.
                  </p>
                </Card.Content>
              </Card>

              <Card className="rounded-2xl border-0 bg-secondary/55">
                <Card.Content className="space-y-3 p-5">
                  <span className="inline-flex w-fit rounded-lg bg-background/75 p-2 text-primary">
                    <Sparkles className="size-4" />
                  </span>
                  <h3 className="font-heading text-xl text-primary">Verification</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Need to verify this degree quickly? Keep institution names and dates aligned
                    with transcript records to reduce review friction.
                  </p>
                </Card.Content>
              </Card>
            </div>
          </section>

          <aside className="space-y-5 lg:col-span-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Your Curriculum
              </h3>
              <Chip size="sm" variant="soft" color="accent">
                {items.length} Entries
              </Chip>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.id ?? `curriculum-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={
                      isActive
                        ? "w-full rounded-2xl border-l-[3px] border-l-primary bg-card p-5 text-left ce-ghost-border shadow-[0_12px_32px_-24px_rgba(0,32,69,0.65)]"
                        : "w-full rounded-2xl bg-secondary/50 p-5 text-left transition-colors hover:bg-card/90"
                    }
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Avatar
                        size="sm"
                        className={
                          isActive
                            ? "border border-primary/20 bg-primary/10"
                            : "border border-border/70 bg-background/70"
                        }
                      >
                        <Avatar.Fallback className="text-xs font-semibold text-primary">
                          {index + 1}
                        </Avatar.Fallback>
                      </Avatar>
                      {isActive ? <CheckCircle2 className="size-4 text-primary" /> : null}
                    </div>

                    <h4 className="font-heading text-3xl leading-tight text-primary">
                      {item.university.trim() || `Education #${index + 1}`}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.degree.trim() || "Degree"}
                      {item.field.trim() ? ` in ${item.field.trim()}` : ""}
                    </p>
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {displayTimePeriod(item)}
                    </p>
                  </button>
                );
              })}
            </div>

            <Card className="ce-primary-gradient relative overflow-hidden rounded-2xl border-0 text-primary-foreground">
              <div className="pointer-events-none absolute -top-14 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <Card.Content className="relative z-10 space-y-4 p-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.12em]">
                  <GraduationCap className="size-3.5" />
                  Strength Profile
                </div>

                <div>
                  <h3 className="font-heading text-2xl">Education Scoring</h3>
                  <p className="mt-1 text-xs text-primary-foreground/80">
                    Your academic section currently ranks in a strong percentile for your industry.
                  </p>
                </div>

                <ProgressBar aria-label="Education strength" value={85} className="mt-1 gap-0">
                  <ProgressBar.Track className="h-1.5 rounded-full bg-white/20">
                    <ProgressBar.Fill className="rounded-full bg-blue-100" />
                  </ProgressBar.Track>
                </ProgressBar>

                <p className="text-right text-[11px] text-primary-foreground/70">
                  Top 5% for your industry
                </p>
              </Card.Content>
            </Card>
          </aside>
        </div>
      )}
    </main>
  );
}
