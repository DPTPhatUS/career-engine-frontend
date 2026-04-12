"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ApiError, getMe, startGoogleLogin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      <main className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center px-6 py-14">
        <Card className="ce-card w-full rounded-xl">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex w-full max-w-7xl flex-1 items-center justify-center overflow-hidden px-6 py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-secondary/45 blur-3xl" />
        <div className="absolute -right-24 top-1/2 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="z-10 w-full max-w-xl">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-5xl font-semibold tracking-tight text-primary md:text-6xl">
            Welcome back to Career Engine
          </h1>
          <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Continue your professional legacy
          </p>
        </div>

        <Card className="ce-card rounded-xl p-2">
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl">Sign in to your workspace</CardTitle>
            <CardDescription>
              Use Google authentication to continue building your profile, projects, and resume drafts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              size="lg"
              className="ce-primary-gradient h-11 w-full rounded-lg text-primary-foreground"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
