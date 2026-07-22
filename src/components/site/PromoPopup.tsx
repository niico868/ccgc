import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import popupAsset from "@/assets/sign-up-pop-up-background.png.asset.json";

const KEY = "cgcc.promo.lastShown";
const SIGNIN_KEY = "cgcc.signin.lastShown";
const DAY = 24 * 60 * 60 * 1000;

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<"signin" | "returning">("signin");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const signedIn = !!data.session;
      const last = Number(localStorage.getItem(signedIn ? KEY : SIGNIN_KEY) || 0);
      if (Date.now() - last > DAY) {
        setTimeout(() => {
          if (cancelled) return;
          setVariant(signedIn ? "returning" : "signin");
          setOpen(true);
        }, 4000);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const close = () => {
    localStorage.setItem(variant === "returning" ? KEY : SIGNIN_KEY, String(Date.now()));
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[30px] border border-white/60 bg-card shadow-[0_22px_48px_rgba(31,90,53,0.2)]">
        <img src={popupAsset.url} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,234,0.78),rgba(255,255,255,0.92))]" />
        <button onClick={close} aria-label="Close"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/75 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>

        <div className="relative p-7 sm:p-8">
          {variant === "signin" ? (
            <>
              <div className="inline-flex rounded-full border border-white/70 bg-white/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-leaf-deep shadow-sm">
                Loyalty &amp; fast checkout
              </div>
              <h3 className="mt-4 text-display text-3xl text-leaf-deep">Create an account for loyalty benefits and easier ordering.</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/80">
                Save your details once, keep your order history close, and make repeat orders feel much faster.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link to="/auth" search={{ mode: "signin" }} onClick={close} className="inline-flex h-11 items-center justify-center rounded-full border border-leaf-deep/20 bg-white/75 text-sm font-semibold text-leaf-deep hover:bg-white">Sign in</Link>
                <Link to="/auth" search={{ mode: "signup" }} onClick={close} className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#E76F51,#D84A2B)] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(231,111,81,0.25)]">Create account</Link>
                <button onClick={close} className="col-span-2 text-xs text-brown">Maybe later</button>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex rounded-full border border-white/70 bg-white/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-leaf-deep shadow-sm">
                Your account is ready
              </div>
              <h3 className="mt-4 text-display text-3xl text-leaf-deep">Order even easier next time.</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/80">
                You're signed in, so your next order can move faster through the site and checkout.
              </p>
              <div className="mt-6 flex gap-3">
                <Link to="/account" onClick={close} className="inline-flex h-11 items-center justify-center rounded-full bg-leaf-deep px-6 text-sm font-semibold text-cream">Go to account</Link>
                <button onClick={close} className="inline-flex h-11 items-center justify-center rounded-full border border-leaf-deep/20 bg-white/75 px-6 text-sm font-semibold text-leaf-deep">Close</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
