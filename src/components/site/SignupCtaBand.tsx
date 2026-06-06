import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { StickyNote } from "./StickyNote";

export function SignupCtaBand() {
  return (
    <section className="relative overflow-hidden px-4 py-10 lg:px-8 lg:py-14">
      <div className="mx-auto grid max-w-7xl gap-6 rounded-[30px] border border-white/50 bg-[linear-gradient(135deg,rgba(255,255,255,0.86)_0%,rgba(234,247,220,0.92)_42%,rgba(183,232,91,0.9)_100%)] p-6 shadow-[0_20px_44px_rgba(31,90,53,0.12)] backdrop-blur md:grid-cols-[1.3fr_0.7fr] md:items-center lg:p-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-leaf-deep shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-coral" /> Account perks
          </div>
          <h2 className="mt-4 text-display text-3xl text-leaf-deep lg:text-4xl">Create your account once. Order easier every time after.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/80 lg:text-base">
            Save your details, keep your order history close, and move through checkout faster the next time you need salads, meals, or juices.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#E76F51,#D84A2B)] px-7 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(231,111,81,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(231,111,81,0.28)]"
            >
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signin" }}
              className="inline-flex h-12 items-center justify-center rounded-full border border-leaf-deep/20 bg-white/70 px-7 text-sm font-semibold text-leaf-deep transition hover:border-leaf-deep/40 hover:bg-white"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <StickyNote className="rotate-[3deg] max-w-[17rem]">
            <span className="text-[16px] font-semibold">Sign in once. Order easier every time after.</span>
          </StickyNote>
        </div>
      </div>
    </section>
  );
}
