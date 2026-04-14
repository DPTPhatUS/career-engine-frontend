"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { ApiError, getMe, startGoogleLogin } from "@/lib/api";
import { Button, Card, Spinner } from "@heroui/react";

export default function LoginPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        await getMe();
        if (!active) return;
        router.replace("/");
      } catch {
        if (!active) return;
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const { authorization_url } = await startGoogleLogin("/");
      window.location.href = authorization_url;
    } catch (error) {
      const detail =
        error instanceof ApiError ? error.message : "Failed to start Google login.";
      toast.error(detail);
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 py-10 md:px-8 md:py-12 lg:py-14">
        <Card className="ce-card w-full max-w-md rounded-2xl">
          <Card.Content className="flex items-center justify-center gap-3 py-12">
            <Spinner aria-label="Checking session" color="accent" size="sm" />
            <p className="text-sm text-muted-foreground">Checking your active session...</p>
          </Card.Content>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex w-full max-w-7xl flex-1 items-center overflow-hidden px-6 py-10 md:px-8 md:py-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-0 h-72 w-72 rounded-full bg-secondary/55 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <section className="z-10 grid w-full items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_29rem] lg:gap-8">
        <Card className="overflow-hidden rounded-2xl border-0 bg-card/88 backdrop-blur">
          <Card.Content className="relative h-full p-8 md:p-10">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              Authentication Portal
            </p>
            <h1 className="mt-4 max-w-xl font-heading text-5xl leading-tight text-primary md:text-6xl">
              Welcome back to Career Engine
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              Continue curating your profile, education timeline, and project narrative with one secure sign-in.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-secondary/55 p-4 ce-ghost-border">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Resume Studio
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="size-4" />
                  Real-time drafting
                </p>
              </div>

              <div className="rounded-xl bg-secondary/55 p-4 ce-ghost-border">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Account Security
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <ShieldCheck className="size-4" />
                  Google OAuth protected
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="ce-card rounded-2xl">
          <Card.Content className="space-y-6 p-7 md:p-8">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Sign In
              </p>
              <h2 className="font-heading text-4xl leading-tight text-primary">Access your workspace</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Use Google authentication to continue building your profile, projects, and resume drafts.
              </p>
            </div>

            <Button
              onPress={handleGoogleLogin}
              isDisabled={loading}
              size="lg"
              className="ce-primary-gradient h-11 w-full rounded-xl text-[11px] font-semibold tracking-[0.16em] text-primary-foreground uppercase"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              Continue with Google
            </Button>

            <p className="text-xs leading-relaxed text-muted-foreground">
              By continuing, you agree to use Career Engine with your authenticated Google account.
            </p>
          </Card.Content>
        </Card>
      </section>
    </main>
  );
}
