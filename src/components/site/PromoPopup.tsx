import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

const KEY = "cgcc.promo.lastShown";
const DAY = 24 * 60 * 60 * 1000;

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const last = Number(localStorage.getItem(KEY) || 0);
    if (Date.now() - last > DAY) {
      const t = setTimeout(() => setOpen(true), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    localStorage.setItem(KEY, String(Date.now()));
    setOpen(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    // Persistence will be wired to Supabase later.
    const existing = JSON.parse(localStorage.getItem("cgcc.promo.submissions") || "[]");
    existing.push({ name, phone, email, at: new Date().toISOString() });
    localStorage.setItem("cgcc.promo.submissions", JSON.stringify(existing));
    toast.success("Welcome to the CGCC Healthy Community 🌿", {
      description: "We'll be in touch with your discount soon.",
    });
    close();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-soft">
        <button onClick={close} aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        <div className="gradient-leaf px-7 py-7 text-primary-foreground">
          <div className="text-xs uppercase tracking-[0.2em] opacity-80">Limited offer</div>
          <h3 className="mt-1 text-display text-2xl font-bold">Join the CGCC Healthy Community</h3>
          <p className="mt-2 text-sm text-primary-foreground/90">
            Get a discount on your first order. Or gift it to someone else.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3 p-7">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf" />
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" type="tel"
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" type="email"
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf" />
          <button type="submit"
            className="h-11 w-full rounded-xl bg-leaf text-sm font-semibold text-primary-foreground hover:opacity-90">
            Claim my discount
          </button>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            We use your contact details for discounts, sales, events, feedback, and order-related updates.
          </p>
        </form>
      </div>
    </div>
  );
}
