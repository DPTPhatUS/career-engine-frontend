"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { ApiError, getMe, startGoogleLogin } from "@/lib/api";
import { Button, Card, Chip, Spinner } from "@heroui/react";

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
        <Card className="w-full max-w-md border border-border/60 bg-card/90">
          <Card.Content className="flex items-center justify-center gap-3 py-12">
            <Spinner aria-label="Checking session" color="accent" size="sm" />
            <p className="text-sm text-muted-foreground">Checking your active session...</p>
          </Card.Content>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 py-10 md:px-8 md:py-12 lg:py-14">
      <section className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_30rem]">
        <Card className="border border-border/60 bg-card/90">
          <Card.Content className="space-y-6 p-8 md:p-10">
            <Chip variant="soft" color="accent" className="w-fit">Authentication Portal</Chip>
            <div className="space-y-3">
              <h1 className="font-heading text-5xl leading-tight text-primary md:text-6xl">
                Welcome back to Career Engine
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Continue curating your profile, education timeline, and project narratives with a secure Google login.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border border-border/60 bg-secondary/45">
                <Card.Content className="space-y-2 p-4">
                  <Chip size="sm" variant="soft" color="accent" className="w-fit">Resume Studio</Chip>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <Sparkles className="size-4" />
                    Real-time drafting
                  </p>
                </Card.Content>
              </Card>

              <Card className="border border-border/60 bg-secondary/45">
                <Card.Content className="space-y-2 p-4">
                  <Chip size="sm" variant="soft" color="accent" className="w-fit">Account Security</Chip>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <ShieldCheck className="size-4" />
                    Google OAuth protected
                  </p>
                </Card.Content>
              </Card>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-border/60 bg-card/95">
          <Card.Content className="space-y-6 p-7 md:p-8">
            <div className="space-y-2">
              <Chip variant="soft" color="accent" className="w-fit">Sign In</Chip>
              <h2 className="font-heading text-4xl leading-tight text-primary">Access your workspace</h2>
              <p className="text-sm text-muted-foreground">
                Use your Google account to continue building profiles, projects, and resumes.
              </p>
            </div>

            <Button
              onPress={handleGoogleLogin}
              isDisabled={loading}
              size="lg"
              variant="primary"
              className="h-11 w-full rounded-xl"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              Continue with Google
            </Button>

            <p className="text-xs text-muted-foreground">
              By continuing, you agree to use Career Engine with your authenticated Google account.
            </p>
          </Card.Content>
        </Card>
      </section>
    </main>
  );
}
