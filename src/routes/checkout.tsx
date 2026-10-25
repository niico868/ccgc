import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Section } from "@/components/site/Section";
import { useBasket } from "@/lib/basket";
import { FOOD_MIN, DRINK_MIN, fmt } from "@/lib/menu-data";
import { saladDaysAhead, sameDayOpen } from "@/lib/fulfillment";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";
import { FirstTimerCard } from "@/components/site/OrderRules";
import { supabase } from "@/integrations/supabase/client";
import { OrderDatePicker } from "@/components/site/OrderDatePicker";
import { PICKUP_LOCATIONS, validateOrderAvailability } from "@/lib/menu-rotation";
import { submitOrder } from "@/lib/order-submit.functions";
import { normalizePhone, PHONE_HELP, PHONE_ERROR } from "@/lib/whatsapp";


export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | Cathy's Clean Green Classics" }] }),
  component: Checkout,
});

function Checkout() {
  const { lines, subtotal, clear, minMet, foodOk, drinkOk, foodCount, drinkCount, fulfillmentDate, unavailableLines } = useBasket();
  const navigate = useNavigate();
  const runSubmit = useServerFn(submitOrder);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const idemRef = useRef<string>(crypto.randomUUID());
  const saladDays = useMemo(() => saladDaysAhead(6), []);
  const sameDay = useMemo(() => sameDayOpen(), []);
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    fulfillment: "Delivery" as "Delivery" | "Pickup",
    pickup: "",
    address: "",
    deliveryZone: "Curepe to Arima" as "Curepe to Arima" | "Trincity & environs",
    payment: "Bank Transfer" as "Cash" | "Bank Transfer",
    recurring: "none" as "none" | "weekly" | "monthly",
    splitDelivery: false,
    splitNotes: "",
    notes: "",
    allergy: "",
    dropOff: "",
  });

  useEffect(() => {
    if (lines.length === 0 && !submitting) navigate({ to: "/basket" });
  }, [lines.length, submitting, navigate]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: p }] = await Promise.all([
        supabase.from("profiles").select("first_name,last_name,email,phone,default_address,default_delivery_zone,default_payment_method" as unknown as "*").eq("id", user.id).maybeSingle(),
      ]);
      if (p) {
        const prof = p as unknown as { first_name?: string; last_name?: string; email?: string; phone?: string; default_address?: string; default_delivery_zone?: string; default_payment_method?: string };
        const name = [prof.first_name, prof.last_name].filter(Boolean).join(" ").trim();
        setForm((f) => ({
          ...f,
          name: f.name || name,
          email: f.email || prof.email || user.email || "",
          phone: f.phone || prof.phone || "",
          address: f.address || prof.default_address || "",
          deliveryZone: (prof.default_delivery_zone as typeof f.deliveryZone) || f.deliveryZone,
          payment: (prof.default_payment_method as typeof f.payment) || f.payment,
        }));
      }

    })();
  }, []);

  const normalizedPhone = normalizePhone(form.phone);
  const phoneInvalid = !normalizedPhone;
  const deliveryFee = form.fulfillment === "Delivery"
    ? (form.deliveryZone === "Trincity & environs" ? 20 : 30)
    : 0;
  const discountAmount = 0;
  const total = Math.max(0, subtotal + deliveryFee);
  const input = "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf-deep transition";

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: (e.target as HTMLInputElement).type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value as never }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!minMet) {
      toast.error("Minimum order not yet met.");
      return;
    }
    if (!normalizedPhone) {
      setPhoneTouched(true);
      toast.error(PHONE_ERROR);
      return;
    }
    try { validateOrderAvailability(lines, fulfillmentDate); } catch (err) { toast.error(err instanceof Error ? err.message : "Choose a date."); return; }
    setSubmitting(true);
    setSubmitError(null);

    const { data: { session } } = await supabase.auth.getSession();

    const selectedDay = saladDays.find((d) => d.value === fulfillmentDate);
    const notesCombined = [
      form.notes?.trim(),
      selectedDay ? `Fulfillment day: ${selectedDay.label}` : "",
      form.splitDelivery ? `Split bundle: ${form.splitNotes?.trim() || "(see notes)"}` : "",
      form.fulfillment === "Delivery" ? `Zone: ${form.deliveryZone}` : "",
    ].filter(Boolean).join(" · ");


    try {
      const fulfillmentWindow = form.fulfillment === "Pickup"
        ? (form.pickup === PICKUP_LOCATIONS[0] ? "2 PM to 5 PM" : "11 AM to 1 PM")
        : "11 AM – about 2 PM";
      const result = await runSubmit({
        data: {
          idempotencyKey: idemRef.current,
          bearer: session?.access_token ?? null,
          customerName: form.name.trim(),
          phone: normalizedPhone!,
          email: form.email.trim() || undefined,
          fulfillment: form.fulfillment,
          pickupLocation: form.fulfillment === "Pickup" ? form.pickup : undefined,
          deliveryAddress: form.fulfillment === "Delivery" ? form.address.trim() : undefined,
          deliveryZone: form.fulfillment === "Delivery" ? form.deliveryZone : undefined,
          fulfillmentWindow,
          requiredFulfillmentDate: fulfillmentDate || undefined,
          splitForFreshness: form.splitDelivery,
          recurringFrequency: form.recurring,
          paymentMethod: form.payment,
          notes: notesCombined || undefined,
          allergyInfo: form.allergy.trim() || undefined,
          dropOffInstructions: form.dropOff.trim() || undefined,
          items: lines.map((l) => ({
            itemId: l.itemId,
            name: l.name,
            unitPrice: l.unitPrice,
            quantity: l.quantity,
            category: l.category,
            protein: l.protein,
            size: l.size,
            seafood: l.seafood,
            preferences: l.preferences,
            notes: l.notes,
          })),
          subtotal,
          deliveryFee,
          discountCode: null,
          discountAmount,
          total,
        },
      });

      // Save/refresh profile defaults for signed-in customers, so future
      // checkouts auto-fill their details. Fields remain editable.
      if (session?.user && result.isNew) {
        const [firstName, ...rest] = form.name.trim().split(/\s+/);
        const profileUpdate = {
          first_name: firstName || "",
          last_name: rest.join(" "),
          email: form.email.trim() || session.user.email || "",
          phone: normalizedPhone!,
          default_address: form.fulfillment === "Delivery" ? form.address.trim() : undefined,
          default_delivery_zone: form.fulfillment === "Delivery" ? form.deliveryZone : undefined,
          default_payment_method: form.payment,
        };
        Object.keys(profileUpdate).forEach((k) => {
          if ((profileUpdate as Record<string, unknown>)[k] === undefined) delete (profileUpdate as Record<string, unknown>)[k];
        });
        await supabase.from("profiles").update(profileUpdate as never).eq("id", session.user.id);
      }


      try {
        sessionStorage.setItem(
          `order:${result.orderRef}`,
          JSON.stringify({
            orderRef: result.orderRef,
            idempotencyKey: idemRef.current,

            customerName: form.name.trim(),
            phone: normalizedPhone!,
            email: form.email.trim(),
            fulfillment: form.fulfillment,
            pickupLocation: form.fulfillment === "Pickup" ? form.pickup : "",
            deliveryAddress: form.fulfillment === "Delivery" ? form.address.trim() : "",
            deliveryZone: form.fulfillment === "Delivery" ? form.deliveryZone : "",
            requiredFulfillmentDate: fulfillmentDate,
            fulfillmentWindow,
            paymentMethod: form.payment,
            notes: notesCombined,
            splitDelivery: form.splitDelivery,
            items: lines.map((l) => ({
              name: l.name, quantity: l.quantity, unitPrice: l.unitPrice,
              category: l.category, protein: l.protein, size: l.size,
              seafood: l.seafood, preferences: l.preferences, notes: l.notes,
            })),
            subtotal, deliveryFee,
            discountCode: null, discountPercent: 0,
            discountAmount, total,
            submittedAt: new Date().toISOString(),
          }),
        );
      } catch { /* ignore quota */ }

      clear();
      navigate({ to: "/order-confirmation", search: { ref: result.orderRef } });

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Order submission failed";
      setSubmitError(msg);
      toast.error("Your order could not be submitted. Nothing has been removed from your basket. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Section className="py-12">
      <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">Checkout</h1>
      <OrderDatePicker />
      <p className="mt-2 text-sm text-muted-foreground">Confirm your details and we'll send you back a confirmation with your order reference. Cathy's team will then follow up to confirm the final total and next steps.</p>

      <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${sameDay ? "border-leaf-soft/40 bg-leaf-soft/10 text-leaf-deep" : "border-brown/30 bg-brown/5 text-brown"}`}>
        {sameDay
          ? "Same-day orders are open until 8:00 AM Trinidad time. After that, please choose the next salad day."
          : "Same-day ordering has closed for today. Please choose the next available salad day below."}
      </div>


      {!minMet && (
        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-coral/40 bg-coral/10 p-4 text-sm">
          {!foodOk && (
            <div className="flex items-center gap-2 text-coral">
              <AlertCircle className="h-4 w-4" />
              You need at least {FOOD_MIN} food items to complete this order. Salads and healthy meals can be combined. You currently have {foodCount}.
            </div>
          )}
          {!drinkOk && (
            <div className="flex items-center gap-2 text-coral">
              <AlertCircle className="h-4 w-4" />
              You need at least {DRINK_MIN} drinks to complete this order. Juices and ginger shots can be combined. You currently have {drinkCount}.
            </div>
          )}
        </div>
      )}

      {submitError && (
        <div className="mt-6 flex items-start gap-2 rounded-2xl border border-coral/40 bg-coral/10 p-4 text-sm text-coral">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="font-semibold">Your order could not be submitted. Nothing has been removed from your basket. Please try again.</div>
            <div className="mt-1 text-xs opacity-80">Details: {submitError}</div>
          </div>
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
                <select required aria-label="Pickup location" value={form.pickup} onChange={set("pickup")} className={`${input} sm:col-span-2`}>
                  <option value="" disabled>Choose a pickup point</option>
                  {PICKUP_LOCATIONS.map((p) => <option key={p}>{p}</option>)}
                </select>
              ) : (
                <input required placeholder="Delivery address" value={form.address} onChange={set("address")} className={`${input} sm:col-span-2`} />
              )}
              {form.fulfillment === "Delivery" && (
                <select value={form.deliveryZone} onChange={set("deliveryZone")} className={`${input} sm:col-span-2`}>
                  <option>Curepe to Arima</option>
                  <option>Trincity &amp; environs</option>
                </select>
              )}
            </div>

            <p className="mt-2 text-xs text-muted-foreground">Order cutoff is 8:00 AM Trinidad time on Mon, Wed &amp; Fri. Delivery 11 AM – about 2 PM along the east west corridor. Pickup: Trincity 2–5 PM · St. Clair 11 AM–1 PM. Curepe to Arima $30. Trincity and environs $20.</p>


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
                  <li><b>Account #:</b> Shared on order confirmation</li>
                  <li><b>Reference:</b> your order ID</li>
                </ul>
                <div className="mt-2 text-xs italic text-brown">Please send proof of payment after we confirm your order.</div>
              </div>
            )}
          </div>

          <div>
            <div className="text-display text-lg text-leaf-deep">Make this a recurring order</div>
            <p className="mt-1 text-xs text-muted-foreground">Optional. Ask us to repeat this same order on a schedule. You are only billed for the order you are placing today. We contact you before each repeat to confirm it.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {([
                { v: "none", label: "One time only", hint: "No repeats" },
                { v: "weekly", label: "Repeat weekly", hint: "Same day each week" },
                { v: "monthly", label: "Repeat monthly", hint: "Same day each month" },
              ] as const).map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, recurring: opt.v }))}
                  aria-pressed={form.recurring === opt.v}
                  className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                    form.recurring === opt.v ? "border-leaf-deep bg-leaf-deep/10" : "border-border bg-background hover:border-leaf-deep"
                  }`}
                >
                  <div className="text-sm font-semibold text-leaf-deep">{opt.label}</div>
                  <div className="text-[11px] text-muted-foreground">{opt.hint}</div>
                </button>
              ))}
            </div>
            {form.recurring !== "none" && (
              <div className="mt-3 rounded-xl border border-leaf-soft/40 bg-leaf-soft/10 p-3 text-xs text-leaf-deep animate-fade-in">
                We will pencil in this order {form.recurring === "weekly" ? "every week" : "every month"} on the same fulfillment day. Only today's order is charged now. You can pause or stop at any time by messaging us.
              </div>
            )}
          </div>

          <div>
            <div className="text-display text-lg text-leaf-deep">Allergy information</div>
            <textarea rows={2} placeholder="Any allergies or dietary restrictions we should know…" value={form.allergy} onChange={set("allergy")}
              className="mt-3 w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-leaf-deep" />
          </div>

          {form.fulfillment === "Delivery" && (
            <div>
              <div className="text-display text-lg text-leaf-deep">Drop-off instructions</div>
              <textarea rows={2} placeholder="Gate code, landmarks, where to leave the order…" value={form.dropOff} onChange={set("dropOff")}
                className="mt-3 w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-leaf-deep" />
            </div>
          )}

          <div>
            <div className="text-display text-lg text-leaf-deep">Order notes</div>
            <textarea rows={3} placeholder="Anything else we should know…" value={form.notes} onChange={set("notes")}
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
                  {l.seafood && <span className="block text-xs text-brown">Premium protein</span>}
                  {l.preferences && <span className="block text-xs text-muted-foreground">No: {l.preferences}</span>}
                  {l.notes && <span className="block text-xs text-muted-foreground">{l.notes}</span>}
                </span>
                <span className="font-bold">{fmt(l.unitPrice * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{form.fulfillment === "Delivery" ? fmt(deliveryFee) : "included at pickup"}</span></div>
            <div className="mt-2 flex justify-between text-base font-bold text-leaf-deep"><span>Total</span><span>{fmt(total)}</span></div>
          </div>
          <button
            type="submit"
            disabled={!minMet || submitting}
            className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
              minMet && !submitting ? "bg-leaf-deep text-cream hover:opacity-90" : "cursor-not-allowed bg-muted-foreground/30 text-muted-foreground"
            }`}
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Submitting Order…</>
            ) : minMet ? "Submit Order" : unavailableLines.length ? "Meals unavailable for this week" : "Minimum not met"}
          </button>
          <p className="text-[11px] text-muted-foreground">Your order is saved as <b>Submitted, awaiting confirmation</b>. We'll message you back to confirm the final total and next steps.</p>
        </aside>
      </form>

      <div className="mt-10"><FirstTimerCard /></div>
    </Section>
  );
}

/** "November 2026" heading for an ISO (YYYY-MM-DD) fulfillment day. */
function monthLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1))
    .toLocaleDateString("en-TT", { timeZone: "UTC", month: "long", year: "numeric" });
}
