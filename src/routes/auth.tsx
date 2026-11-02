import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { privatePageHead } from "@/lib/private-page-head";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode === "signup" ? "signup" : "signin") as "signin" | "signup",
  }),
  head: () => privatePageHead("Sign in | Cathy's Clean Green Classics", "Sign in or create your Cathy's Clean Green Classics account to keep your order history."),
  component: AuthPage,
});

const signupSchema = z.object({
  first_name: z.string().min(1).max(80),
  last_name: z.string().min(1).max(80),
  email: z.string().email().max(255),
  phone: z.string().min(7).max(30),
  password: z.string().min(8).max(72),
  confirm: z.string(),
  marketing_opt_in: z.boolean(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

function AuthPage() {
  const { mode } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const isSignup = mode === "signup";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    password: "", confirm: "", marketing_opt_in: true, stay: true,
  });
  const set = <K extends keyof typeof form>(k: K) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const input = "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf-deep";

  const google = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/account` },
    });
    if (error) { toast.error(error.message ?? "Google sign-in failed"); setLoading(false); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        const parsed = signupSchema.parse(form);
        const { error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              first_name: parsed.first_name,
              last_name: parsed.last_name,
              phone: parsed.phone,
              marketing_opt_in: parsed.marketing_opt_in,
            },
          },
        });
        if (error) throw error;
        toast.success("Welcome! Your account is ready.");
        navigate({ to: "/account" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        toast.success("Signed in.");
        navigate({ to: "/account" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <Section className="py-12">
      <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-7 shadow-card lg:p-9">
        <div className="mb-2 flex gap-2 rounded-full bg-secondary p-1">
          <Link to="/auth" search={{ mode: "signin" }} className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold ${!isSignup ? "bg-leaf-deep text-cream" : "text-leaf-deep"}`}>Sign in</Link>
          <Link to="/auth" search={{ mode: "signup" }} className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold ${isSignup ? "bg-leaf-deep text-cream" : "text-leaf-deep"}`}>Create account</Link>
        </div>

        <h1 className="mt-5 text-display text-2xl text-leaf-deep">{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-1 text-sm text-brown">Save your order history and reorder faster.</p>

        <button onClick={google} disabled={loading} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold hover:bg-secondary">
          Continue with Google
        </button>
        <div className="my-4 text-center text-xs text-muted-foreground">or with email</div>

        <form onSubmit={submit} className="space-y-3">
          {isSignup && (
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="First name" value={form.first_name} onChange={set("first_name")} className={input} />
              <input required placeholder="Last name" value={form.last_name} onChange={set("last_name")} className={input} />
            </div>
          )}
          <input required type="email" placeholder="Email" value={form.email} onChange={set("email")} className={input} />
          {isSignup && (
            <input required type="tel" placeholder="Phone" value={form.phone} onChange={set("phone")} className={input} />
          )}
          <input required type="password" placeholder="Password" value={form.password} onChange={set("password")} className={input} />
          {isSignup && (
            <input required type="password" placeholder="Confirm password" value={form.confirm} onChange={set("confirm")} className={input} />
          )}
          {isSignup && (
            <label className="flex items-start gap-2 text-xs text-brown">
              <input type="checkbox" checked={form.marketing_opt_in} onChange={set("marketing_opt_in")} className="mt-0.5" />
              Keep me up to date on news and exclusive offers via email
            </label>
          )}
          <label className="flex items-center gap-2 text-xs text-brown">
            <input type="checkbox" checked={form.stay} onChange={set("stay")} />
            Stay signed in
          </label>
          <button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-leaf-deep text-sm font-semibold text-cream hover:opacity-90 disabled:opacity-60">
            {loading ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
          </button>
        </form>
      </div>
    </Section>
  );
}
