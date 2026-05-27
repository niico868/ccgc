import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const KEY = "cgcc.promo.lastShown";
const SIGNIN_KEY = "cgcc.signin.lastShown";
const DAY = 24 * 60 * 60 * 1000;

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<"signin" | "discount">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issued, setIssued] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const signedIn = !!data.session;
      const last = Number(localStorage.getItem(signedIn ? KEY : SIGNIN_KEY) || 0);
      if (Date.now() - last > DAY) {
        setTimeout(() => {
          if (cancelled) return;
          setVariant(signedIn ? "discount" : "signin");
          setOpen(true);
        }, 4000);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const close = () => {
    localStorage.setItem(variant === "discount" ? KEY : SIGNIN_KEY, String(Date.now()));
    setOpen(false);
  };

  const claim = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      toast.info("Create an account to save your discount.");
      close();
      return;
    }
    const code = `WELCOME-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const { error } = await supabase.from("discount_codes").insert({
      user_id: data.user.id, code, percent: 10, source: "signup_popup",
    });
    if (error) { toast.error("Could not save code."); return; }
    setIssued(code);
    toast.success("Discount saved to your account.");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-soft">
        <button onClick={close} aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>

        {variant === "signin" ? (
          <>
            <div className="bg-leaf-deep px-7 py-7 text-cream">
              <div className="text-xs uppercase tracking-[0.2em] opacity-80">Welcome</div>
              <h3 className="mt-1 text-display text-2xl">Sign in or create your account</h3>
              <p className="mt-2 text-sm text-cream/90">Save your order history and unlock signup discounts.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 p-7">
              <Link to="/auth" search={{ mode: "signin" }} onClick={close} className="h-11 inline-flex items-center justify-center rounded-xl border border-leaf-deep text-sm font-semibold text-leaf-deep hover:bg-secondary">Sign in</Link>
              <Link to="/auth" search={{ mode: "signup" }} onClick={close} className="h-11 inline-flex items-center justify-center rounded-xl bg-leaf-deep text-sm font-semibold text-cream hover:opacity-90">Create account</Link>
              <button onClick={close} className="col-span-2 text-xs text-brown">Maybe later</button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-leaf-deep px-7 py-7 text-cream">
              <div className="text-xs uppercase tracking-[0.2em] opacity-80">Limited offer</div>
              <h3 className="mt-1 text-display text-2xl">Claim your 10% discount</h3>
              <p className="mt-2 text-sm text-cream/90">Saved straight to your account.</p>
            </div>
            {issued ? (
              <div className="space-y-4 p-7 text-center">
                <p className="text-sm text-brown">Use this code at checkout:</p>
                <div className="rounded-2xl border border-leaf-soft/30 bg-leaf-soft/10 px-4 py-3 font-mono text-xl font-bold text-leaf-deep">{issued}</div>
                <button onClick={close} className="h-11 w-full rounded-xl bg-leaf-deep text-sm font-semibold text-cream">Done</button>
              </div>
            ) : (
              <form onSubmit={claim} className="space-y-3 p-7">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" type="email" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm" />
                <button type="submit" className="h-11 w-full rounded-xl bg-leaf-deep text-sm font-semibold text-cream hover:opacity-90">
                  Claim my discount
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
