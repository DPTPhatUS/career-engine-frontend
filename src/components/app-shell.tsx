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
import {
  Bell,
  FileText,
  FolderKanban,
  GraduationCap,
  House,
  Loader2,
  Search,
  Settings,
  User,
} from "lucide-react";
import { Avatar, Button, InputGroup, TextField } from "@heroui/react";
import { toast } from "sonner";
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
  { href: "/", label: "Home", mobileLabel: "Home", icon: House },
  { href: "/profile", label: "Profile", mobileLabel: "Profile", icon: User },
  { href: "/educations", label: "Education", mobileLabel: "Education", icon: GraduationCap },
  { href: "/projects", label: "Projects", mobileLabel: "Projects", icon: FolderKanban },
  { href: "/resume", label: "Resume Builder", mobileLabel: "Resume", icon: FileText },
] as const;

const protectedRoutes = new Set<string>([
  // Commented out for now
  // "/",
  // "/home",
  // "/profile",
  // "/educations",
  // "/projects",
  // "/resume",
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

  const isNavActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/" || pathname === "/home";
      }
      return pathname === href;
    },
    [pathname]
  );

  const avatarFallback = useMemo(() => {
    const name = displayName.trim();
    if (!name) return "CE";

    const tokens = name.split(/\s+/).filter(Boolean);
    if (tokens.length === 1) {
      return tokens[0].slice(0, 2).toUpperCase();
    }

    return `${tokens[0]?.[0] ?? ""}${tokens[1]?.[0] ?? ""}`.toUpperCase();
  }, [displayName]);

  const showProtectedLoader = authLoading && protectedRoutes.has(pathname);
  const shouldHideContent = !authLoading && !me && protectedRoutes.has(pathname);
  const showChrome = pathname !== "/login";

  return (
    <AuthContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        {showChrome ? (
          <>
            <header className="fixed inset-x-0 top-0 z-50 border-b border-border/45 bg-background/78 backdrop-blur-xl">
              <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-3.5">
                <div className="flex min-w-0 items-center gap-7 lg:gap-10">
                  <Link href="/" className="group inline-flex items-center">
                    <span className="font-heading text-3xl leading-none tracking-tight text-primary transition-opacity group-hover:opacity-80">
                      Career Engine
                    </span>
                  </Link>

                  <nav className="hidden items-center gap-5 md:flex lg:gap-7">
                    {navItems.map((item) => {
                      const active = isNavActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "border-b-2 pb-1 text-sm font-semibold transition-colors",
                            active
                              ? "border-primary text-primary"
                              : "border-transparent text-muted-foreground hover:text-primary"
                          )}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="flex shrink-0 items-center gap-2 md:gap-2.5">
                  <TextField aria-label="Search resources" className="hidden sm:block">
                    <InputGroup
                      variant="secondary"
                      className="w-44 rounded-full border border-border/55 bg-card/80 px-2 shadow-none md:w-56 lg:w-72"
                    >
                      <InputGroup.Prefix className="text-muted-foreground">
                        <Search className="size-3.5" />
                      </InputGroup.Prefix>
                      <InputGroup.Input
                        placeholder="Search resources..."
                        className="bg-transparent text-sm placeholder:text-muted-foreground/80"
                      />
                    </InputGroup>
                  </TextField>

                  {authLoading ? (
                    <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
                  ) : me ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        aria-label="Notifications"
                        className="hidden rounded-full text-muted-foreground hover:bg-secondary/70 md:inline-flex"
                      >
                        <Bell className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        aria-label="Settings"
                        className="hidden rounded-full text-muted-foreground hover:bg-secondary/70 md:inline-flex"
                      >
                        <Settings className="size-4" />
                      </Button>

                      <Link
                        href="/profile"
                        aria-label="Open profile"
                        className="inline-flex"
                      >
                        <Avatar size="sm" className="border border-border/70 bg-card shadow-sm">
                          <Avatar.Fallback className="text-xs font-semibold uppercase text-foreground">
                            {avatarFallback}
                          </Avatar.Fallback>
                        </Avatar>
                      </Link>

                      <Button
                        variant="secondary"
                        size="sm"
                        isDisabled={isLoggingOut}
                        onPress={handleLogout}
                        className="hidden lg:inline-flex"
                      >
                        {isLoggingOut ? <Loader2 className="size-4 animate-spin" /> : null}
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link href="/login" className="button button--primary button--sm">
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </header>

            <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border/60 bg-background/94 py-2.5 backdrop-blur-lg md:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex min-w-16 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.mobileLabel}</span>
                  </Link>
                );
              })}
            </nav>
          </>
        ) : null}

        {showProtectedLoader ? (
          <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center justify-center px-6 py-10 md:px-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </main>
        ) : shouldHideContent ? null : (
          <div className={cn(showChrome ? "pb-20 pt-16 md:pb-0 md:pt-20" : "")}>{children}</div>
        )}

      </div>
    </AuthContext.Provider>
  );
}
