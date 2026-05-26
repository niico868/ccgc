import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Section } from "@/components/site/Section";
import { useBasket } from "@/lib/basket";
import { waLink } from "@/lib/whatsapp";
import { toast } from "sonner";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { FirstTimerCard } from "@/components/site/OrderRules";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | Fine Time for Cathy's Clean Green Classics" }] }),
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
    pickup: "St Clair (11 AM to 1 PM)",
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
    `• ${l.quantity} × ${l.name}${l.protein ? ` (${l.protein})` : ""}${l.preferences ? ` [no: ${l.preferences}]` : ""}`
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

Fulfillment: ${form.fulfillment}
Pickup Location: ${form.fulfillment === "Pickup" ? form.pickup : "-"}
Delivery Address: ${form.fulfillment === "Delivery" ? form.address : "-"}
Delivery Fee: $${deliveryFee}

Subtotal: $${subtotal.toFixed(2)}
Total: $${total.toFixed(2)}

Payment Method: ${form.payment}
Notes: ${form.notes || "-"}

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
        <h1 className="mt-4 text-display text-3xl font-extrabold">Order received.</h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          We've opened WhatsApp with your order details. <b>Press send</b> to confirm with Cathy and arrange payment.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={waLink(lastMsg)} target="_blank" rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-7 text-sm font-extrabold text-white hover:brightness-105">
            <MessageCircle className="h-4 w-4 fill-white" /> Confirm via WhatsApp
          </a>
          <Link to="/" className="inline-flex h-12 items-center rounded-full border border-border px-7 text-sm font-extrabold hover:border-leaf hover:text-leaf">
            Back home
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-12">
      <h1 className="text-display text-3xl font-extrabold lg:text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">Final step. Confirm details, then we'll guide you to WhatsApp to lock it in.</p>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6 rounded-3xl border border-border bg-card p-7 shadow-card">
          <div>
            <div className="text-display text-lg font-extrabold">Your details</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input required placeholder="Full name" value={form.name} onChange={set("name")} className={input} />
              <input required placeholder="Contact number" type="tel" value={form.phone} onChange={set("phone")} className={input} />
              <input placeholder="Email (optional)" type="email" value={form.email} onChange={set("email")} className={`${input} sm:col-span-2`} />
            </div>
          </div>

          <div>
            <div className="text-display text-lg font-extrabold">Pickup or delivery</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <select value={form.fulfillment} onChange={set("fulfillment")} className={input}>
                <option>Delivery</option>
                <option>Pickup</option>
              </select>
              {form.fulfillment === "Pickup" ? (
                <select value={form.pickup} onChange={set("pickup")} className={input}>
                  <option>St Clair (11 AM to 1 PM)</option>
                  <option>Trincity (2 PM to 6 PM)</option>
                  <option>Orange Grove, Tacarigua</option>
                </select>
              ) : (
                <input required placeholder="Delivery address" value={form.address} onChange={set("address")} className={input} />
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Limited delivery available. $40 flat fee added at checkout.</p>
          </div>

          <div>
            <div className="text-display text-lg font-extrabold">Payment</div>
            <select value={form.payment} onChange={set("payment")} className={`${input} mt-3`}>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Online Card Payment</option>
            </select>
            <p className="mt-2 text-xs text-muted-foreground">Payment: online or cash on delivery.</p>
          </div>

          <div>
            <div className="text-display text-lg font-extrabold">Order notes</div>
            <textarea rows={4} placeholder="Anything we should know? (allergies, drop-off instructions, ingredient preferences...)" value={form.notes} onChange={set("notes")}
              className="mt-3 w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-leaf" />
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="text-display text-lg font-extrabold">Order summary</div>
          <ul className="space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.lineId} className="flex justify-between gap-3">
                <span className="text-foreground/90">
                  {l.quantity} × {l.name}
                  {l.protein && <span className="block text-xs text-muted-foreground">{l.protein}</span>}
                  {l.preferences && <span className="block text-xs text-muted-foreground">No: {l.preferences}</span>}
                </span>
                <span className="font-extrabold">${(l.quantity * l.unitPrice).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
            <div className="mt-2 flex justify-between text-base font-extrabold text-leaf"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-leaf text-sm font-extrabold text-primary-foreground hover:opacity-90">
            Confirm Order
          </button>
          <p className="text-[11px] text-muted-foreground">After confirming, we'll open WhatsApp with your full order. Just press send.</p>
        </aside>
      </form>

      <div className="mt-10"><FirstTimerCard /></div>
    </Section>
  );
}
