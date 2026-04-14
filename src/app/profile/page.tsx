"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  History,
  Info,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button, Card, Chip, Input, Label, Spinner } from "@heroui/react";
import { toast } from "sonner";
import {
  ApiError,
  getProfile,
  putProfile,
  type ProfilePayload,
} from "@/lib/api";
import { useAuth } from "@/components/app-shell";

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

const inputClassName = "rounded-xl";
const labelClassName =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

const profileInsights = [
  {
    title: "Identity Verified",
    description: "Last verified: Oct 24, 2023",
    icon: ShieldCheck,
  },
  {
    title: "Profile Visibility",
    description: "Currently set to: Private",
    icon: Eye,
  },
  {
    title: "Activity Log",
    description: "View revision history",
    icon: History,
  },
] as const;

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
      <section className="mb-8 max-w-4xl space-y-3">
        <Chip variant="soft" color="accent" className="w-fit">Account Settings</Chip>
        <h1 className="font-heading text-5xl leading-tight text-primary">Profile Management</h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-[15px]">
          Curate your professional identity. This information powers resume generation and editor autofill.
        </p>
      </section>

      {errorMessage ? (
        <Card className="mb-6 border border-destructive/40 bg-destructive/10">
          <Card.Content className="p-4 text-sm text-destructive">{errorMessage}</Card.Content>
        </Card>
      ) : null}

      <Card className="relative overflow-hidden border border-border/60 bg-card/95">
        <div className="pointer-events-none absolute -top-11 -right-9 opacity-10">
          <UserRound className="size-40 text-primary" />
        </div>

        <Card.Content className="relative p-6 md:p-8 lg:p-10">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner aria-label="Loading profile" color="accent" />
            </div>
          ) : (
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="border border-border/60 bg-card/95">
                <Card.Content className="space-y-6 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-heading text-2xl text-primary">Personal Details</h2>
                    <Chip size="sm" variant="soft" color="accent">Core Identity</Chip>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="full_name" className={labelClassName}>
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        className={inputClassName}
                        placeholder="e.g. Julian Montgomery Vance"
                        {...form.register("full_name")}
                      />
                      {form.formState.errors.full_name ? (
                        <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>
                      ) : null}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email" className={labelClassName}>
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className={inputClassName}
                        placeholder="julian.vance@executive.edu"
                        {...form.register("email")}
                      />
                      {form.formState.errors.email ? (
                        <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="phone" className={labelClassName}>
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        className={inputClassName}
                        placeholder="+1 (555) 012-3456"
                        {...form.register("phone")}
                      />
                      {form.formState.errors.phone ? (
                        <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                      ) : null}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address" className={labelClassName}>
                        Current Address
                      </Label>
                      <Input
                        id="address"
                        className={inputClassName}
                        placeholder="Manhattan, New York"
                        {...form.register("address")}
                      />
                      {form.formState.errors.address ? (
                        <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                      ) : null}
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card className="border border-border/60 bg-card/95">
                <Card.Content className="space-y-6 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-heading text-2xl text-primary">Professional Networks</h2>
                    <Chip size="sm" variant="soft" color="accent">Optional</Chip>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="github_label" className={labelClassName}>
                        GitHub Label
                      </Label>
                      <Input
                        id="github_label"
                        className={inputClassName}
                        placeholder="Engineering Portfolio"
                        {...form.register("github_label")}
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                      <Label htmlFor="github_url" className={labelClassName}>
                        GitHub Link
                      </Label>
                      <Input
                        id="github_url"
                        className={inputClassName}
                        placeholder="https://github.com/username"
                        {...form.register("github_url")}
                      />
                      {form.formState.errors.github_url ? (
                        <p className="text-xs text-destructive">{form.formState.errors.github_url.message}</p>
                      ) : null}
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <div className="flex flex-col gap-4 border-t border-border/55 pt-5 md:flex-row md:items-center md:justify-between">
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="size-3.5" />
                  All changes are reflected instantly across your active resumes.
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onPress={() => form.reset(lastLoadedValues)}
                    isDisabled={saving}
                    className="px-5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isDisabled={saving}
                    className="rounded-xl px-6"
                  >
                    {saving ? <Spinner aria-label="Saving profile" size="sm" /> : <Save className="size-4" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Card.Content>
      </Card>

      <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {profileInsights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border border-border/60 bg-secondary/45">
              <Card.Content className="space-y-3 p-5">
                <span className="inline-flex w-fit rounded-lg bg-background/75 p-2 text-primary">
                  <Icon className="size-4" />
                </span>
                <h3 className="font-heading text-xl leading-none text-primary">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card.Content>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
