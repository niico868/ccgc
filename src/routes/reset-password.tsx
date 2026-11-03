import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { privatePageHead } from "@/lib/private-page-head";

export const Route = createFileRoute("/reset-password")({
  head: () => privatePageHead("Reset password | Cathy's Clean Green Classics", "Choose a new password for your Cathy's Clean Green Classics account."),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) { setReady(true); setChecked(true); }
    });
    // The reset link signs the customer in from the URL; give that a moment before calling it expired.
    const timer = window.setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      setReady(!!data.session);
      setChecked(true);
    }, 2000);
    return () => { sub.subscription.unsubscribe(); window.clearTimeout(timer); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (password !== confirm) { toast.error("Passwords don't match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message ?? "Couldn't update your password."); return; }
    toast.success("Your password has been updated.");
    navigate({ to: "/account" });
  };

  const input = "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf-deep";

  return (
    <Section className="py-12">
      <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-7 shadow-card lg:p-9">
        <h1 className="text-display text-2xl text-leaf-deep">Choose a new password</h1>
        {!checked ? (
          <p className="mt-3 text-sm text-brown">Checking your reset link…</p>
        ) : !ready ? (
          <>
            <p className="mt-3 text-sm text-brown">This reset link has expired or was already used. Please request a new one.</p>
            <Link to="/auth" search={{ mode: "signin" }} className="mt-4 inline-block text-sm font-semibold text-leaf-deep underline">Back to sign in</Link>
          </>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input required type="password" autoComplete="new-password" minLength={8} maxLength={72} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
            <input required type="password" autoComplete="new-password" minLength={8} maxLength={72} placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} />
            <button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-leaf-deep text-sm font-semibold text-cream hover:opacity-90 disabled:opacity-60">
              {loading ? "Please wait…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}
