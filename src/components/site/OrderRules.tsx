import { Clock, MapPin, Truck, CalendarDays } from "lucide-react";
import logo from "@/assets/logo.png";

export function OrderRules() {
  const items = [
    { icon: CalendarDays, title: "Made fresh to order", desc: "Every lunch is prepared the day of fulfillment. No same-day orders." },
    { icon: Clock, title: "Orders close the day before", desc: "Place your order at least one day before the day you'd like to collect or have it delivered." },
    { icon: Truck, title: "Delivery from 2 PM", desc: "Limited delivery along the east-west corridor. Flat $40 fee." },
    { icon: MapPin, title: "Pickup windows", desc: "St Clair 11 AM – 1 PM · Orange Grove, Tacarigua 2 PM – 6 PM." },
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
              <p className="text-xs text-brown">{it.desc}</p>
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
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-soft">New to Cathy's?</div>
        <h3 className="mt-2 text-display text-2xl text-leaf-deep">Welcome — we're glad you're here.</h3>
        <div className="mt-4 grid gap-4 text-sm text-foreground/85 sm:grid-cols-2">
          <p className="text-brown">Every plate is made the day of fulfillment, so orders close the day before — no same-day requests.</p>
          <p className="text-brown">Choose chicken, fish, shrimp or vegan. Fish and shrimp are available on request.</p>
          <div>
            <div className="font-semibold text-leaf-deep">Pickup windows</div>
            <ul className="mt-1 space-y-0.5 text-brown">
              <li>St Clair: 11 AM – 1 PM</li>
              <li>Orange Grove, Tacarigua: 2 PM – 6 PM</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-leaf-deep">Minimums</div>
            <ul className="mt-1 space-y-0.5 text-brown">
              <li>5 meals per food order.</li>
              <li>6 drinks per juice order.</li>
              <li>Payment by bank transfer, online card, or cash on collection.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
