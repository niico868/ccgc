import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Section } from "@/components/site/Section";
import { useBasket } from "@/lib/basket";
import { waLink } from "@/lib/whatsapp";
import { toast } from "sonner";
import { CheckCircle2, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Fine Time for Cathy's" }] }),
  component: Checkout,
});

function Checkout() {
  const { lines, subtotal, clear } = useBasket();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [lastMsg, setLastMsg] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    fulfillment: "Delivery" as "Delivery" | "Pickup",
    pickup: "Sinclair, POS (9 AM–12 PM)",
    address: "",
    payment: "Bank Transfer" as "Cash" | "Bank Transfer" | "Online Card Payment",
    notes: "",
  });

  const deliveryFee = form.fulfillment === "Delivery" ? 40 : 0;
  const total = subtotal + deliveryFee;
  const input = "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf";

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value as never }));

  const orderLines = useMemo(() => lines.map((l) =>
    `• ${l.quantity} × ${l.name}${l.protein ? ` (${l.protein})` : ""}${l.juiceOption ? ` (${l.juiceOption})` : ""}${l.addons?.length ? ` + ${l.addons.join(", ")}` : ""}`
  ).join("\n"), [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) {
      toast.error("Your basket is empty.");
      navigate({ to: "/salads" });
      return;
    }
    const orderId = "CGCC-" + Date.now().toString(36).toUpperCase();
    const order = { orderId, ...form, lines, subtotal, deliveryFee, total, at: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem("cgcc.orders") || "[]");
    existing.push(order);
    localStorage.setItem("cgcc.orders", JSON.stringify(existing));

    const msg = `Hi, I'd like to confirm my order from Fine Time for Cathy's Clean Green Classics.

Order ID: ${orderId}

Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email || "-"}

Order:
${orderLines}

Fulfillment:
Pickup or Delivery: ${form.fulfillment}
Pickup Location: ${form.fulfillment === "Pickup" ? form.pickup : "-"}
Delivery Address: ${form.fulfillment === "Delivery" ? form.address : "-"}
Delivery Fee: $${deliveryFee}

Subtotal: $${subtotal.toFixed(2)}
Total: $${total.toFixed(2)}

Payment Method: ${form.payment}
Customer Notes: ${form.notes || "-"}

Order placed through the website.`;

    setLastMsg(msg);
    setDone(true);
    clear();
    setTimeout(() => window.open(waLink(msg), "_blank"), 600);
  };

  if (done) {
    return (
      <Section className="py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-leaf" />
        <h1 className="mt-4 text-display text-3xl font-bold">Order received!</h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          We've opened WhatsApp with your order details. <b>Press send</b> to confirm with Cathy and arrange payment.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={waLink(lastMsg)} target="_blank" rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-leaf px-7 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <MessageCircle className="h-4 w-4" /> Confirm via WhatsApp
          </a>
          <Link to="/" className="inline-flex h-12 items-center rounded-full border border-border px-7 text-sm font-semibold hover:border-leaf hover:text-leaf">
            Back home
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-14">
      <h1 className="text-display text-3xl font-bold lg:text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">Final step. Confirm details, then we'll guide you to WhatsApp to lock it in.</p>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6 rounded-3xl border border-border bg-card p-7 shadow-card">
          <div>
            <div className="text-display text-lg font-semibold">Your details</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input required placeholder="Full name" value={form.name} onChange={set("name")} className={input} />
              <input required placeholder="Contact number" type="tel" value={form.phone} onChange={set("phone")} className={input} />
              <input placeholder="Email (optional)" type="email" value={form.email} onChange={set("email")} className={`${input} sm:col-span-2`} />
            </div>
          </div>

          <div>
            <div className="text-display text-lg font-semibold">Pickup or delivery</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <select value={form.fulfillment} onChange={set("fulfillment")} className={input}>
                <option>Delivery</option>
                <option>Pickup</option>
              </select>
              {form.fulfillment === "Pickup" ? (
                <select value={form.pickup} onChange={set("pickup")} className={input}>
                  <option>Sinclair, POS (9 AM–12 PM)</option>
                  <option>Lopinot (2 PM–5 PM)</option>
                </select>
              ) : (
                <input required placeholder="Delivery address" value={form.address} onChange={set("address")} className={input} />
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Delivery is $40 flat along the east-west corridor (Arima → Port of Spain).</p>
          </div>

          <div>
            <div className="text-display text-lg font-semibold">Payment</div>
            <select value={form.payment} onChange={set("payment")} className={`${input} mt-3`}>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Online Card Payment</option>
            </select>
          </div>

          <div>
            <div className="text-display text-lg font-semibold">Notes</div>
            <textarea rows={4} placeholder="Anything we should know?" value={form.notes} onChange={set("notes")}
              className="mt-3 w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-leaf" />
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="text-display text-lg font-semibold">Order summary</div>
          <ul className="space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.lineId} className="flex justify-between gap-3">
                <span className="text-foreground/90">{l.quantity} × {l.name}</span>
                <span className="font-semibold">${(l.quantity * l.unitPrice).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
            <div className="mt-2 flex justify-between text-base font-bold text-leaf"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-leaf text-sm font-semibold text-primary-foreground hover:opacity-90">
            Confirm Order
          </button>
          <p className="text-[11px] text-muted-foreground">After confirming, we'll open WhatsApp with your full order — just press send.</p>
        </aside>
      </form>
    </Section>
  );
}
