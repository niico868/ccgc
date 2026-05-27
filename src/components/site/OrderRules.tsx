import { Clock, MapPin, Truck, CalendarDays } from "lucide-react";
import logo from "@/assets/logo.png";

export function OrderRules() {
  const items = [
    { icon: CalendarDays, title: "All lunches made to order", desc: "No same-day orders. Orders apply to the next fulfillment day." },
    { icon: Clock, title: "Orders close the day prior", desc: "Place your order at least one day before your delivery or pickup day." },
    { icon: Truck, title: "Delivery from 2 PM", desc: "Limited delivery. $40 flat fee." },
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
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-soft">First time ordering?</div>
        <h3 className="mt-2 text-display text-2xl text-leaf-deep">Welcome to Cathy's Clean Green Classics.</h3>
        <div className="mt-4 grid gap-4 text-sm text-foreground/85 sm:grid-cols-2">
          <p className="text-brown">All lunches are made to order. Orders close the day before your fulfillment day — no same-day orders.</p>
          <p className="text-brown">Choose chicken, fish, shrimp, or vegan. Seafood adds $5 per meal.</p>
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
