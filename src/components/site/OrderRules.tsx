import { Clock, MapPin, Truck, CalendarDays } from "lucide-react";

export function OrderRules() {
  const items = [
    { icon: CalendarDays, title: "Salads: Mon, Wed, Fri", desc: "Salads are pre-ordered only. Orders close 8 AM on salad days." },
    { icon: Clock, title: "Daily orders close 9 AM", desc: "Place orders the night before or first thing in the morning." },
    { icon: Truck, title: "Delivery from 2 PM", desc: "Limited delivery. Tell us your address at checkout." },
    { icon: MapPin, title: "Pickup windows", desc: "St Clair 11 AM to 1 PM. Trincity 2 PM to 6 PM. Orange Grove, Tacarigua." },
  ];
  return (
    <div className="rounded-3xl border border-border bg-secondary/60 p-6 lg:p-8">
      <div className="mb-5 text-xs font-extrabold uppercase tracking-[0.22em] text-leaf">How ordering works</div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="flex gap-3">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf text-primary-foreground">
              <it.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">{it.title}</div>
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
    <div className="rounded-3xl border-2 border-leaf/20 bg-cream p-7 lg:p-9">
      <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-tomato">First time ordering?</div>
      <h3 className="mt-2 text-display text-2xl font-extrabold text-leaf-deep">Welcome to Cathy's Clean Green Classics.</h3>
      <div className="mt-4 grid gap-4 text-sm text-foreground/85 sm:grid-cols-2">
        <p>We prepare fresh, made-to-order salads on Mondays, Wednesdays, and Fridays only. Salads are pre-ordered only and must be placed before 8 AM on salad days.</p>
        <p>Choose chicken, fish, shrimp, or fully vegan salads. Pick from our specialty salads or freestyle your own from the full ingredient list.</p>
        <div>
          <div className="font-semibold text-leaf-deep">Pickup &amp; preparation windows</div>
          <ul className="mt-1 space-y-0.5">
            <li>St Clair area: 11 AM to 1 PM</li>
            <li>Trincity area: 2 PM to 6 PM</li>
            <li>Second pickup: Orange Grove, Tacarigua</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-leaf-deep">Good to know</div>
          <ul className="mt-1 space-y-0.5">
            <li>Salads stay fresh up to 5 days.</li>
            <li>Our 5-meal combos can be delivered or picked up once or twice a week.</li>
            <li>Payment: online or cash on delivery.</li>
            <li>Please list any ingredients you do not like.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
