import { Clock, MapPin, Truck, CalendarDays } from "lucide-react";

export function OrderRules() {
  const items = [
    { icon: CalendarDays, title: "Made fresh to order", desc: "Every meal is prepared the day of fulfillment. Salad days are Monday and Wednesday." },
    { icon: Clock, title: "Cutoff 8 AM Mon & Wed", desc: "Same-day orders are open until 8:00 AM Trinidad time. After that, choose the next salad day." },
    { icon: Truck, title: "Delivery from 11 AM", desc: "East west corridor. Curepe to Arima $30. Trincity and environs $20." },
    { icon: MapPin, title: "Pickup, Orange Grove", desc: "Tacarigua, 11 AM to 6 PM on your fulfillment day." },
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
          <p className="text-brown">Every plate is made the day of fulfillment on Monday and Wednesday. Same-day orders are open until 8:00 AM Trinidad time.</p>
          <p className="text-brown">Choose chicken, beef, fish, shrimp or vegan. Beef, fish and shrimp add $5 per item.</p>
          <div>
            <div className="font-semibold text-leaf-deep">Pickup and delivery</div>
            <ul className="mt-1 space-y-0.5 text-brown">
              <li>Delivery from 11 AM, east west corridor</li>
              <li>Pickup at Orange Grove, Tacarigua, 11 AM to 6 PM</li>
              <li>Curepe to Arima: $30 delivery</li>
              <li>Trincity and environs: $20 delivery</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-leaf-deep">Minimums and payment</div>
            <ul className="mt-1 space-y-0.5 text-brown">
              <li>5 salads or meals per food order (mix and match).</li>
              <li>6 juices or shots per drink order (mix and match).</li>
              <li>Payment by bank transfer or cash on collection.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
