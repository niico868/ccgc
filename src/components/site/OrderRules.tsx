import { Clock, MapPin, Truck } from "lucide-react";

export function OrderRules() {
  const items = [
    { icon: Clock, title: "Orders close 9 AM", desc: "Place your order the day before or by 9 AM the morning of." },
    { icon: Truck, title: "Delivery from 2 PM", desc: "$40 flat fee. Arima → Port of Spain along the east-west corridor." },
    { icon: MapPin, title: "Two pickup spots", desc: "Sinclair, POS (9 AM–12 PM) · Lopinot (2 PM–5 PM)." },
  ];
  return (
    <div className="rounded-3xl border border-border bg-secondary/60 p-6 lg:p-8">
      <div className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-leaf">How ordering works</div>
      <div className="grid gap-5 sm:grid-cols-3">
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
