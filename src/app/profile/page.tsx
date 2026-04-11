"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
  CardDescription,
  CardHeader,
  CardTitle,
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
      } catch (error) {
        if (!active) return;

        if (error instanceof ApiError && error.status === 404) {
          form.reset({
            ...emptyValues,
            email: me?.email ?? "",
          });
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
      toast.success("Profile saved.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-8 md:py-14">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-3xl">Profile</CardTitle>
          <CardDescription>Update your personal information for fast reuse.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {errorMessage ? (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" {...form.register("full_name")} />
                {form.formState.errors.full_name ? (
                  <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register("email")} />
                  {form.formState.errors.email ? (
                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...form.register("phone")} />
                  {form.formState.errors.phone ? (
                    <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...form.register("address")} />
                {form.formState.errors.address ? (
                  <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="github_label">GitHub Label</Label>
                  <Input id="github_label" {...form.register("github_label")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input id="github_url" placeholder="https://github.com/username" {...form.register("github_url")} />
                  {form.formState.errors.github_url ? (
                    <p className="text-xs text-destructive">{form.formState.errors.github_url.message}</p>
                  ) : null}
                </div>
              </div>

              <Button type="submit" size="lg" disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                Save Profile
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
