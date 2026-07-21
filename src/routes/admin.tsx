import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { Star, Trash2, Check, EyeOff, Save, MessageCircle } from "lucide-react";
import { fmt } from "@/lib/menu-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | Cathy's Clean Green Classics" }] }),
  component: AdminPage,
});

type Review = {
  id: string; author_name: string; rating: number; body: string;
  status: "pending" | "approved" | "hidden"; created_at: string;
};

const ORDER_STATUSES = ["received", "confirmed", "prepping", "ready", "out_for_delivery", "completed", "cancelled"] as const;
type OrderStatus = typeof ORDER_STATUSES[number];

const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Submitted",
  confirmed: "Confirmed",
  prepping: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

type OrderItem = {
  name: string; quantity: number; unitPrice?: number;
  protein?: string; seafood?: boolean; size?: string;
  preferences?: string; notes?: string;
};

type Order = {
  id: string;
  order_ref: string;
  customer_name: string | null;
  phone: string | null;
  email: string | null;
  fulfillment: string | null;
  pickup_location: string | null;
  delivery_address: string | null;
  payment_method: string | null;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount_code: string | null;
  discount_amount: number;
  total: number;
  status: OrderStatus;
  status_updated_at: string;
  admin_note: string | null;
  created_at: string;
  used_whatsapp_doublecheck: boolean;
  whatsapp_doublecheck_at: string | null;
};

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"orders" | "reviews">("orders");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/auth", search: { mode: "signin" } }); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
      setIsAdmin((roles ?? []).length > 0);
      setLoading(false);
    })();
  }, [navigate]);

  if (loading) return <Section className="py-20 text-center text-brown">Loading…</Section>;
  if (!isAdmin) return (
    <Section className="py-20 text-center">
      <h1 className="text-display text-3xl text-leaf-deep">Admin access only</h1>
      <p className="mt-2 text-sm text-brown">You don't have permission to view this page.</p>
    </Section>
  );

  return (
    <Section className="py-12 space-y-6">
      <div>
        <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">Admin</h1>
        <p className="text-sm text-brown">Manage incoming orders and customer reviews.</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {(["orders", "reviews"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-1.5 text-sm font-semibold capitalize transition ${
              tab === t ? "bg-leaf-deep text-cream" : "border border-border bg-white text-leaf-deep hover:border-leaf-soft"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "orders" ? <OrdersPanel /> : <ReviewsPanel />}
    </Section>
  );
}

function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"active" | OrderStatus | "all">("active");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) toast.error(error.message);
    setOrders((data ?? []) as unknown as Order[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (o: Order, status: OrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", o.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Marked as ${STATUS_LABEL[status]}`);
    await load();
  };

  const saveNote = async (o: Order, note: string) => {
    const { error } = await supabase.from("orders").update({ admin_note: note }).eq("id", o.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Note saved");
    await load();
  };

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "active") return !["completed", "cancelled"].includes(o.status);
    return o.status === filter;
  });

  if (loading) return <p className="text-sm text-brown">Loading orders…</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["active", ...ORDER_STATUSES, "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition ${
              filter === f ? "border-leaf-deep bg-leaf-deep text-cream" : "border-border bg-white text-leaf-deep hover:border-leaf-soft"
            }`}
          >
            {f === "active" || f === "all" ? f : STATUS_LABEL[f as OrderStatus]}
            <span className="ml-1 opacity-70">
              ({orders.filter((o) =>
                f === "all" ? true :
                f === "active" ? !["completed", "cancelled"].includes(o.status) :
                o.status === f
              ).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-brown">No orders in this view.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((o) => {
            const isOpen = expanded === o.id;
            const requested = new Date(o.created_at).toLocaleString("en-TT", {
              month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
            });
            return (
              <li key={o.id} className="rounded-2xl border border-border bg-card shadow-card">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : o.id)}
                  className="grid w-full grid-cols-2 gap-2 p-4 text-left lg:grid-cols-6 lg:items-center"
                >
                  <div>
                    <div className="font-mono text-sm font-bold text-leaf-deep">{o.order_ref}</div>
                    <div className="text-[11px] text-muted-foreground">{requested}</div>
                  </div>
                  <div className="text-sm font-semibold">{o.customer_name || "—"}</div>
                  <div className="text-sm">
                    <div>{o.fulfillment || "—"}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {o.fulfillment === "Delivery" ? o.delivery_address : o.pickup_location}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-leaf-deep">{fmt(Number(o.total) || 0)}</div>
                  <div>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                      o.status === "completed" ? "bg-leaf-soft/25 text-leaf-deep" :
                      o.status === "cancelled" ? "bg-muted text-muted-foreground" :
                      o.status === "received" ? "bg-citrus/40 text-leaf-deep" :
                      "bg-leaf-soft/15 text-leaf-deep"
                    }`}>{STATUS_LABEL[o.status]}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    {o.used_whatsapp_doublecheck && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/15 px-2 py-0.5 font-semibold text-[#128C7E]">
                        <MessageCircle className="h-3 w-3" /> WhatsApp double-check
                      </span>
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t border-border p-5">
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <div><b>Contact:</b> {o.phone}{o.email ? ` · ${o.email}` : ""}</div>
                      <div><b>Payment:</b> {o.payment_method || "—"}</div>
                      {o.notes && <div className="sm:col-span-2"><b>Notes:</b> {o.notes}</div>}
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</div>
                      <ul className="mt-2 space-y-1 text-sm">
                        {(o.items || []).map((it, i) => {
                          const extras = [it.size, it.protein, it.seafood ? "Seafood" : null].filter(Boolean).join(" · ");
                          return (
                            <li key={i}>
                              {it.quantity} × {it.name}
                              {extras && <span className="text-xs text-muted-foreground"> ({extras})</span>}
                              {it.preferences && <span className="text-xs text-brown"> — no {it.preferences}</span>}
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Subtotal {fmt(Number(o.subtotal) || 0)} · Delivery {fmt(Number(o.delivery_fee) || 0)}
                        {o.discount_code && ` · Discount ${o.discount_code} −${fmt(Number(o.discount_amount) || 0)}`}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Move status</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {ORDER_STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(o, s)}
                            disabled={o.status === s}
                            className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                              o.status === s
                                ? "border-leaf-deep bg-leaf-deep text-cream"
                                : "border-border bg-white text-leaf-deep hover:border-leaf-soft"
                            }`}
                          >
                            {STATUS_LABEL[s]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <AdminNoteEditor initial={o.admin_note ?? ""} onSave={(n) => saveNote(o, n)} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function AdminNoteEditor({ initial, onSave }: { initial: string; onSave: (n: string) => void }) {
  const [val, setVal] = useState(initial);
  const dirty = val !== initial;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Internal note</div>
      <textarea
        value={val} onChange={(e) => setVal(e.target.value)} rows={2}
        placeholder="Anything the team should know…"
        className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-leaf-deep"
      />
      {dirty && (
        <button
          onClick={() => onSave(val)}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-leaf-deep px-4 py-1.5 text-xs font-semibold text-cream hover:opacity-90"
        >
          <Save className="h-3.5 w-3.5" /> Save note
        </button>
      )}
    </div>
  );
}

function ReviewsPanel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "hidden">("pending");
  const [drafts, setDrafts] = useState<Record<string, { body: string; rating: number }>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("id,author_name,rating,body,status,created_at").order("created_at", { ascending: false });
    setReviews((data ?? []) as Review[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setDraft = (id: string, patch: Partial<{ body: string; rating: number }>) =>
    setDrafts((d) => ({ ...d, [id]: { body: patch.body ?? d[id]?.body ?? "", rating: patch.rating ?? d[id]?.rating ?? 5 } }));

  const update = async (r: Review, patch: Partial<Review>) => {
    const { error } = await supabase.from("reviews").update(patch).eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    await load();
  };

  if (loading) return <p className="text-sm text-brown">Loading reviews…</p>;

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["pending", "approved", "hidden", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              filter === f ? "border-leaf-deep bg-leaf-deep text-cream" : "border-border bg-white text-leaf-deep hover:border-leaf-soft"
            }`}
          >
            {f} {f !== "all" && <span className="ml-1 opacity-70">({reviews.filter((r) => r.status === f).length})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-brown">No reviews in this view.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => {
            const draft = drafts[r.id] ?? { body: r.body, rating: r.rating };
            const dirty = draft.body !== r.body || draft.rating !== r.rating;
            return (
              <li key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-leaf-deep">{r.author_name}</div>
                    <div className="text-xs text-brown">{new Date(r.created_at).toLocaleString()}</div>
                  </div>
                  <span className={`rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                    r.status === "approved" ? "bg-leaf-soft/20 text-leaf-deep" :
                    r.status === "hidden" ? "bg-muted text-muted-foreground" :
                    "bg-citrus/30 text-leaf-deep"
                  }`}>{r.status}</span>
                </div>

                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setDraft(r.id, { rating: n })} aria-label={`${n} stars`}>
                      <Star className={`h-5 w-5 ${n <= draft.rating ? "fill-citrus text-citrus" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={draft.body}
                  onChange={(e) => setDraft(r.id, { body: e.target.value })}
                  className="mt-3 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-leaf-deep"
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  {dirty && (
                    <button onClick={() => update(r, { body: draft.body, rating: draft.rating })} className="inline-flex items-center gap-1.5 rounded-full bg-leaf-deep px-4 py-1.5 text-xs font-semibold text-cream hover:opacity-90">
                      <Save className="h-3.5 w-3.5" /> Save edits
                    </button>
                  )}
                  {r.status !== "approved" && (
                    <button onClick={() => update(r, { status: "approved" })} className="inline-flex items-center gap-1.5 rounded-full border border-leaf-deep/30 bg-white px-4 py-1.5 text-xs font-semibold text-leaf-deep hover:bg-secondary">
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  {r.status !== "hidden" && (
                    <button onClick={() => update(r, { status: "hidden" })} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-foreground hover:border-leaf-soft">
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </button>
                  )}
                  <button onClick={() => remove(r.id)} className="inline-flex items-center gap-1.5 rounded-full border border-coral/40 bg-white px-4 py-1.5 text-xs font-semibold text-coral hover:bg-coral/10">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
