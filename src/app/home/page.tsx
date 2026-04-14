"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronRight,
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
import { Button, Card, Chip, ProgressBar, Spinner } from "@heroui/react";
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
      <section className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="border border-border/60 bg-card/90">
          <Card.Content className="space-y-5 p-6 md:p-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                {welcomeLine}
              </p>
              <h1 className="font-heading text-4xl leading-tight text-primary md:text-5xl">
                Your career workspace dashboard
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Build profile, education, projects, and resume drafts from one unified workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/resume">
                <Button variant="primary" className="rounded-full">
                  Open Resume Builder
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="secondary" className="rounded-full">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-border/60 bg-card/90">
          <Card.Content className="space-y-4 p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Profile Completion
              </p>
              <Chip variant="soft" color="accent">{profileCompletion}%</Chip>
            </div>

            <ProgressBar aria-label="Profile completion" value={profileCompletion} className="gap-0">
              <ProgressBar.Track className="h-2 rounded-full bg-muted">
                <ProgressBar.Fill className="rounded-full bg-primary" />
              </ProgressBar.Track>
            </ProgressBar>

            {authLoading ? (
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Spinner aria-label="Loading profile completion" color="accent" size="sm" />
                Syncing account context
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Add your latest project to reach full completion.</p>
            )}
          </Card.Content>
        </Card>
      </section>

      <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/resume" className="xl:col-span-2">
          <Card className="h-full border border-border/60 bg-card/95">
            <Card.Content className="flex h-full flex-col gap-4 p-6">
              <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                Core Workflow
              </span>
              <div className="inline-flex items-center gap-2 text-primary">
                <FileText className="size-4" />
                <p className="font-heading text-3xl">Resume Builder</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Draft resume content, preview formatting, and export to Google Docs in one flow.
              </p>
              <Button variant="secondary" className="mt-auto w-fit rounded-full">
                Continue
                <ArrowUpRight className="size-4" />
              </Button>
            </Card.Content>
          </Card>
        </Link>

        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="h-full border border-border/60 bg-card/95">
                <Card.Content className="flex h-full flex-col gap-3 p-6">
                  <span className="inline-flex w-fit rounded-lg bg-secondary p-2 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <h2 className="font-heading text-2xl text-primary">{item.title}</h2>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <Button variant="ghost" className="mt-auto w-fit rounded-full text-muted-foreground">
                    Open
                    <ArrowUpRight className="size-4" />
                  </Button>
                </Card.Content>
              </Card>
            </Link>
          );
        })}
      </section>

      <section className="mb-8 grid gap-5 md:grid-cols-2">
        <Card className="border border-border/60 bg-card/92">
          <Card.Content className="space-y-3 p-6">
            <Chip variant="soft" color="accent" className="w-fit">Active Application</Chip>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <BriefcaseBusiness className="size-4" />
              Senior PM @ TechFlow
            </div>
            <p className="text-sm text-muted-foreground">Interview scheduled and prep checklist available.</p>
          </Card.Content>
        </Card>

        <Card className="border border-amber-200/70 bg-amber-50/75">
          <Card.Content className="space-y-3 p-6">
            <Chip variant="soft" color="warning" className="w-fit">Daily Tip</Chip>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-950">
              <Lightbulb className="size-4" />
              Lead with action verbs
            </div>
            <p className="text-sm text-amber-900/85">Use active verbs like Led and Orchestrated for stronger impact statements.</p>
          </Card.Content>
        </Card>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-heading text-3xl text-primary">Recent Resumes</h2>
          <Link href="/resume">
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {recentResumes.map((resume) => (
            <Card key={resume.title} className="overflow-hidden border border-border/60 bg-card/96">
              <div className="relative aspect-3/4 overflow-hidden border-b border-border/60 bg-secondary/40">
                <Image
                  src={resume.image}
                  alt={resume.title}
                  fill
                  sizes="(min-width: 1024px) 28vw, (min-width: 768px) 32vw, 92vw"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2">
                  <Button aria-label={`Preview ${resume.title}`} isIconOnly size="sm" variant="secondary" className="rounded-full">
                    <Eye className="size-4" />
                  </Button>
                  <Button aria-label={`Download ${resume.title}`} isIconOnly size="sm" variant="secondary" className="rounded-full">
                    <Download className="size-4" />
                  </Button>
                </div>
              </div>

              <Card.Content className="space-y-1 p-4">
                <p className="text-sm font-semibold text-primary">{resume.title}</p>
                <p className="text-xs text-muted-foreground">{resume.updated}</p>
                <Chip size="sm" variant="soft" color="accent" className="w-fit">
                  {resume.style}
                </Chip>
              </Card.Content>
            </Card>
          ))}

          <Link href={projectsShortcut.href}>
            <Card className="h-full border border-border/60 bg-card/96">
              <Card.Content className="flex h-full flex-col gap-3 p-6">
                <span className="inline-flex w-fit rounded-lg bg-secondary p-2 text-primary">
                  <FolderKanban className="size-4" />
                </span>
                <h3 className="font-heading text-2xl text-primary">{projectsShortcut.title}</h3>
                <p className="text-sm text-muted-foreground">{projectsShortcut.description}</p>
                <Button variant="ghost" className="mt-auto w-fit rounded-full text-muted-foreground">
                  Open Projects
                  <ArrowUpRight className="size-4" />
                </Button>
              </Card.Content>
            </Card>
          </Link>

          <Link href="/resume">
            <Card className="flex min-h-64 items-center justify-center border border-dashed border-border/70 bg-card/70">
              <Card.Content className="flex flex-col items-center gap-3 p-8 text-center">
                <Button isIconOnly variant="secondary" className="rounded-full" aria-label="Create new resume version">
                  <CirclePlus className="size-5" />
                </Button>
                <p className="text-sm font-semibold text-primary">Create New Resume Version</p>
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
        <Button isIconOnly size="lg" variant="primary" className="rounded-full shadow-xl">
          <Pencil className="size-5" />
        </Button>
      </Link>
    </main>
  );
}
