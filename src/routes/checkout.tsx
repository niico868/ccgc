import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Section } from "@/components/site/Section";
import { useBasket } from "@/lib/basket";
import { FOOD_MIN, DRINK_MIN } from "@/lib/menu-data";
import { waLink } from "@/lib/whatsapp";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { FirstTimerCard } from "@/components/site/OrderRules";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | Cathy's Clean Green Classics" }] }),
  component: Checkout,
});

function Checkout() {
  const { lines, subtotal, clear, minMet, foodOk, drinkOk, foodCount, drinkCount } = useBasket();
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

  useEffect(() => {
    if (lines.length === 0 && !done) navigate({ to: "/basket" });
  }, [lines.length, done, navigate]);

  const deliveryFee = form.fulfillment === "Delivery" ? 40 : 0;
  const total = subtotal + deliveryFee;
  const input = "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf-deep";

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value as never }));

  const orderLines = useMemo(() => lines.map((l) => {
    const parts = [`${l.quantity} × ${l.name}`];
    if (l.size) parts.push(`(${l.size})`);
    if (l.protein) parts.push(`(${l.protein})`);
    if (l.seafood) parts.push("[+$5 seafood]");
    if (l.preferences) parts.push(`[no: ${l.preferences}]`);
    parts.push(`— $${(l.quantity * l.unitPrice).toFixed(2)}`);
    return `• ${parts.join(" ")}`;
  }).join("\n"), [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minMet) {
      toast.error("Minimum order not yet met.");
      return;
    }
    const orderId = "CGCC-" + Date.now().toString(36).toUpperCase();

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

    // Open WhatsApp SYNCHRONOUSLY inside the click handler to avoid popup blockers.
    const url = `https://wa.me/18684884248?text=${encodeURIComponent(msg)}`;
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;

    // Then persist + cleanup
    setLastMsg(msg);
    const order = { orderId, ...form, lines, subtotal, deliveryFee, total, at: new Date().toISOString() };
    try {
      const existing = JSON.parse(localStorage.getItem("cgcc.orders") || "[]");
      existing.push(order);
      localStorage.setItem("cgcc.orders", JSON.stringify(existing));
    } catch {}

    // Save to backend if signed in (fire-and-forget)
    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          supabase.from("orders").insert({
            user_id: data.user.id,
            order_ref: orderId,
            customer_name: form.name,
            phone: form.phone,
            email: form.email || null,
            fulfillment: form.fulfillment,
            pickup_location: form.fulfillment === "Pickup" ? form.pickup : null,
            delivery_address: form.fulfillment === "Delivery" ? form.address : null,
            payment_method: form.payment,
            notes: form.notes || null,
            items: lines as unknown as object,
            subtotal,
            delivery_fee: deliveryFee,
            total,
          }).then(() => {});
        }
      });
    });

    setDone(true);
    clear();
  };

  if (done) {
    return (
      <Section className="py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-leaf-deep" />
        <h1 className="mt-4 text-display text-3xl text-leaf-deep">Order received.</h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          We've opened WhatsApp with your order details. <b>Press send</b> to confirm with Cathy.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <WhatsAppButton href={waLink(lastMsg)}>Confirm via WhatsApp</WhatsAppButton>
          <Link to="/" className="inline-flex h-11 items-center rounded-full border border-border px-7 text-sm font-semibold hover:border-leaf-deep hover:text-leaf-deep">
            Back home
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-12">
      <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">Confirm details, then we'll guide you to WhatsApp to lock it in.</p>

      {!minMet && (
        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-coral/40 bg-coral/10 p-4 text-sm">
          {!foodOk && (
            <div className="flex items-center gap-2 text-coral">
              <AlertCircle className="h-4 w-4" />
              You need at least {FOOD_MIN} meals to complete this order. You have {foodCount}.
            </div>
          )}
          {!drinkOk && (
            <div className="flex items-center gap-2 text-coral">
              <AlertCircle className="h-4 w-4" />
              You need at least {DRINK_MIN} drinks to complete this order. You have {drinkCount}.
            </div>
          )}
        </div>
      )}

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6 rounded-3xl border border-border bg-card p-7 shadow-card">
          <div>
            <div className="text-display text-lg text-leaf-deep">Your details</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input required placeholder="Full name" value={form.name} onChange={set("name")} className={input} />
              <input required placeholder="Contact number" type="tel" value={form.phone} onChange={set("phone")} className={input} />
              <input placeholder="Email (optional)" type="email" value={form.email} onChange={set("email")} className={`${input} sm:col-span-2`} />
            </div>
          </div>

          <div>
            <div className="text-display text-lg text-leaf-deep">Pickup or delivery</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <select value={form.fulfillment} onChange={set("fulfillment")} className={input}>
                <option>Delivery</option>
                <option>Pickup</option>
              </select>
              {form.fulfillment === "Pickup" ? (
                <select value={form.pickup} onChange={set("pickup")} className={input}>
                  <option>St Clair (11 AM to 1 PM)</option>
                  <option>Orange Grove, Tacarigua (2 PM to 6 PM)</option>
                </select>
              ) : (
                <input required placeholder="Delivery address" value={form.address} onChange={set("address")} className={input} />
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Limited delivery available. $40 flat fee.</p>
          </div>

          <div>
            <div className="text-display text-lg text-leaf-deep">Payment</div>
            <select value={form.payment} onChange={set("payment")} className={`${input} mt-3`}>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Online Card Payment</option>
            </select>
          </div>

          <div>
            <div className="text-display text-lg text-leaf-deep">Order notes</div>
            <textarea rows={4} placeholder="Allergies, drop-off instructions, preferences..." value={form.notes} onChange={set("notes")}
              className="mt-3 w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-leaf-deep" />
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="text-display text-lg text-leaf-deep">Order summary</div>
          <ul className="space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.lineId} className="flex justify-between gap-3">
                <span className="text-foreground/90">
                  {l.quantity} × {l.name}
                  {(l.size || l.protein) && (
                    <span className="block text-xs text-muted-foreground">{[l.size, l.protein].filter(Boolean).join(" · ")}</span>
                  )}
                  {l.seafood && <span className="block text-xs text-coral">Seafood +$5</span>}
                  {l.preferences && <span className="block text-xs text-muted-foreground">No: {l.preferences}</span>}
                </span>
                <span className="font-bold">${(l.quantity * l.unitPrice).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
            <div className="mt-2 flex justify-between text-base font-bold text-leaf-deep"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button
            type="submit"
            disabled={!minMet}
            className={`inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition ${
              minMet ? "bg-leaf-deep text-cream hover:opacity-90" : "cursor-not-allowed bg-muted-foreground/30 text-muted-foreground"
            }`}
          >
            {minMet ? "Confirm Order" : "Minimum not met"}
          </button>
          <p className="text-[11px] text-muted-foreground">After confirming, we'll open WhatsApp with your full order.</p>
        </aside>
      </form>

      <div className="mt-10"><FirstTimerCard /></div>
    </Section>
  );
}
