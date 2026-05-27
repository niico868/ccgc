import { Clock, MapPin, Truck, CalendarDays } from "lucide-react";
import logo from "@/assets/logo.png";

export function OrderRules() {
  const items = [
    { icon: CalendarDays, title: "Lunches: Mon & Wed", desc: "Meal plan orders split across two days each week for better variety." },
    { icon: Clock, title: "Daily orders close 9 AM", desc: "Salads close 8 AM on salad days (Mon, Wed, Fri)." },
    { icon: Truck, title: "Delivery from 2 PM", desc: "Limited delivery. $40 flat fee." },
    { icon: MapPin, title: "Pickup windows", desc: "St Clair 11 AM – 1 PM · Trincity 2 PM – 6 PM · Orange Grove, Tacarigua." },
  ];
  return (
    <div className="rounded-3xl border border-border bg-cream p-6 lg:p-8">
      <div className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-leaf-deep">How ordering works</div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="flex gap-3">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-deep text-cream">
              <it.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-leaf-deep">{it.title}</div>
              <p className="text-xs text-muted-foreground">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FirstTimerCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-leaf-soft/30 bg-cream p-7 lg:p-9">
      <img src={logo} alt="" aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 opacity-[0.06]" />
      <div className="relative">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-soft">First time ordering?</div>
        <h3 className="mt-2 text-display text-2xl text-leaf-deep">Welcome to Cathy's Clean Green Classics.</h3>
        <div className="mt-4 grid gap-4 text-sm text-foreground/85 sm:grid-cols-2">
          <p>Salads are pre-ordered only and prepared Mondays, Wednesdays, and Fridays. Orders close 8 AM on salad days.</p>
          <p>Choose chicken, fish, shrimp, or vegan. Seafood adds $5 per meal.</p>
          <div>
            <div className="font-semibold text-leaf-deep">Pickup windows</div>
            <ul className="mt-1 space-y-0.5">
              <li>St Clair: 11 AM – 1 PM</li>
              <li>Trincity: 2 PM – 6 PM</li>
              <li>Orange Grove, Tacarigua</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-leaf-deep">Minimums</div>
            <ul className="mt-1 space-y-0.5">
              <li>Minimum 5 meals per food order.</li>
              <li>Minimum 6 drinks per juice order.</li>
              <li>Payment: online or cash on delivery.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
