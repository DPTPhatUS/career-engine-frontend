import Link from "next/link";
import {
  GraduationCap,
  House,
  FolderKanban,
  FileText,
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
    description: "Manage your profile and contact details.",
    icon: House,
  },
  {
    href: "/educations",
    title: "Educations",
    description: "Add and maintain your education timeline.",
    icon: GraduationCap,
  },
  {
    href: "/projects",
    title: "Projects",
    description: "Track project highlights and achievements.",
    icon: FolderKanban,
  },
  {
    href: "/resume",
    title: "Resume",
    description: "Build and generate resumes from scratch.",
    icon: FileText,
  },
] as const;

export default function DashboardHomePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-10 md:px-8 md:py-14">
      <section className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Career Workspace
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
          Pick a workspace and keep your career story sharp.
        </h1>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-5 md:grid-cols-2">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="group">
              <Card className="h-full border-primary/20 bg-card/85 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/10">
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </div>
                  <span className="rounded-xl border border-primary/20 bg-primary/10 p-2 text-primary transition group-hover:scale-105">
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
      </section>
    </main>
  );
}
