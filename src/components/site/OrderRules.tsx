import { Clock, MapPin, Truck, CalendarDays } from "lucide-react";

export function OrderRules() {
  const items = [
    { icon: CalendarDays, title: "Made fresh to order", desc: "Every meal is prepared the day of fulfillment. No same-day orders." },
    { icon: Clock, title: "Mon & Wed orders close at 8 AM", desc: "Place your order the day before, by 8 AM on Monday and Wednesday for those days." },
    { icon: Truck, title: "Delivery & pickup 12 PM – 5 PM", desc: "Curepe to Arima $30 · Trincity & environs $20." },
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
      <div className="relative">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-soft">New to Cathy's?</div>
        <h3 className="mt-2 text-display text-2xl text-leaf-deep">Welcome, we're glad you're here.</h3>
        <div className="mt-4 grid gap-4 text-sm text-foreground/85 sm:grid-cols-2">
          <p className="text-brown">Every plate is made the day of fulfillment, so orders close the day before. No same-day requests. Mon &amp; Wed cutoffs are 8 AM.</p>
          <p className="text-brown">Choose chicken, fish, shrimp or vegan. Fish and shrimp are available on request.</p>
          <div>
            <div className="font-semibold text-leaf-deep">Pickup &amp; delivery</div>
            <ul className="mt-1 space-y-0.5 text-brown">
              <li>12 PM – 5 PM windows</li>
              <li>Curepe → Arima: $30 delivery</li>
              <li>Trincity &amp; environs: $20 delivery</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-leaf-deep">Minimums &amp; payment</div>
            <ul className="mt-1 space-y-0.5 text-brown">
              <li>5 salads/meals per food order.</li>
              <li>6 drinks per juice order.</li>
              <li>Payment by bank transfer or cash on collection.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
