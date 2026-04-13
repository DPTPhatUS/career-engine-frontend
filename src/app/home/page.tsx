"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
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
  Pencil,
  UserRound,
} from "lucide-react";
import { Button, Card, Chip, ProgressBar } from "@heroui/react";
import { useAuth } from "@/components/app-shell";

const shortcuts = [
  {
    href: "/profile",
    title: "Profile",
    description: "Update your professional bio and contact information.",
    icon: UserRound,
  },
  {
    href: "/educations",
    title: "Education",
    description: "Manage your academic achievements and certifications.",
    icon: GraduationCap,
  },
  {
    href: "/projects",
    title: "Portfolio Projects",
    description: "Highlight your key deliverables and case studies to showcase impact.",
    icon: FolderKanban,
  },
] as const;

const projectsShortcut = {
  href: "/projects",
  title: "Portfolio Projects",
  description: "Highlight your key deliverables and case studies to showcase impact.",
} as const;

const recentResumes = [
  {
    title: "Strategic Product Lead",
    updated: "Edited 2 hours ago",
    style: "Modern Serif",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7SEb6I95d5SwrcohlJk3TGKP4QFqtjjsblgn5DZ2NWbV_aHP1csXXkydBDba6-Ior_EVzdFIHMsOBbdYGj9L3y63hIl8jNWDkzGSQq3m9RmK7mofgHI1hZGOSNOyNLZDUAq9mby7ttUORJJff5Uan5fKX2SfwNN2R_EEkloayarl2TedmyKa-aTNDgYTHuL_uUrEM0DNW7y2Snr79-OvSYs6oW2p6cd4VyRvF2NRNsNx0gM-_yyTWjgacew1YvNl3TF_DivPEVQ",
  },
  {
    title: "Executive VP Operations",
    updated: "Modified Dec 12, 2023",
    style: "Classic Ivy",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5zU0KQ6QhQqYyxVo9tryGfNd7qoePkZVbrr3clzChOV2KGLaADUPSuy0x4vTLL94UiofjQmu42PdarF39hmXq743aNu6Q68ENCqmvMjzumog04opQ4XK0KUl50mLkX9sF_ss6Ab-umSBGIJRhENTn_rpeaxdc-m8Rq7dA6TVFRhdAv8y8AS_eEF5MFvYR5RzJ6Vc3hK9GJDWPLB-0wx5qnKgZ-My9I7sTHWpXFHHFjSFsnOxa1vMC_ZTT-CEukLeNHVi7sFEIWg",
  },
] as const;

const profileCompletion = 85;

function getFirstName(fullName?: string | null, email?: string | null) {
  const normalizedName = fullName?.trim();
  if (normalizedName) {
    return normalizedName.split(/\s+/)[0] ?? normalizedName;
  }

  const normalizedEmail = email?.trim();
  if (!normalizedEmail) return "";
  return normalizedEmail.split("@")[0] ?? "";
}

