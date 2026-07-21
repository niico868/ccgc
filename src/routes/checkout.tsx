import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Section } from "@/components/site/Section";
import { useBasket } from "@/lib/basket";
import { FOOD_MIN, DRINK_MIN, fmt } from "@/lib/menu-data";
import { waLink } from "@/lib/whatsapp";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, BadgePercent } from "lucide-react";
import { FirstTimerCard } from "@/components/site/OrderRules";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | Cathy's Clean Green Classics" }] }),
  component: Checkout,
});

type WelcomeCode = { id: string; code: string; percent: number };

function Checkout() {
  const { lines, subtotal, clear, minMet, foodOk, drinkOk, foodCount, drinkCount } = useBasket();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [lastMsg, setLastMsg] = useState("");
  const [lastOrderId, setLastOrderId] = useState("");
  const [lastLast4, setLastLast4] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [welcome, setWelcome] = useState<WelcomeCode | null>(null);
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    fulfillment: "Delivery" as "Delivery" | "Pickup",
    pickup: "St Clair (11 AM to 1 PM)",
    address: "",
    deliveryZone: "Curepe to Arima" as "Curepe to Arima" | "Trincity & environs",
    payment: "Bank Transfer" as "Cash" | "Bank Transfer",
    splitDelivery: false,
    splitNotes: "",
    notes: "",
  });

  useEffect(() => {
    if (lines.length === 0 && !done) navigate({ to: "/basket" });
  }, [lines.length, done, navigate]);

  // Autofill from profile + load first-order discount
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const [{ data: p }, { data: existingOrders }, { data: codes }] = await Promise.all([
        supabase.from("profiles").select("first_name,last_name,email,phone").eq("id", user.id).maybeSingle(),
        supabase.from("orders").select("id", { count: "exact" }).limit(1),
        supabase.from("discount_codes").select("id,code,percent,redeemed_at").is("redeemed_at", null).order("created_at", { ascending: true }).limit(1),
      ]);
      if (p) {
        const name = [p.first_name, p.last_name].filter(Boolean).join(" ").trim();
        setForm((f) => ({
          ...f,
          name: f.name || name,
          email: f.email || p.email || user.email || "",
          phone: f.phone || p.phone || "",
        }));
      }
      const isFirstOrder = !existingOrders || existingOrders.length === 0;
      if (isFirstOrder && codes && codes.length > 0) {
        setWelcome({ id: codes[0].id, code: codes[0].code, percent: codes[0].percent });
      }
    })();
  }, []);

  const deliveryFee = form.fulfillment === "Delivery"
    ? (form.deliveryZone === "Trincity & environs" ? 20 : 30)
    : 0;
  const discountAmount = welcome ? Math.round(subtotal * (welcome.percent / 100) * 100) / 100 : 0;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);
  const input = "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf-deep transition";

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: (e.target as HTMLInputElement).type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value as never }));

  const orderLines = useMemo(() => lines.map((l) => {
    const parts = [`${l.quantity} × ${l.name}`];
    if (l.size) parts.push(`(${l.size})`);
    if (l.protein) parts.push(`(${l.protein})`);
    if (l.seafood) parts.push("[seafood]");
    if (l.preferences) parts.push(`[no: ${l.preferences}]`);
    let line = `• ${parts.join(" ")}`;
    if (l.notes) line += `\n    ↳ ${l.notes}`;
    return line;
  }).join("\n"), [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minMet) {
      toast.error("Minimum order not yet met.");
      return;
    }
    const orderId = "CGCC-" + Date.now().toString(36).toUpperCase();
    const last4 = form.phone.replace(/\D/g, "").slice(-4);
    const trackUrl = typeof window !== "undefined"
      ? `${window.location.origin}/track?ref=${encodeURIComponent(orderId)}&p=${last4}`
      : `/track?ref=${orderId}&p=${last4}`;

    const discountLine = welcome
      ? `\nDiscount: ${welcome.code} (${welcome.percent}% off)`
      : "";

    const msg = `Hi Cathy, I'd like to confirm my order from Fine Time for Cathy's Clean Green Classics.

Order ID: ${orderId}
Track live: ${trackUrl}

Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email || "-"}

Order:
${orderLines}
${discountLine}
Fulfillment: ${form.fulfillment}${form.fulfillment === "Delivery" ? ` (${form.deliveryZone})` : ""}
Pickup Location: ${form.fulfillment === "Pickup" ? form.pickup : "-"}
Delivery Address: ${form.fulfillment === "Delivery" ? form.address : "-"}
${form.splitDelivery ? `Split bundle: ${form.splitNotes || "(see notes)"}` : ""}
Payment Method: ${form.payment}
Notes: ${form.notes || "-"}

Placed through the website. Please confirm the final total.`;

    const url = `https://wa.me/18684884248?text=${encodeURIComponent(msg)}`;
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;

    setLastMsg(msg);
    setLastOrderId(orderId);
    setLastLast4(last4);
    const order = { orderId, ...form, lines, subtotal, deliveryFee, discountAmount, discountCode: welcome?.code ?? null, total, at: new Date().toISOString() };
    try {
      const existing = JSON.parse(localStorage.getItem("cgcc.orders") || "[]");
      existing.push(order);
      localStorage.setItem("cgcc.orders", JSON.stringify(existing));
    } catch {}

    supabase.from("orders").insert({
      user_id: userId,
      order_ref: orderId,
      customer_name: form.name,
      phone: form.phone,
      email: form.email || null,
      fulfillment: form.fulfillment,
      pickup_location: form.fulfillment === "Pickup" ? form.pickup : null,
      delivery_address: form.fulfillment === "Delivery" ? form.address : null,
      payment_method: form.payment,
      notes: form.notes || null,
      items: lines as unknown as Json,
      subtotal,
      delivery_fee: deliveryFee,
      discount_code: welcome?.code ?? null,
      discount_amount: discountAmount,
      total,
    }).then(({ error }) => {
      if (error) console.error("Order insert failed", error);
      if (welcome && userId) {
        supabase.from("discount_codes").update({ redeemed_at: new Date().toISOString() }).eq("id", welcome.id).then(() => {});
      }
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
          We've opened WhatsApp with your order details. <b>Press send</b> so we can confirm and arrange payment.
        </p>

        <div className="mx-auto mt-6 max-w-md rounded-2xl border-2 border-citrus bg-[linear-gradient(90deg,rgba(246,233,107,0.35),rgba(167,217,72,0.15))] p-5 text-left shadow-card">
          <div className="text-xs uppercase tracking-wider text-brown">Your order ID</div>
          <div className="mt-1 font-mono text-xl font-bold text-leaf-deep">{lastOrderId}</div>
          <p className="mt-3 text-xs text-brown">No WhatsApp? Bookmark the tracking link below to see live updates as we prepare your order.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/track" search={{ ref: lastOrderId, p: lastLast4 }} className="inline-flex h-10 items-center rounded-full bg-leaf-deep px-5 text-xs font-semibold text-cream hover:opacity-90">
              Track my order
            </Link>
            <button
              onClick={() => {
                const url = `${window.location.origin}/track?ref=${encodeURIComponent(lastOrderId)}&p=${lastLast4}`;
                navigator.clipboard?.writeText(url).then(() => toast.success("Tracking link copied"));
              }}
              className="inline-flex h-10 items-center rounded-full border border-leaf-deep/30 bg-white px-5 text-xs font-semibold text-leaf-deep hover:bg-secondary"
            >
              Copy tracking link
            </button>
          </div>
        </div>

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
      <p className="mt-2 text-sm text-muted-foreground">Confirm your details and we'll send you over to WhatsApp to lock it in with us.</p>
      <p className="mt-1 text-sm text-muted-foreground">Your order details will be sent automatically. You can review the message before sending.</p>

      {welcome && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-citrus bg-[linear-gradient(90deg,rgba(246,233,107,0.4),rgba(167,217,72,0.18))] px-5 py-4 shadow-[0_10px_24px_rgba(31,90,53,0.12)]">
          <BadgePercent className="h-6 w-6 shrink-0 text-leaf-deep" />
          <div className="text-sm text-leaf-deep">
            <div className="font-bold">Welcome gift: <span className="font-mono">{welcome.code}</span> ({welcome.percent}% off) is applied to this order.</div>
            <div className="text-xs text-brown">One-time first-order discount, used on this purchase.</div>
          </div>
        </div>
      )}

      {!minMet && (
        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-coral/40 bg-coral/10 p-4 text-sm">
          {!foodOk && (
            <div className="flex items-center gap-2 text-coral">
              <AlertCircle className="h-4 w-4" />
              You need at least {FOOD_MIN} meals to complete this order. You currently have {foodCount}.
            </div>
          )}
          {!drinkOk && (
            <div className="flex items-center gap-2 text-coral">
              <AlertCircle className="h-4 w-4" />
              You need at least {DRINK_MIN} drinks to complete this order. You currently have {drinkCount}.
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
              {form.fulfillment === "Delivery" && (
                <select value={form.deliveryZone} onChange={set("deliveryZone")} className={`${input} sm:col-span-2`}>
                  <option>Curepe to Arima</option>
                  <option>Trincity &amp; environs</option>
                </select>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Delivery &amp; pickup windows: 12 PM – 5 PM. Curepe → Arima $30 · Trincity &amp; environs $20.</p>

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-secondary/40 p-3">
              <input type="checkbox" checked={form.splitDelivery} onChange={set("splitDelivery")} className="mt-1 h-4 w-4 accent-[var(--leaf-deep)]" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-leaf-deep">Split this bundle for freshness</div>
                <div className="text-xs text-muted-foreground">Take part of the order now and the rest on a later day. <span className="italic">Delivery rate will apply each time.</span></div>
                {form.splitDelivery && (
                  <textarea
                    value={form.splitNotes}
                    onChange={set("splitNotes")}
                    rows={2}
                    placeholder="Tell us how to split, e.g. 3 salads Monday, 2 meals Wednesday"
                    className="mt-2 w-full rounded-lg border border-border bg-background p-2 text-xs outline-none focus:border-leaf-deep"
                  />
                )}
              </div>
            </label>
          </div>

          <div>
            <div className="text-display text-lg text-leaf-deep">Payment</div>
            <select value={form.payment} onChange={set("payment")} className={`${input} mt-3`}>
              <option>Cash</option>
              <option>Bank Transfer</option>
            </select>
            {form.payment === "Bank Transfer" && (
              <div className="mt-3 rounded-xl border border-leaf-soft/40 bg-leaf-soft/10 p-4 text-sm text-leaf-deep animate-fade-in">
                <div className="font-semibold">Bank transfer details</div>
                <ul className="mt-2 space-y-1 text-xs text-foreground/80">
                  <li><b>Bank:</b> Republic Bank</li>
                  <li><b>Account name:</b> Cathy's Clean Green Classics</li>
                  <li><b>Account #:</b> (provided on WhatsApp)</li>
                  <li><b>Reference:</b> your order ID</li>
                </ul>
                <div className="mt-2 text-xs italic text-brown">Please send proof of payment on WhatsApp after submitting.</div>
              </div>
            )}
          </div>

          <div>
            <div className="text-display text-lg text-leaf-deep">Order notes</div>
            <textarea rows={4} placeholder="Allergies, drop-off instructions, anything else we should know…" value={form.notes} onChange={set("notes")}
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
                  {l.seafood && <span className="block text-xs text-brown">Seafood</span>}
                  {l.preferences && <span className="block text-xs text-muted-foreground">No: {l.preferences}</span>}
                  {l.notes && <span className="block text-xs text-muted-foreground">{l.notes}</span>}
                </span>
                <span className="font-bold">{fmt(l.unitPrice * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{form.fulfillment === "Delivery" ? fmt(deliveryFee) : "—"}</span></div>
            {welcome && (
              <div className="flex justify-between text-leaf-deep"><span>Discount ({welcome.percent}%)</span><span>−{fmt(discountAmount)}</span></div>
            )}
            <div className="mt-2 flex justify-between text-base font-bold text-leaf-deep"><span>Total</span><span>{fmt(total)}</span></div>
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
          <p className="text-[11px] text-muted-foreground">After confirming, we'll open WhatsApp with your full order so Cathy can confirm the final total.</p>
        </aside>
      </form>

      <div className="mt-10"><FirstTimerCard /></div>
    </Section>
  );
}
