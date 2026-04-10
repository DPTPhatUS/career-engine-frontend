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
        router.replace("/resume");
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
      const { authorization_url } = await startGoogleLogin("/resume");
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
        <Card className="w-full">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center px-6 py-14">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Career Engine</CardTitle>
          <CardDescription>
            Sign in with your Google account to start building resumes and generate docs directly to your Google Drive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleLogin} disabled={loading} size="lg" className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
