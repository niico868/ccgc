import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { fmt } from "@/lib/menu-data";
import { customerWaLink } from "@/lib/whatsapp";
import { privatePageHead } from "@/lib/private-page-head";
import {
  Phone, MessageCircle, Copy, Mail, ChevronDown, ChevronUp,
  Search, LogOut, ClipboardList, CheckSquare, CalendarDays, Inbox, Settings as SettingsIcon,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => privatePageHead("Order Book | Cathy's Clean Green Classics", "Cathy's Clean Green Classics administrator order book."),
  component: AdminPage,
});

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  category: string;
  quantity: number;
  protein: string | null;
  size: string | null;
  seafood: boolean;
  unit_price: number;
  line_total: number;
  excluded_ingredients: string | null;
  item_instructions: string | null;
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
  delivery_zone: string | null;
  fulfillment_window: string | null;
  required_fulfillment_date: string | null;
  split_for_freshness: boolean;
  payment_method: string | null;
  payment_received: boolean;
  amount_received: number;
  notes: string | null;
  allergy_info: string | null;
  drop_off_instructions: string | null;
  admin_note: string | null;
  subtotal: number;
  delivery_fee: number;
  discount_code: string | null;
  discount_amount: number;
  total: number;
  simple_status: "pending" | "done" | "cancelled";
  recurring_frequency: string | null;
  completed_at: string | null;
  created_at: string;
};

