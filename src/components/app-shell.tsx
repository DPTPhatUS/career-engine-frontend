"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ApiError,
  getMe,
  getProfile,
  logout,
  type MeResponse,
  type ProfileRecord,
} from "@/lib/api";

type AuthContextValue = {
  me: MeResponse | null;
  profile: ProfileRecord | null;
  authLoading: boolean;
  refreshAuth: () => Promise<void>;
  setProfileInContext: (profile: ProfileRecord | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const navItems = [
  { href: "/home", label: "Home" },
  { href: "/profile", label: "Profile" },
  { href: "/educations", label: "Educations" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
] as const;

const protectedRoutes = new Set([
  "/home",
  "/profile",
  "/educations",
  "/projects",
  "/resume",
]);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AppShell");
  }
  return context;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const refreshAuth = useCallback(async () => {
    setAuthLoading(true);
    try {
      const nextMe = await getMe();
      setMe(nextMe);

      try {
        const nextProfile = await getProfile();
        setProfile(nextProfile);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          setProfile(null);
        } else {
          throw error;
        }
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setMe(null);
        setProfile(null);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [pathname, refreshAuth]);

  useEffect(() => {
    if (!authLoading && !me && protectedRoutes.has(pathname)) {
      router.replace("/login");
    }
  }, [authLoading, me, pathname, router]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      setMe(null);
      setProfile(null);
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed");
      setIsLoggingOut(false);
    }
  }

  const displayName = useMemo(() => {
    const fullName = profile?.full_name?.trim();
    if (fullName) return fullName;
    if (!me?.email) return "";
    return me.email.split("@")[0] || me.email;
  }, [me?.email, profile?.full_name]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      me,
      profile,
      authLoading,
      refreshAuth,
      setProfileInContext: setProfile,
    }),
    [authLoading, me, profile, refreshAuth]
  );

  const showProtectedLoader = authLoading && protectedRoutes.has(pathname);
  const shouldHideContent = !authLoading && !me && protectedRoutes.has(pathname);

  return (
    <AuthContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3 md:px-8">
            <Link href="/" className="font-heading text-lg font-bold tracking-tight text-primary">
              Career Engine
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: active ? "default" : "ghost", size: "sm" }),
                      "transition-transform hover:-translate-y-0.5"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {authLoading ? (
                <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
              ) : me ? (
                <>
                  <Link
                    href="/profile"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    {displayName || "My profile"}
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                  >
                    {isLoggingOut ? <Loader2 className="size-4 animate-spin" /> : null}
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
                  Login
                </Link>
              )}
            </div>
          </div>

          <nav className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto px-5 pb-3 md:hidden md:px-8">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: active ? "default" : "ghost", size: "sm" }),
                    "shrink-0"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        {showProtectedLoader ? (
          <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center justify-center px-6 py-10 md:px-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </main>
        ) : shouldHideContent ? null : (
          children
        )}
      </div>
    </AuthContext.Provider>
  );
}
