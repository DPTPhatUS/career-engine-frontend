import Link from "next/link";
import { FileText, FolderKanban, GraduationCap, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Educations", href: "/educations", icon: GraduationCap },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Resume", href: "/resume", icon: FileText },
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-12 md:px-8 md:py-16">
      <section className="mx-auto mb-10 max-w-4xl text-center">
        <p className="mb-3 text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Career Engine
        </p>
        <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight md:text-6xl">
          Build your profile, curate experience, and generate resumes that ship.
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
          One workspace for personal info, education history, projects, and a resume builder that exports directly to Google Docs.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
            Login with Google
          </Link>
          <Link
            href="/home"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Open Dashboard
          </Link>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-4 md:grid-cols-2">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="group">
              <Card className="border-primary/20 bg-card/85 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/10">
                <CardHeader className="flex-row items-center gap-3">
                  <span className="rounded-lg border border-primary/30 bg-primary/10 p-2 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle>{item.label}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-muted-foreground">
                  Manage your {item.label.toLowerCase()} section.
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