type Tab = "all" | "monday" | "wednesday" | "friday" | "completed" | "messages" | "settings";

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/auth", search: { mode: "signin" } }); return; }
      setUserEmail(user.email ?? "");
      const { data: roles } = await supabase.from("user_roles")
        .select("role").eq("user_id", user.id).eq("role", "admin");
      setIsAdmin((roles ?? []).length > 0);
      setLoading(false);
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { mode: "signin" } });
  };

  if (loading) {
    return <Section className="py-20 text-center text-lg text-brown">Loading…</Section>;
  }
  if (!isAdmin) {
    return (
      <Section className="py-20 text-center">
        <h1 className="text-display text-3xl text-leaf-deep">Admin access only</h1>
        <p className="mt-3 text-base text-brown">
          Your account ({userEmail}) doesn't have admin access to this dashboard.
        </p>
        <div className="mt-6">
          <Link to="/" className="rounded-xl border border-border bg-white px-5 py-3 text-base font-semibold text-leaf-deep hover:bg-secondary">
            Return to website
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <div className="min-h-screen bg-cream/40">
      <header className="sticky top-0 z-30 border-b-2 border-leaf-deep/15 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="text-display text-2xl text-leaf-deep">Cathy's Dashboard</div>
          <nav className="flex flex-wrap gap-2" aria-label="Admin sections">
            <NavBtn active={tab === "completed"} onClick={() => setTab("completed")} icon={<CheckSquare className="h-5 w-5" />} label="Completed" />
            <NavBtn active={tab === "all"} onClick={() => setTab("all")} icon={<ClipboardList className="h-5 w-5" />} label="All" />
            <NavBtn active={tab === "monday"} onClick={() => setTab("monday")} icon={<CalendarDays className="h-5 w-5" />} label="Monday" />
            <NavBtn active={tab === "wednesday"} onClick={() => setTab("wednesday")} icon={<CalendarDays className="h-5 w-5" />} label="Wednesday" />
            <NavBtn active={tab === "friday"} onClick={() => setTab("friday")} icon={<CalendarDays className="h-5 w-5" />} label="Friday" />
            <NavBtn active={tab === "messages"} onClick={() => setTab("messages")} icon={<Inbox className="h-5 w-5" />} label="Messages" />
            <NavBtn active={tab === "settings"} onClick={() => setTab("settings")} icon={<SettingsIcon className="h-5 w-5" />} label="Settings" />
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-2 text-base font-semibold text-leaf-deep hover:bg-secondary"
            >
              <LogOut className="h-5 w-5" /> Sign Out
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === "settings" ? <SettingsView email={userEmail} /> : tab === "messages" ? <MessagesView /> : <OrdersView mode={tab} />}
      </main>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-base font-semibold transition ${
        active ? "border-leaf-deep bg-leaf-deep text-cream" : "border-border bg-white text-leaf-deep hover:bg-secondary"
      }`}
    >
      {icon} {label}
    </button>
  );
}

/* ─────────────────────────── ORDERS / COMPLETED ─────────────────────────── */

type ViewMode = "all" | "monday" | "wednesday" | "friday" | "completed";

function OrdersView({ mode }: { mode: ViewMode }) {
  const isCompleted = mode === "completed";
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemsByOrder, setItemsByOrder] = useState<Record<string, OrderItemRow[]>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [confirmDone, setConfirmDone] = useState<Order | null>(null);

  const load = async () => {
    setLoading(true);
    const query = supabase.from("orders").select("*").limit(500);
    const { data: os, error } = isCompleted
      ? await query.in("simple_status" as never, ["done", "cancelled"] as never).order("created_at", { ascending: false })
      : await query.eq("simple_status" as never, "pending" as never).order("created_at", { ascending: false });
    if (error) { toast.error(error.message); setLoading(false); return; }
    const list = (os ?? []) as unknown as Order[];
    setOrders(list);
    if (list.length > 0) {
      const ids = list.map((o) => o.id);
      const { data: its } = await supabase.from("order_items").select("*").in("order_id", ids);
      const grouped: Record<string, OrderItemRow[]> = {};
      ((its ?? []) as unknown as OrderItemRow[]).forEach((r) => {
        (grouped[r.order_id] ||= []).push(r);
      });
      setItemsByOrder(grouped);
    } else {
      setItemsByOrder({});
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [mode]);

  const todayISO = ttDateISO(new Date());
  const nextMondayISO = nextWeekdayISO(1);
  const nextWednesdayISO = nextWeekdayISO(3);
  const nextFridayISO = nextWeekdayISO(5);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return orders.filter((o) => {
      const date = o.required_fulfillment_date;
      if (mode === "all" && date && date < todayISO) return false;
      if (mode === "monday" && date !== nextMondayISO) return false;
      if (mode === "wednesday" && date !== nextWednesdayISO) return false;
      if (mode === "friday" && date !== nextFridayISO) return false;
      if (s) {
        const hay = `${o.customer_name ?? ""} ${o.order_ref} ${o.phone ?? ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [orders, search, mode, todayISO, nextMondayISO, nextWednesdayISO, nextFridayISO]);

  const groups = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => {
      const ad = a.required_fulfillment_date ?? "9999-99-99";
      const bd = b.required_fulfillment_date ?? "9999-99-99";
      return isCompleted ? b.created_at.localeCompare(a.created_at) : ad.localeCompare(bd);
    });
    if (mode !== "all") return [{ heading: "", orders: sorted }];
    const out: { heading: string; orders: Order[] }[] = [];
    sorted.forEach((o) => {
      const heading = o.required_fulfillment_date ? monthHeading(o.required_fulfillment_date) : "No date set";
      const last = out[out.length - 1];
      if (last && last.heading === heading) last.orders.push(o);
      else out.push({ heading, orders: [o] });
    });
    return out;
  }, [filtered, mode, isCompleted]);

  const pendingCount = filtered.length;
  const totalFood = filtered.reduce((s, o) => s + (itemsByOrder[o.id] ?? []).filter((i) => i.category !== "juice").reduce((a, b) => a + b.quantity, 0), 0);
  const totalJuice = filtered.reduce((s, o) => s + (itemsByOrder[o.id] ?? []).filter((i) => i.category === "juice").reduce((a, b) => a + b.quantity, 0), 0);

  const setPaymentReceived = async (o: Order, received: boolean) => {
    const { error } = await supabase.from("orders").update({
      payment_received: received,
      payment_received_at: received ? new Date().toISOString() : null,
      amount_received: received ? Number(o.total) : 0,
    } as never).eq("id", o.id);
    if (error) { toast.error(error.message); return; }
    toast.success(received ? "Payment marked as received" : "Payment cleared");
    load();
  };

  const markDone = async (o: Order) => {
    const { error } = await supabase.from("orders").update({
      simple_status: "done", status: "completed", completed_at: new Date().toISOString(),
    } as never).eq("id", o.id);
    setConfirmDone(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Order marked as done");
    load();
  };

  const moveBackToPending = async (o: Order) => {
    const { error } = await supabase.from("orders").update({
      simple_status: "pending", status: "received", completed_at: null,
    } as never).eq("id", o.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Order moved back to Pending");
    load();
  };

  const cancelOrder = async (o: Order) => {
    const { error } = await supabase.from("orders").update({
      simple_status: "cancelled", status: "cancelled", completed_at: new Date().toISOString(),
    } as never).eq("id", o.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Order cancelled");
    load();
  };

  const saveNote = async (o: Order, note: string) => {
    const { error } = await supabase.from("orders").update({ admin_note: note } as never).eq("id", o.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Internal note saved");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">{VIEW_TITLES[mode]}</h1>
        <p className="mt-1 text-base text-brown">
          {mode === "all" && "All upcoming orders, grouped by month."}
          {mode === "monday" && `Orders for the coming Monday, ${shortDateISO(nextMondayISO)}.`}
          {mode === "wednesday" && `Orders for the coming Wednesday, ${shortDateISO(nextWednesdayISO)}.`}
          {mode === "friday" && `Orders for the coming Friday, ${shortDateISO(nextFridayISO)}.`}
          {mode === "completed" && "Past orders you have finished, plus cancelled orders."}
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brown" aria-hidden />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer or order number"
          className="h-14 w-full rounded-xl border-2 border-border bg-white pl-12 pr-4 text-base outline-none focus:border-leaf-deep"
        />
      </div>

      {!isCompleted && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Pending orders" value={pendingCount} />
          <StatCard label="Total food items" value={totalFood} />
          <StatCard label="Total juice bottles" value={totalJuice} />
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-base text-brown">Loading orders…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-white p-10 text-center">
          <p className="text-lg text-brown">No orders in this view.</p>
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.heading || "single"} className="space-y-3">
            {g.heading && (
              <h2 className="pt-2 text-display text-2xl text-leaf-deep">{g.heading}</h2>
            )}
            <ul className="space-y-3">
              {g.orders.map((o) => {
                const items = itemsByOrder[o.id] ?? [];
                const totalQty = items.reduce((s, i) => s + i.quantity, 0);
                const type = orderType(items);
                const isOpen = expanded === o.id;
                return (
                  <li key={o.id} className="overflow-hidden rounded-2xl border-2 border-border bg-white shadow-sm">
                    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-[1.4fr_0.6fr_0.8fr_0.9fr_auto] sm:items-center">
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : o.id)}
                        className="flex items-center gap-2 text-left"
                        aria-expanded={isOpen}
                      >
                        <div>
                          <div className="text-lg font-semibold text-leaf-deep">{o.customer_name || "—"}</div>
                          <div className="text-xs text-brown font-mono">{o.order_ref}</div>
                          {o.recurring_frequency && o.recurring_frequency !== "none" && (
                            <div className="mt-1 inline-block rounded-full bg-leaf-soft/25 px-2 py-0.5 text-[11px] font-semibold text-leaf-deep">
                              Repeats {o.recurring_frequency}
                            </div>
                          )}
                        </div>
                        {isOpen ? <ChevronUp className="h-5 w-5 text-leaf-deep" /> : <ChevronDown className="h-5 w-5 text-leaf-deep" />}
                      </button>
                      <div className="text-base">
                        <span className="font-semibold text-leaf-deep">{totalQty}</span>{" "}
                        <span className="text-brown">items</span>
                      </div>
                      <div className="text-base text-leaf-deep">{type}</div>
                      <div className="text-sm text-brown">
                        Placed {shortDate(o.created_at)}
                        {o.required_fulfillment_date && (
                          <div className="text-sm text-leaf-deep">Required {shortDateISO(o.required_fulfillment_date)}</div>
                        )}
                        {o.simple_status === "cancelled" && (
                          <div className="text-sm font-semibold text-coral">Cancelled</div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {!isCompleted ? (
                          <>
                            <button
                              onClick={() => setConfirmDone(o)}
                              className="inline-flex items-center gap-2 rounded-xl border-2 border-leaf-deep bg-white px-4 py-3 text-base font-semibold text-leaf-deep hover:bg-leaf-soft/20"
                            >
                              <span className="inline-block h-5 w-5 rounded border-2 border-leaf-deep" aria-hidden /> Mark Done
                            </button>
                            <button
                              onClick={() => cancelOrder(o)}
                              className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-3 text-base font-semibold text-brown hover:bg-secondary"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => moveBackToPending(o)}
                            className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-3 text-base font-semibold text-leaf-deep hover:bg-secondary"
                          >
                            Move Back to Pending
                          </button>
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="space-y-6 border-t-2 border-border bg-cream/30 p-5">
                        <ExpandedOrder
                          order={o}
                          items={items}
                          onSetPaymentReceived={(v) => setPaymentReceived(o, v)}
                          onSaveNote={(n) => saveNote(o, n)}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}

      {confirmDone && (
        <ConfirmDoneModal
          order={confirmDone}
          onCancel={() => setConfirmDone(null)}
          onConfirm={() => markDone(confirmDone)}
        />
      )}
    </div>
  );
}

const VIEW_TITLES: Record<ViewMode, string> = {
  all: "All Upcoming Orders",
  monday: "Monday Orders",
  wednesday: "Wednesday Orders",
  friday: "Friday Orders",
  completed: "Completed & Cancelled",
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border-2 border-leaf-soft/40 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-wider text-brown">{label}</div>
      <div className="mt-1 text-4xl font-bold text-leaf-deep">{value}</div>
    </div>
  );
}

function ExpandedOrder({
  order, items, onSetPaymentReceived, onSaveNote,
}: {
  order: Order;
  items: OrderItemRow[];
  onSetPaymentReceived: (v: boolean) => void;
  onSaveNote: (n: string) => void;
}) {
  const [note, setNote] = useState(order.admin_note ?? "");
  const remaining = Math.max(0, Number(order.total) - Number(order.amount_received || 0));

  const waMsg = `Hi ${order.customer_name ?? "there"}, this is Cathy's Clean Green Classics confirming your website order ${order.order_ref}.`;
  const customerWa = customerWaLink(order.phone, waMsg);

  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); toast.success(`${label} copied`); }
    catch { toast.error("Could not copy"); }
  };

  return (
    <>
      {/* Customer */}
      <Panel title="Customer">
        <div className="grid gap-2 text-base">
          <Row label="Name" value={order.customer_name ?? "—"} />
          <Row label="Telephone" value={order.phone ?? "—"} />
          <Row label="Email" value={order.email ?? "—"} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {order.phone && (
            <>
              <a href={`tel:${order.phone}`} className="inline-flex items-center gap-2 rounded-xl border-2 border-leaf-deep bg-white px-4 py-3 text-base font-semibold text-leaf-deep hover:bg-secondary">
                <Phone className="h-5 w-5" /> Call Customer
              </a>
              {customerWa ? (
                <a href={customerWa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-base font-semibold text-white hover:opacity-90">
                  <MessageCircle className="h-5 w-5" /> Open WhatsApp
                </a>
              ) : (
                <span title="No valid phone number on this order" className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-muted-foreground/30 px-4 py-3 text-base font-semibold text-muted-foreground">
                  <MessageCircle className="h-5 w-5" /> Open WhatsApp
                </span>
              )}
              <button onClick={() => copy(order.phone!, "Phone number")} className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-3 text-base font-semibold text-leaf-deep hover:bg-secondary">
                <Copy className="h-5 w-5" /> Copy Number
              </button>
            </>
          )}
          {order.email && (
            <button onClick={() => copy(order.email!, "Email")} className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-3 text-base font-semibold text-leaf-deep hover:bg-secondary">
              <Mail className="h-5 w-5" /> Copy Email
            </button>
          )}
        </div>
      </Panel>

      {/* Order details */}
      <Panel title="Order">
        <div className="grid gap-2 text-base">
          <Row label="Order ID" value={<span className="font-mono">{order.order_ref}</span>} />
          <Row label="Submitted" value={longDate(order.created_at)} />
          {order.required_fulfillment_date && (
            <Row label="Required fulfilment date" value={shortDateISO(order.required_fulfillment_date)} bold />
          )}
          <Row label="Total quantity" value={String(items.reduce((s, i) => s + i.quantity, 0))} />
          <Row label="Order type" value={orderType(items)} />
        </div>
        <ul className="mt-4 space-y-3">
          {items.map((it) => (
            <li key={it.id} className="rounded-xl border-2 border-border bg-white p-4">
              <div className="text-lg font-semibold text-leaf-deep">{it.product_name}</div>
              <dl className="mt-2 grid gap-1 text-base sm:grid-cols-2">
                <DL label="Quantity" value={String(it.quantity)} />
                {it.protein && <DL label="Protein" value={it.protein + (it.seafood ? " (seafood)" : "")} />}
                <DL label="Unit price" value={fmt(Number(it.unit_price))} />
                <DL label="Line total" value={fmt(Number(it.line_total))} />
                <DL label="Ingredients excluded" value={it.excluded_ingredients || "None"} />
                <DL label="Special instructions" value={it.item_instructions || "None"} />
              </dl>
            </li>
          ))}
        </ul>
      </Panel>

      {/* Fulfilment */}
      <Panel title="Fulfilment">
        <div className="grid gap-2 text-base">
          <Row label="Method" value={order.fulfillment ?? "—"} />
          {order.fulfillment === "Delivery" && (
            <>
              {order.delivery_zone && <Row label="Delivery area" value={order.delivery_zone} />}
              {order.delivery_address && <Row label="Delivery address" value={order.delivery_address} />}
              <Row label="Delivery charge" value={fmt(Number(order.delivery_fee) || 0)} />
              {order.fulfillment_window && <Row label="Delivery window" value={order.fulfillment_window} />}
              <Row label="Split for freshness" value={order.split_for_freshness ? "Yes" : "No"} />
            </>
          )}
          {order.fulfillment === "Pickup" && (
            <>
              {order.pickup_location && <Row label="Pickup location" value={order.pickup_location} />}
              {order.required_fulfillment_date && <Row label="Pickup date" value={shortDateISO(order.required_fulfillment_date)} />}
              {order.fulfillment_window && <Row label="Pickup window" value={order.fulfillment_window} />}
            </>
          )}
        </div>
      </Panel>

      {/* Payment */}
      <Panel title="Payment">
        <div className="grid gap-2 text-base">
          <Row label="Payment method" value={order.payment_method ?? "—"} />
          <Row label="Subtotal" value={fmt(Number(order.subtotal))} />
          <Row label="Delivery charge" value={fmt(Number(order.delivery_fee) || 0)} />
          <Row label="Total" value={fmt(Number(order.total))} bold />
          <Row label="Amount received" value={fmt(Number(order.amount_received || 0))} />
          <Row label="Remaining balance" value={fmt(remaining)} />
        </div>
        <label className="mt-4 inline-flex cursor-pointer items-start gap-3 rounded-xl border-2 border-leaf-deep/30 bg-white p-4">
          <input
            type="checkbox"
            checked={order.payment_received}
            onChange={(e) => onSetPaymentReceived(e.target.checked)}
            className="mt-1 h-6 w-6 accent-[var(--leaf-deep)]"
          />
          <div>
            <div className="text-base font-semibold text-leaf-deep">
              {order.payment_received ? "✓ Payment received" : "Payment received"}
            </div>
            <div className="text-sm text-brown">Tick when the money has come in.</div>
          </div>
        </label>
      </Panel>

      {/* Notes */}
      {(order.notes || order.allergy_info || order.drop_off_instructions) && (
        <Panel title="Customer notes">
          {order.notes && <NoteBlock label="Order notes" value={order.notes} />}
          {order.allergy_info && <NoteBlock label="Allergy information" value={order.allergy_info} />}
          {order.drop_off_instructions && <NoteBlock label="Drop-off instructions" value={order.drop_off_instructions} />}
        </Panel>
      )}

      <Panel title="Internal staff note — customer cannot see this">
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notes for the team only"
          className="w-full rounded-xl border-2 border-border bg-white p-3 text-base outline-none focus:border-leaf-deep"
        />
        <button
          onClick={() => onSaveNote(note)}
          className="mt-3 rounded-xl bg-leaf-deep px-5 py-3 text-base font-semibold text-cream hover:opacity-90"
        >
          Save internal note
        </button>
      </Panel>
    </>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border-2 border-border bg-white p-5">
      <h3 className="text-display text-xl text-leaf-deep">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Row({ label, value, bold }: { label: string; value: React.ReactNode; bold?: boolean }) {
  return (
    <div className="flex flex-wrap justify-between gap-3 border-b border-border/60 py-1 last:border-0">
      <span className="text-brown">{label}</span>
      <span className={bold ? "font-bold text-leaf-deep" : "text-leaf-deep"}>{value}</span>
    </div>
  );
}

function DL({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-brown">{label}</dt>
      <dd className="text-base text-leaf-deep">{value}</dd>
    </div>
  );
}

function NoteBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="text-sm font-semibold uppercase tracking-wider text-brown">{label}</div>
      <div className="mt-1 whitespace-pre-wrap rounded-xl bg-cream/60 p-3 text-base text-leaf-deep">{value}</div>
    </div>
  );
}

function ConfirmDoneModal({ order, onCancel, onConfirm }: { order: Order; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-display text-2xl text-leaf-deep">
          Mark {order.customer_name ?? "this"}'s order as done?
        </h2>
        <p className="mt-2 text-base text-brown">This will move the order to the Completed list.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-leaf-deep px-5 py-3 text-base font-semibold text-cream hover:opacity-90">
            Yes, Mark Done
          </button>
          <button onClick={onCancel} className="flex-1 rounded-xl border-2 border-border bg-white px-5 py-3 text-base font-semibold text-leaf-deep hover:bg-secondary">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── MESSAGES ──────────────────────────────── */

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  handled_at: string | null;
  created_at: string;
};

function MessagesView() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages" as never)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) toast.error(error.message);
    setMessages((data ?? []) as unknown as ContactMessage[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setHandled = async (m: ContactMessage, handled: boolean) => {
    const { error } = await supabase
      .from("contact_messages" as never)
      .update({ handled_at: handled ? new Date().toISOString() : null } as never)
      .eq("id", m.id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">Messages</h1>
        <p className="mt-1 text-base text-brown">Notes sent through the website contact form.</p>
      </div>
      {loading ? (
        <p className="py-10 text-center text-base text-brown">Loading messages…</p>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-white p-10 text-center">
          <p className="text-lg text-brown">No messages yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={`rounded-2xl border-2 bg-white p-5 shadow-sm ${m.handled_at ? "border-border opacity-70" : "border-leaf-deep/40"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-leaf-deep">{m.name}</div>
                  <div className="text-sm text-brown">{longDate(m.created_at)}</div>
                </div>
                <button
                  onClick={() => setHandled(m, !m.handled_at)}
                  className="rounded-xl border-2 border-border bg-white px-4 py-2 text-base font-semibold text-leaf-deep hover:bg-secondary"
                >
                  {m.handled_at ? "Mark as not done" : "Mark as done"}
                </button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-base text-leaf-deep">{m.message}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-base">
                <a href={`mailto:${m.email}`} className="font-semibold text-leaf-deep underline">{m.email}</a>
                {m.phone && <a href={`tel:${m.phone}`} className="font-semibold text-leaf-deep underline">{m.phone}</a>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────────────── SETTINGS ──────────────────────────────── */

function SettingsView({ email }: { email: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display text-3xl text-leaf-deep">Settings</h1>
        <p className="mt-1 text-base text-brown">Your account and dashboard information.</p>
      </div>
      <div className="rounded-2xl border-2 border-border bg-white p-5">
        <div className="text-sm font-semibold uppercase tracking-wider text-brown">Signed in as</div>
        <div className="mt-1 text-lg text-leaf-deep">{email || "—"}</div>
      </div>
      <div className="rounded-2xl border-2 border-border bg-white p-5">
        <h3 className="text-display text-xl text-leaf-deep">Add this dashboard to your phone</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-base text-leaf-deep">
          <li>Open this page in Safari or Chrome on your phone.</li>
          <li>Tap the share or menu button.</li>
          <li>Choose "Add to Home Screen".</li>
          <li>Tap the new icon any time to jump straight to Cathy's Dashboard.</li>
        </ol>
      </div>
    </div>
  );
}

/* ─────────────────────────────── HELPERS ───────────────────────────────── */

function orderType(items: OrderItemRow[]): string {
  const cats = new Set(items.map((i) => i.category));
  if (cats.size === 0) return "—";
  if (cats.size > 1) return "Mixed";
  const only = [...cats][0];
  if (only === "salad") return "Salad";
  if (only === "meal") return "Meal";
  if (only === "juice") return "Juice";
  return only;
}

function ttDateISO(d: Date): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Port_of_Spain",
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  return fmt.format(d);
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-TT", { month: "short", day: "numeric" });
}

function shortDateISO(iso: string): string {
  // iso is YYYY-MM-DD; parse as UTC to avoid TZ shift then format calendar day
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return dt.toLocaleDateString("en-TT", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" });
}

function longDate(iso: string): string {
  return new Date(iso).toLocaleString("en-TT", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

/** ISO date of the next occurrence of a weekday (0=Sun) in Trinidad time, today included. */
function nextWeekdayISO(weekday: number): string {
  const todayISO = ttDateISO(new Date());
  const [y, m, d] = todayISO.split("-").map(Number);
  const base = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  for (let i = 0; i < 14; i++) {
    const dt = new Date(base);
    dt.setUTCDate(base.getUTCDate() + i);
    if (dt.getUTCDay() === weekday) {
      return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
    }
  }
  return todayISO;
}

/** "November 2026" heading for an ISO date. */
function monthHeading(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1))
    .toLocaleDateString("en-TT", { timeZone: "UTC", month: "long", year: "numeric" });
}
