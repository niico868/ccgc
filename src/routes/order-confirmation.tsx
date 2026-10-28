import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { Section } from "@/components/site/Section";
import { fmt } from "@/lib/menu-data";
import { waLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { Confetti } from "@/components/site/Confetti";
import { fmtPoints, pointsFor } from "@/lib/loyalty";
import { z } from "zod";
import { privatePageHead } from "@/lib/private-page-head";


const search = z.object({ ref: z.string().optional() });

type StoredOrderItem = {
  name: string; quantity: number; unitPrice: number;
  category: "salad" | "meal" | "juice";
  protein?: string; size?: string; seafood?: boolean;
  preferences?: string; notes?: string;
};
type StoredOrder = {
  orderRef: string; idempotencyKey?: string;
  customerName: string; phone: string; email: string;
  fulfillment: "Delivery" | "Pickup";
  pickupLocation: string; deliveryAddress: string; deliveryZone: string;
  requiredFulfillmentDate?: string; fulfillmentWindow?: string;
  paymentMethod: string; notes: string; splitDelivery: boolean;
  items: StoredOrderItem[];
  subtotal: number; deliveryFee: number;
  discountCode: string | null; discountPercent: number; discountAmount: number;
  total: number; submittedAt: string;
};


export const Route = createFileRoute("/order-confirmation")({
  head: () => privatePageHead("Order Confirmed | Cathy's Clean Green Classics", "View your submitted order reference and fulfillment summary."),
  validateSearch: (raw) => search.parse(raw),
  component: Confirmation,
});

function Confirmation() {
  const { ref } = Route.useSearch();
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    if (!ref) return;
    try {
      const raw = sessionStorage.getItem(`order:${ref}`);
      if (raw) setOrder(JSON.parse(raw) as StoredOrder);
    } catch { /* ignore */ }
  }, [ref]);

  const submittedDate = useMemo(() => {
    if (!order?.submittedAt) return "";
    return new Date(order.submittedAt).toLocaleString("en-TT", {
      weekday: "long", month: "long", day: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  }, [order?.submittedAt]);

  const waMessage = useMemo(() => {
    if (!order) return "";
    const itemList = order.items.map((i) => {
      const extras: string[] = [];
      if (i.protein) extras.push(i.protein === "Vegan" ? "Vegetarian" : i.protein);
      if (i.seafood) extras.push("seafood");
      if (i.size) extras.push(i.size);
      if (i.preferences) extras.push(`no ${i.preferences}`);
      const suffix = extras.length ? ` (${extras.join(", ")})` : "";
      return `${i.quantity} ${i.name}${suffix}`;
    }).join(", ");
    const fulfil = order.fulfillment === "Delivery"
      ? `Delivery to ${order.deliveryAddress}${order.deliveryZone ? `, ${order.deliveryZone}` : ""}`
      : `Pickup at ${order.pickupLocation}`;
    return `Hi Cathy's Clean Green Classics. I submitted order ${order.orderRef} through the website and would like to double-check it with you. Order: ${itemList}. Fulfilment: ${fulfil}. Date: ${order.requiredFulfillmentDate ?? "To be confirmed"}. Time: ${order.fulfillmentWindow ?? "To be confirmed"}. Submitted: ${submittedDate}. Website subtotal: ${fmt(order.subtotal)}${order.deliveryFee ? `, delivery ${fmt(order.deliveryFee)}` : ""}. Website total: ${fmt(order.total)}.`;
  }, [order, submittedDate]);

  const earnedPoints = useMemo(() => {
    if (!order) return 0;
    let food = 0, drink = 0;
    for (const i of order.items) {
      if (i.category === "juice") drink += i.quantity;
      else food += i.quantity;
    }
    return pointsFor(food, drink);
  }, [order]);

  return (
    <Section className="py-14">
      <Confetti />
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-leaf-deep" />
        <h1 className="mt-4 text-display text-3xl text-leaf-deep lg:text-4xl">Order submitted successfully</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          We received your order. Cathy's team will review and confirm availability, fulfilment details and payment.
        </p>
        {ref && (
          <div className="mx-auto mt-6 inline-flex flex-col items-center gap-1 rounded-2xl border border-leaf-soft/40 bg-leaf-soft/10 px-6 py-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-leaf-soft">Your order reference</div>
            <div className="font-mono text-xl font-bold text-leaf-deep">{ref}</div>
          </div>
        )}
        {earnedPoints > 0 && (
          <div className="mx-auto mt-6 max-w-lg animate-scale-in rounded-2xl border border-leaf-soft/40 bg-[linear-gradient(135deg,#FFFDF5_0%,#F3FBE7_55%,#FFF8E3_100%)] px-6 py-5 shadow-card">
            <div className="flex items-center justify-center gap-2 text-display text-2xl text-leaf-deep">
              <Sparkles className="h-6 w-6 text-leaf-soft" aria-hidden />
              +{fmtPoints(earnedPoints)} Green Points
            </div>
            <p className="mt-2 text-sm text-brown">
              Beautiful. These points are banked to your account. Rewards are coming soon, so keep them growing.
            </p>
            <Link to="/account" className="mt-3 inline-block text-sm font-semibold text-leaf-deep underline">
              View your points
            </Link>
          </div>
        )}
        <p className="mt-3 inline-block rounded-full bg-citrus/60 px-3 py-1 text-xs font-semibold text-leaf-deep">
          Current status: Awaiting confirmation
        </p>
      </div>

      {order ? (
        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Detail label="Customer">{order.customerName}</Detail>
            <Detail label="Contact">{order.phone}{order.email ? ` · ${order.email}` : ""}</Detail>
            <Detail label="Fulfilment">
              {order.fulfillment}
              {order.fulfillment === "Delivery"
                ? ` · ${order.deliveryAddress}${order.deliveryZone ? ` (${order.deliveryZone})` : ""}`
                : ` · ${order.pickupLocation}`}
            </Detail>
            <Detail label="Requested date &amp; time">{order.requiredFulfillmentDate ?? "To be confirmed"} · {order.fulfillmentWindow ?? "To be confirmed"}</Detail>
            <Detail label="Payment method">{order.paymentMethod}</Detail>
            {order.notes && <Detail label="Notes">{order.notes}</Detail>}
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="text-display text-lg text-leaf-deep">Your items</div>
            <ul className="mt-3 space-y-3 text-sm">
              {order.items.map((i, idx) => {
                const extras: string[] = [];
                if (i.size) extras.push(i.size);
                if (i.protein) extras.push(i.protein === "Vegan" ? "Vegetarian" : i.protein);
                if (i.seafood) extras.push("Premium protein (+$5)");
                return (
                  <li key={idx} className="flex justify-between gap-3">
                    <div>
                      <div className="font-semibold text-foreground">{i.quantity} × {i.name}</div>
                      {extras.length > 0 && (
                        <div className="text-xs text-muted-foreground">{extras.join(" · ")}</div>
                      )}
                      {i.preferences && (
                        <div className="text-xs text-brown">Exclusions: {i.preferences}</div>
                      )}
                      {i.notes && <div className="text-xs text-muted-foreground">{i.notes}</div>}
                    </div>
                    <div className="whitespace-nowrap font-bold">{fmt(i.unitPrice * i.quantity)}</div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-5 space-y-1 border-t border-border pt-4 text-sm">
            <Row label="Subtotal">{fmt(order.subtotal)}</Row>
            {order.fulfillment === "Delivery" && <Row label="Delivery charge">{fmt(order.deliveryFee)}</Row>}
            {order.discountCode && (
              <Row label={`Discount (${order.discountCode} · ${order.discountPercent}%)`}>−{fmt(order.discountAmount)}</Row>
            )}
            <Row label="Website total" bold>{fmt(order.total)}</Row>
            <p className="pt-1 text-xs italic text-brown">
              Final total will be confirmed by Cathy's team once availability and fulfilment are reviewed.
            </p>
          </div>
        </div>
      ) : (
        <p className="mx-auto mt-8 max-w-lg text-center text-sm text-muted-foreground">
          Full order details aren't available in this browser session, but your order is safely saved under
          reference <b className="font-mono">{ref}</b>. You can view it any time from your account.
        </p>
      )}

      <div className="mx-auto mt-10 max-w-2xl rounded-3xl border-2 border-dashed border-leaf-soft/50 bg-leaf-soft/5 p-6 text-center">
        <div className="text-display text-lg text-leaf-deep">Optional: double-check on WhatsApp</div>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
          Your order has already been submitted. You can also send the details to WhatsApp so our team can
          double-check them with you.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {order && (
            <a
              href={waLink(waMessage)}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                if (order.orderRef && order.idempotencyKey) {
                  supabase.rpc(
                    "mark_order_whatsapp_doublecheck" as never,
                    { _order_ref: order.orderRef, _idem: order.idempotencyKey } as never,
                  ).then(() => { /* fire and forget */ });
                }
              }}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white shadow-md hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Send Order to WhatsApp for Double-Check
            </a>
          )}

          <Link
            to="/"
            className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-sm font-semibold hover:border-leaf-deep hover:text-leaf-deep"
          >
            Done, Return to Home
          </Link>
        </div>
        <div className="mt-3">
          <Link to="/account" className="text-xs text-leaf-deep underline hover:opacity-80">
            View my orders
          </Link>
        </div>
      </div>
    </Section>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm text-foreground">{children}</div>
    </div>
  );
}

function Row({ label, children, bold }: { label: string; children: React.ReactNode; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-bold text-leaf-deep" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={bold ? "" : "text-foreground"}>{children}</span>
    </div>
  );
}
