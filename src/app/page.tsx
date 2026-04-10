import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12 md:px-10 md:py-16">
      <div className="mb-14 flex items-center justify-between">
        <p className="font-heading text-lg font-semibold tracking-tight text-primary">
          Career Engine
        </p>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Login with Google
        </Link>
      </div>

      <section className="grid flex-1 items-center gap-10 pb-10 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border bg-card px-4 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Resume Intelligence Platform
          </p>
          <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight text-foreground md:text-6xl">
            Turn your experience into a polished Google Doc resume in minutes.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Career Engine helps you structure projects, skills, education, and
            personal details into a single resume workflow, then generates the
            final document directly in your Google Drive.
          </p>
        </div>

        <div className="rounded-2xl border bg-card/90 p-6 shadow-lg shadow-primary/10 backdrop-blur">
          <p className="mb-5 text-sm font-semibold text-muted-foreground uppercase">
            What you can build now
          </p>
          <ul className="space-y-3 text-sm leading-relaxed text-foreground/90">
            <li>- Google-only authentication with secure cookie sessions</li>
            <li>- Guided resume drafting across key sections</li>
            <li>- One-click resume generation to Google Docs</li>
            <li>- Fast iteration with autosaved drafts</li>
          </ul>
        </div>
      </section>

      <div className="mt-6 flex items-center justify-center border-t pt-8">
        <Link
          href="/resume"
          className={cn(buttonVariants({ size: "lg" }), "min-w-56")}
        >
          Build Your Career
        </Link>
      </div>
    </main>
  );
}
