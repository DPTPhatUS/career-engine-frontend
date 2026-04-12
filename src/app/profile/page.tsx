"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Info,
  Loader2,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  ApiError,
  getProfile,
  putProfile,
  type ProfilePayload,
} from "@/lib/api";
import { useAuth } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(1, "Phone is required."),
  address: z.string().trim().min(1, "Address is required."),
  github_label: z.string().trim().min(1, "GitHub label is required."),
  github_url: z.union([z.literal(""), z.string().url("Enter a valid URL")]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const emptyValues: ProfileFormValues = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  github_label: "GitHub",
  github_url: "",
};

export default function ProfilePage() {
  const { me, setProfileInContext } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastLoadedValues, setLastLoadedValues] = useState<ProfileFormValues>(emptyValues);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setErrorMessage("");

      try {
        const profile = await getProfile();
        if (!active) return;

        form.reset({
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          github_label: profile.github_label || "GitHub",
          github_url: profile.github_url ?? "",
        });
        setLastLoadedValues({
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          github_label: profile.github_label || "GitHub",
          github_url: profile.github_url ?? "",
        });
      } catch (error) {
        if (!active) return;

        if (error instanceof ApiError && error.status === 404) {
          const defaults = {
            ...emptyValues,
            email: me?.email ?? "",
          };
          form.reset(defaults);
          setLastLoadedValues(defaults);
        } else {
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to load profile."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [form, me?.email]);

  async function onSubmit(values: ProfileFormValues) {
    setSaving(true);
    setErrorMessage("");

    const payload: ProfilePayload = {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      github_label: values.github_label.trim(),
      github_url: values.github_url.trim() || undefined,
    };

    try {
      const updated = await putProfile(payload);
      setProfileInContext(updated);
      setLastLoadedValues(values);
      toast.success("Profile saved.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 md:px-8 md:py-12 lg:py-14">
      <section className="mb-12 max-w-4xl">
        <div className="mb-2 flex items-center gap-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Account Settings
          </p>
          <span className="h-px w-10 bg-border" />
        </div>
        <h1 className="font-heading text-4xl leading-tight text-primary md:text-5xl">
          Profile Management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Curate your professional identity. This information powers resume generation and profile-based drafting across the app.
        </p>
      </section>

      {errorMessage ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Card className="ce-card relative overflow-hidden rounded-xl">
        <div className="pointer-events-none absolute -top-10 -right-8 opacity-20">
          <UserRound className="size-36 text-primary" />
        </div>

        <CardContent className="relative p-6 md:p-8 lg:p-10">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label
                    htmlFor="full_name"
                    className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
                  >
                    Full Name
                  </Label>
                  <Input id="full_name" className="h-10 border-border/80 bg-card" {...form.register("full_name")} />
                  {form.formState.errors.full_name ? (
                    <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
                  >
                    Email Address
                  </Label>
                  <Input id="email" type="email" className="h-10 border-border/80 bg-card" {...form.register("email")} />
                  {form.formState.errors.email ? (
                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label
                    htmlFor="phone"
                    className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
                  >
                    Phone Number
                  </Label>
                  <Input id="phone" className="h-10 border-border/80 bg-card" {...form.register("phone")} />
                  {form.formState.errors.phone ? (
                    <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="address"
                    className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
                  >
                    Current Address
                  </Label>
                  <Input id="address" className="h-10 border-border/80 bg-card" {...form.register("address")} />
                  {form.formState.errors.address ? (
                    <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <h2 className="font-heading text-xl italic text-primary">Professional Networks</h2>
                <span className="h-px flex-1 bg-border/70" />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label
                    htmlFor="github_label"
                    className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
                  >
                    GitHub Label
                  </Label>
                  <Input id="github_label" className="h-10 border-border/80 bg-card" {...form.register("github_label")} />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label
                    htmlFor="github_url"
                    className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
                  >
                    GitHub Link
                  </Label>
                  <Input
                    id="github_url"
                    className="h-10 border-border/80 bg-card"
                    placeholder="https://github.com/username"
                    {...form.register("github_url")}
                  />
                  {form.formState.errors.github_url ? (
                    <p className="text-xs text-destructive">{form.formState.errors.github_url.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-5 border-t border-border/70 pt-6 md:flex-row md:items-center md:justify-between">
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="size-3.5" />
                  Changes are reflected across resume drafting and profile-assisted autofill.
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => form.reset(lastLoadedValues)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="ce-primary-gradient rounded-lg text-primary-foreground"
                  >
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-xl border-border/70 bg-card/95 shadow-sm">
          <CardContent className="space-y-2 p-5">
            <span className="inline-flex rounded-lg bg-secondary p-2 text-primary">
              <ShieldCheck className="size-4" />
            </span>
            <h3 className="font-heading text-xl text-primary">Identity Snapshot</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Core profile values are available for resume generation and personal details autofill.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/95 shadow-sm">
          <CardContent className="space-y-2 p-5">
            <span className="inline-flex rounded-lg bg-secondary p-2 text-primary">
              <Sparkles className="size-4" />
            </span>
            <h3 className="font-heading text-xl text-primary">Draft Readiness</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              A complete profile helps generate cleaner resume drafts with fewer manual edits.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/95 shadow-sm">
          <CardContent className="space-y-2 p-5">
            <span className="inline-flex rounded-lg bg-secondary p-2 text-primary">
              <Info className="size-4" />
            </span>
            <h3 className="font-heading text-xl text-primary">Profile Status</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Keep your contact and location current so exported resumes stay accurate.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