export default function DashboardHomePage() {
  const { profile, me, authLoading } = useAuth();

  const welcomeName = useMemo(
    () => getFirstName(profile?.full_name, me?.email),
    [me?.email, profile?.full_name]
  );

  const welcomeLine = authLoading
    ? "Welcome Back"
    : welcomeName
      ? `Welcome Back, ${welcomeName}`
      : "Welcome Back";

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-10 md:px-8 md:py-12 lg:py-14">
      <section className="mb-12 grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">{welcomeLine}</p>
          <h1 className="font-heading text-4xl leading-tight text-primary md:text-6xl">
            Curate your professional legacy
            <br />
            with precision.
          </h1>
        </div>

        <Card className="rounded-xl bg-card/86 backdrop-blur-md">
          <Card.Content className="space-y-3 p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Profile Completion
              </span>
              <span className="text-lg font-bold text-primary">{profileCompletion}%</span>
            </div>

            <ProgressBar aria-label="Profile completion" value={profileCompletion} className="gap-0">
              <ProgressBar.Track className="h-1.5 rounded-full bg-muted">
                <ProgressBar.Fill className="rounded-full bg-primary" />
              </ProgressBar.Track>
            </ProgressBar>

            <p className="text-xs text-muted-foreground">Add your latest project to reach 100%.</p>
          </Card.Content>
        </Card>
      </section>

      <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Link href="/resume" className="group md:col-span-2">
          <Card className="ce-primary-gradient relative min-h-80 overflow-hidden rounded-xl text-primary-foreground">
            <Card.Content className="flex h-full flex-col p-8">
              <FileText className="mb-5 size-8" />
              <h2 className="font-heading text-4xl leading-tight">Resume Builder</h2>
              <p className="mt-3 max-w-60 text-sm text-primary-foreground/80">
                Design your executive resume using curator-approved templates.
              </p>
              <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold">
                Begin Drafting
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>

              <FileText className="pointer-events-none absolute -right-12 -bottom-16 size-60 text-white/8 transition-transform duration-700 group-hover:rotate-6" />
            </Card.Content>
          </Card>
        </Link>

        {shortcuts.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="group">
              <Card className="h-full rounded-xl bg-card/92 transition-colors group-hover:bg-card">
                <Card.Content className="flex h-full flex-col justify-between p-8">
                  <div>
                    <span className="mb-5 inline-flex rounded-md bg-secondary p-2 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <h3 className="font-heading text-4xl leading-tight text-primary">{item.title}</h3>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                  <ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Card.Content>
              </Card>
            </Link>
          );
        })}

        <Link href={projectsShortcut.href} className="group md:col-span-2">
          <Card className="h-full overflow-hidden rounded-xl bg-secondary/50 transition-colors group-hover:bg-secondary/65">
            <Card.Content className="flex h-full items-center justify-between gap-6 p-8">
              <div className="max-w-sm">
                <span className="mb-4 inline-flex rounded-md bg-background/70 p-2 text-primary">
                  <FolderKanban className="size-4" />
                </span>
                <h3 className="font-heading text-3xl text-primary">{projectsShortcut.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{projectsShortcut.description}</p>
              </div>

              <div className="relative hidden h-32 w-32 rotate-6 translate-x-3 overflow-hidden rounded-lg bg-card p-2 sm:block">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK2ef4RWYAgaFwjiH1b1mLjFRhkN4vBVMEAsJ9FyAQy5IJpY6MxeVFqiy4CshGDiF0tjaWqpKKru1VhhZepf4agUVFgCh7RbIcGIwh-FRlmemNyWOVX9ULg-pnqQdPu4UN4cINYrIL1MD4YRNKBV7xB-yQMhfV53m9oaVoHfftxVN4QF01GV65lrS7H4W1pT1igIdDgvkddO82gON827XAUA48aF_cnOWEz3zloCFLGbFG-ZDP7b-n83pof8zC8GGMI-KTFj8IDA"
                  alt="Project preview"
                  fill
                  sizes="128px"
                  className="h-full w-full rounded object-cover"
                />
              </div>
            </Card.Content>
          </Card>
        </Link>

        <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
          <Card className="rounded-xl bg-card/90">
            <Card.Content className="flex h-full flex-col gap-2 p-6">
              <span className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Active Application
              </span>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <BriefcaseBusiness className="size-4" />
                Senior PM @ TechFlow
              </div>
              <Chip size="sm" variant="soft" color="accent" className="w-fit">
                Interview Scheduled
              </Chip>
            </Card.Content>
          </Card>

          <Card className="rounded-xl bg-amber-100/80">
            <Card.Content className="flex h-full flex-col gap-2 p-6">
              <span className="text-[10px] font-semibold tracking-[0.16em] text-amber-900/75 uppercase">
                Daily Tip
              </span>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-950">
                <Lightbulb className="size-4" />
                Lead with action verbs
              </div>
              <p className="text-xs leading-relaxed text-amber-900/80">
                Use active verbs like Led and Orchestrated for stronger impact.
              </p>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="font-heading text-4xl text-primary">Recent Resumes</h2>
          <Link
            href="/resume"
            className="text-xs font-semibold tracking-[0.16em] text-primary uppercase transition-opacity hover:opacity-70"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {recentResumes.map((resume) => (
            <Card
              key={resume.title}
              className="group overflow-hidden rounded-xl bg-card/96 p-1 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-secondary/50">
                <Image
                  src={resume.image}
                  alt={resume.title}
                  fill
                  sizes="(min-width: 1024px) 28vw, (min-width: 768px) 32vw, 92vw"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-primary/35 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    aria-label={`Preview ${resume.title}`}
                    isIconOnly
                    size="sm"
                    variant="secondary"
                    className="rounded-full bg-background/95"
                  >
                    <Eye className="size-4" />
                  </Button>
                  <Button
                    aria-label={`Download ${resume.title}`}
                    isIconOnly
                    size="sm"
                    variant="secondary"
                    className="rounded-full bg-background/95"
                  >
                    <Download className="size-4" />
                  </Button>
                </div>
              </div>

              <Card.Content className="p-4">
                <h3 className="text-sm font-semibold text-primary">{resume.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {resume.updated} • {resume.style}
                </p>
              </Card.Content>
            </Card>
          ))}

          <Link href="/resume" className="group">
            <Card className="flex aspect-3/4 items-center justify-center rounded-xl border-2 border-dashed border-border/70 bg-card/72 text-muted-foreground transition-all duration-300 hover:border-primary/35 hover:text-primary">
              <Card.Content className="flex flex-col items-center gap-4">
                <Button
                  isIconOnly
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                  aria-label="Create new resume version"
                >
                  <CirclePlus className="size-5" />
                </Button>
                <span className="text-[11px] font-semibold tracking-[0.16em] uppercase">New Version</span>
              </Card.Content>
            </Card>
          </Link>
        </div>
      </section>

      <Link
        href="/resume"
        aria-label="Open resume builder"
        className="fixed right-6 bottom-24 z-40 md:right-8 md:bottom-8"
      >
        <Button
          isIconOnly
          size="lg"
          className="ce-primary-gradient rounded-full text-primary-foreground shadow-2xl"
        >
          <Pencil className="size-5" />
        </Button>
      </Link>
    </main>
  );
}
