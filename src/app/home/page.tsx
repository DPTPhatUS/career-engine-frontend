import Link from "next/link";
import {
  GraduationCap,
  User,
  FolderKanban,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cards = [
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
    title: "Projects",
    description: "Highlight key deliverables and measurable outcomes.",
    icon: FolderKanban,
  },
  {
    href: "/resume",
    title: "Resume Builder",
    description: "Design your resume and generate polished docs in one flow.",
    icon: FileText,
  },
] as const;

export default function DashboardHomePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-10 md:px-8 md:py-12">
      <section className="mb-10 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="max-w-3xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
            Welcome Back
          </p>
          <h1 className="font-heading text-4xl leading-tight text-primary md:text-5xl">
            Curate your professional legacy with precision.
          </h1>
        </div>

        <div className="ce-card rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Profile Completion
            </span>
            <span className="text-lg font-bold text-primary">85%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[85%] bg-primary" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Add your latest project to reach 100%.</p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/resume"
          className="ce-primary-gradient group relative overflow-hidden rounded-xl p-7 text-primary-foreground md:col-span-2"
        >
          <FileText className="mb-5 size-7" />
          <h2 className="font-heading text-3xl">Resume Builder</h2>
          <p className="mt-2 max-w-sm text-sm text-primary-foreground/80">
            Design your executive resume using curator-approved structure and formatting.
          </p>
          <div className="mt-8 inline-flex items-center gap-1 text-sm font-semibold">
            Begin Drafting
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </div>
          <FileText className="pointer-events-none absolute -bottom-12 -right-10 size-52 text-white/10" />
        </Link>

        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={item.href === "/resume" ? "hidden" : "group"}
            >
              <Card className="ce-card h-full rounded-xl transition duration-300 group-hover:-translate-y-1">
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="font-heading text-2xl text-primary">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </div>
                  <span className="rounded-xl border border-primary/15 bg-primary/10 p-2 text-primary transition group-hover:scale-105">
                    <Icon className="size-5" />
                  </span>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Open
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        <Card className="ce-card rounded-xl md:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-primary">Daily Tip</CardTitle>
            <CardDescription>Use active verbs like Led, Orchestrated, and Delivered.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Sparkles className="size-3.5" />
              Writing quality booster
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
