import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { fmt } from "@/lib/menu-data";
import { CheckCircle2, Circle, Loader2, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track your order | Cathy's Clean Green Classics" },
      { name: "description", content: "See the live status of your Cathy's Clean Green Classics order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    ref: typeof s.ref === "string" ? s.ref : undefined,
    p: typeof s.p === "string" ? s.p : undefined,
  }),
  component: TrackPage,
});

type OrderStatus =
  | "received" | "confirmed" | "prepping" | "ready" | "out_for_delivery" | "completed" | "cancelled";

type OrderRow = {
  order_ref: string;
  customer_name: string;
  fulfillment: string;
  pickup_location: string | null;
  delivery_address: string | null;
  items: Array<{ name: string; quantity: number; size?: string; protein?: string }>;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total: number;
  status: OrderStatus;
  status_updated_at: string;
  admin_note: string | null;
  created_at: string;
};

const STAGES: { key: OrderStatus; label: string }[] = [
  { key: "received", label: "Received" },
  { key: "confirmed", label: "Confirmed" },
  { key: "prepping", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "completed", label: "Completed" },
];

function TrackPage() {
  const { ref: refParam, p: pParam } = Route.useSearch();
  const navigate = useNavigate();
  const [ref, setRef] = useState(refParam ?? "");
  const [last4, setLast4] = useState(pParam ?? "");
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const lookup = async (r: string, p: string) => {
    setLoading(true);
    setNotFound(false);
    const { data, error } = await supabase.rpc("get_order_status", {
      _order_ref: r.trim().toUpperCase(),
      _phone_last4: p.trim(),
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    const row = (data as OrderRow[] | null)?.[0] ?? null;
    if (!row) { setOrder(null); setNotFound(true); return; }
    setOrder(row);
  };

  // Auto-lookup when the URL carries both values
  useEffect(() => {
    if (refParam && pParam && !order) void lookup(refParam, pParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refParam, pParam]);

  // Live updates on the specific order row
  useEffect(() => {
    if (!order) return;
    const channel = supabase
      .channel(`order-${order.order_ref}`)
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `order_ref=eq.${order.order_ref}` },
        () => { void lookup(order.order_ref, last4); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.order_ref]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/track", search: { ref: ref.trim().toUpperCase(), p: last4.trim() } });
    void lookup(ref, last4);
  };

  const input = "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf-deep";

  return (
    <Section className="py-12">
      <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">Track your order</h1>
      <p className="mt-2 text-sm text-brown">Enter your order ID and the last 4 digits of the phone number on the order. Status updates appear live.</p>

      <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
        <input required placeholder="Order ID (e.g. CGCC-ABC123)" value={ref} onChange={(e) => setRef(e.target.value)} className={input} />
        <input required placeholder="Last 4 of phone" inputMode="numeric" pattern="\d{4}" maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, ""))} className={input} />
        <button type="submit" disabled={loading} className="inline-flex h-11 items-center justify-center rounded-xl bg-leaf-deep px-6 text-sm font-semibold text-cream hover:opacity-90 disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Look up"}
        </button>
      </form>

      {notFound && (
        <div className="mt-6 rounded-2xl border border-coral/40 bg-coral/10 p-4 text-sm text-coral">
          We couldn't find an order with that ID and phone. Double-check the details, or reach out on WhatsApp.
        </div>
      )}

      {order && <OrderView order={order} onRefresh={() => lookup(order.order_ref, last4)} />}
    </Section>
  );
}

function OrderView({ order, onRefresh }: { order: OrderRow; onRefresh: () => void }) {
  const currentIdx = useMemo(() => STAGES.findIndex((s) => s.key === order.status), [order.status]);
  const isCancelled = order.status === "cancelled";
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-3xl border border-border bg-card p-7 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-brown">Order ID</div>
            <div className="font-mono text-lg font-bold text-leaf-deep">{order.order_ref}</div>
          </div>
          <button onClick={onRefresh} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-leaf-deep hover:border-leaf-soft">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {isCancelled ? (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-coral/40 bg-coral/10 p-4 text-coral">
            <XCircle className="h-6 w-6" />
            <div>
              <div className="font-bold">Cancelled</div>
              {order.admin_note && <div className="text-xs">{order.admin_note}</div>}
            </div>
          </div>
        ) : (
          <ol className="mt-6 space-y-3">
            {STAGES.map((stage, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              return (
                <li key={stage.key} className="flex items-start gap-3">
                  {done ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-leaf-deep" />
                  ) : active ? (
                    <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-citrus" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <div className={`text-sm font-semibold ${active ? "text-leaf-deep" : done ? "text-foreground" : "text-muted-foreground"}`}>{stage.label}</div>
                    {active && (
                      <div className="text-xs text-brown">Updated {new Date(order.status_updated_at).toLocaleString()}</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {order.admin_note && !isCancelled && (
          <div className="mt-6 rounded-xl border border-leaf-soft/40 bg-leaf-soft/10 p-4 text-sm text-leaf-deep">
            <div className="font-semibold">A note from us</div>
            <div className="mt-1 text-xs">{order.admin_note}</div>
          </div>
        )}
      </div>

      <aside className="h-fit space-y-3 rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="text-display text-lg text-leaf-deep">Order summary</div>
        <div className="text-xs text-brown">For {order.customer_name} · {order.fulfillment}</div>
        {order.fulfillment === "Pickup" && order.pickup_location && (
          <div className="text-xs text-brown">Pickup: {order.pickup_location}</div>
        )}
        {order.fulfillment === "Delivery" && order.delivery_address && (
          <div className="text-xs text-brown">Delivery to: {order.delivery_address}</div>
        )}
        <ul className="space-y-1.5 border-t border-border pt-3 text-sm">
          {items.map((l, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span>{l.quantity} × {l.name}{(l.size || l.protein) ? <span className="block text-xs text-muted-foreground">{[l.size, l.protein].filter(Boolean).join(" · ")}</span> : null}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-border pt-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(Number(order.subtotal))}</span></div>
          {Number(order.delivery_fee) > 0 && (
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{fmt(Number(order.delivery_fee))}</span></div>
          )}
          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between text-leaf-deep"><span>Discount</span><span>−{fmt(Number(order.discount_amount))}</span></div>
          )}
          <div className="mt-2 flex justify-between text-base font-bold text-leaf-deep"><span>Total</span><span>{fmt(Number(order.total))}</span></div>
        </div>
      </aside>
    </div>
  );
}
