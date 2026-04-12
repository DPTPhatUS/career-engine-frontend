import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CirclePlus,
  Download,
  Eye,
  FileText,
  FolderKanban,
  GraduationCap,
  Lightbulb,
  Sparkles,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const shortcuts = [
  {
    href: "/profile",
    title: "Profile",
    description: "Update your professional bio and contact information.",
    icon: User,
  },
  {
    href: "/educations",
    title: "Educations",
    description: "Manage your academic achievements and certifications.",
    icon: GraduationCap,
  },
  {
    href: "/projects",
    title: "Portfolio Projects",
    description: "Showcase key deliverables and impact-focused case studies.",
    icon: FolderKanban,
  },
] as const;

const recentResumes = [
  {
    title: "Strategic Product Lead",
    updated: "Edited 2 hours ago",
    style: "Modern Serif",
  },
  {
    title: "Executive Operations",
    updated: "Modified Dec 12, 2023",
    style: "Classic Ivy",
  },
] as const;

export default function DashboardHomePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-10 md:px-8 md:py-12 lg:py-14">
      <section className="mb-12 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Welcome Back
          </p>
          <h1 className="font-heading text-4xl leading-tight text-primary md:text-5xl">
            Curate your professional legacy with precision.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Keep your profile, education, and portfolio in sync while crafting resume variants tailored for each opportunity.
          </p>
        </div>

        <Card className="ce-card rounded-xl">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Profile Completion
              </span>
              <span className="text-lg font-bold text-primary">85%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[85%] bg-primary" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Add one recent project to reach 100%.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-14 grid grid-cols-1 gap-5 md:grid-cols-4">
        <Link
          href="/resume"
          className="ce-primary-gradient group relative overflow-hidden rounded-xl p-8 text-primary-foreground md:col-span-2 md:min-h-72"
        >
          <FileText className="mb-4 size-8" />
          <h2 className="font-heading text-3xl">Resume Builder</h2>
          <p className="mt-2 max-w-sm text-sm text-primary-foreground/85">
            Design executive-ready resumes and generate polished documents in one focused flow.
          </p>
          <div className="mt-8 inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2">
            Begin Drafting
            <ArrowRight className="size-4" />
          </div>
          <FileText className="pointer-events-none absolute -right-10 -bottom-12 size-52 text-white/10 transition-transform duration-500 group-hover:rotate-3" />
        </Link>

        {shortcuts.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-card"
            >
              <div className="mb-4 inline-flex rounded-lg border border-primary/20 bg-primary/10 p-2 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="font-heading text-2xl text-primary">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Open
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}

        <Link
          href={shortcuts[2].href}
          className="group relative overflow-hidden rounded-xl border border-border/70 bg-secondary/35 p-8 md:col-span-2"
        >
          <div className="max-w-sm">
            <span className="mb-4 inline-flex rounded-lg border border-primary/20 bg-primary/10 p-2 text-primary">
              <FolderKanban className="size-5" />
            </span>
            <h3 className="font-heading text-2xl text-primary">{shortcuts[2].title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {shortcuts[2].description}
            </p>
          </div>

          <div className="absolute right-4 bottom-4 hidden h-24 w-24 rotate-6 rounded-lg border border-border/60 bg-background/90 p-3 shadow-sm sm:block">
            <div className="h-2.5 w-full rounded bg-secondary" />
            <div className="mt-2 h-2 w-3/4 rounded bg-secondary" />
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <div className="h-8 rounded bg-secondary" />
              <div className="h-8 rounded bg-secondary" />
              <div className="h-8 rounded bg-secondary" />
            </div>
          </div>

          <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Review Projects
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </Link>

        <div className="grid gap-5 md:col-span-2 md:grid-cols-2">
          <Card className="rounded-xl border-border/70 bg-card/95 shadow-sm">
            <CardContent className="space-y-2 p-5">
              <span className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Resume Momentum
              </span>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <BriefcaseBusiness className="size-4" />
                2 active resume versions
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Keep one tailored for product roles and one for operations leadership openings.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/70 bg-primary/5 shadow-sm">
            <CardContent className="space-y-2 p-5">
              <span className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Daily Tip
              </span>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Lightbulb className="size-4" />
                Lead with action verbs
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Use action verbs like Led, Orchestrated, and Improved to signal ownership and outcomes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-heading text-2xl text-primary">Recent Resumes</h2>
          <Link
            href="/resume"
            className="text-xs font-semibold tracking-[0.16em] text-primary uppercase transition-opacity hover:opacity-70"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {recentResumes.map((resume, index) => (
            <Card
              key={resume.title}
              className="group overflow-hidden rounded-xl border-border/70 bg-card/95 p-1 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-3/4 overflow-hidden rounded-lg border border-border/60 bg-linear-to-b from-secondary/70 via-background to-background">
                <div className="absolute inset-0 p-5">
                  <div className="h-full rounded-md border border-border/60 bg-card p-3">
                    <div className="h-2.5 w-4/5 rounded bg-secondary" />
                    <div className="mt-2 h-2 w-3/5 rounded bg-secondary" />
                    <div className="mt-4 space-y-1.5">
                      <div className="h-1.5 rounded bg-muted" />
                      <div className="h-1.5 rounded bg-muted" />
                      <div className="h-1.5 w-4/5 rounded bg-muted" />
                    </div>
                    <div className="mt-4 space-y-1.5">
                      <div className="h-1.5 rounded bg-muted" />
                      <div className="h-1.5 w-4/5 rounded bg-muted" />
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-primary/35 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-full bg-background text-primary shadow transition-transform hover:scale-105"
                    aria-label={`Preview ${resume.title}`}
                  >
                    <Eye className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-full bg-background text-primary shadow transition-transform hover:scale-105"
                    aria-label={`Download ${resume.title}`}
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-primary">{resume.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {resume.updated} • {resume.style}
                </p>
                {index === 0 ? (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                    <Sparkles className="size-3" />
                    Recommended
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}

          <Link
            href="/resume"
            className="group flex aspect-3/4 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-card/70 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:text-primary"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary text-primary transition-transform group-hover:scale-105">
              <CirclePlus className="size-5" />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase">
              New Version
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
