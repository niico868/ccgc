import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fmt } from "@/lib/menu-data";
import { Save, RefreshCw } from "lucide-react";

type OrderRow = {
  id: string;
  order_ref: string;
  customer_name: string;
  phone: string;
  email: string | null;
  fulfillment: string;
  pickup_location: string | null;
  delivery_address: string | null;
  total: number;
  status: string;
  status_updated_at: string;
  admin_note: string | null;
  created_at: string;
  items: unknown;
};

const STATUSES = ["received", "confirmed", "prepping", "ready", "out_for_delivery", "completed", "cancelled"] as const;

export function AdminOrders() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id,order_ref,customer_name,phone,email,fulfillment,pickup_location,delivery_address,total,status,status_updated_at,admin_note,created_at,items")
      .order("created_at", { ascending: false })
      .limit(200);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setRows((data ?? []) as OrderRow[]);
  };

  useEffect(() => { void load(); }, []);

  // Realtime: any change refreshes the list
  useEffect(() => {
    const ch = supabase.channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => { void load(); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const updateStatus = async (row: OrderRow, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Status → ${status.replace(/_/g, " ")}`);
  };

  const saveNote = async (row: OrderRow) => {
    const note = draftNotes[row.id] ?? "";
    const { error } = await supabase.from("orders").update({ admin_note: note || null }).eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Note saved");
    setDraftNotes((d) => { const c = { ...d }; delete c[row.id]; return c; });
  };

  const filtered = rows.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (q) {
      const s = q.toLowerCase();
      if (!r.order_ref.toLowerCase().includes(s) && !r.customer_name.toLowerCase().includes(s) && !r.phone.includes(s)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by order ID, name, or phone"
          className="h-10 min-w-[260px] flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-leaf-deep"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-leaf-deep">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <button onClick={load} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-white px-4 text-xs font-semibold text-leaf-deep hover:border-leaf-soft">
          <RefreshCw className="h-3.5 w-3.5" /> Reload
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-brown">Loading orders…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-brown">No orders match this view.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => {
            const items = Array.isArray(r.items) ? (r.items as Array<{ quantity: number; name: string; size?: string; protein?: string }>) : [];
            const noteDraft = draftNotes[r.id] ?? r.admin_note ?? "";
            const noteDirty = noteDraft !== (r.admin_note ?? "");
            return (
              <li key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-sm font-bold text-leaf-deep">{r.order_ref}</div>
                    <div className="text-xs text-brown">{new Date(r.created_at).toLocaleString()}</div>
                    <div className="mt-1 text-sm font-semibold text-foreground">{r.customer_name}</div>
                    <div className="text-xs text-brown">{r.phone}{r.email ? ` · ${r.email}` : ""}</div>
                    <div className="text-xs text-brown">
                      {r.fulfillment}
                      {r.fulfillment === "Pickup" && r.pickup_location ? ` · ${r.pickup_location}` : ""}
                      {r.fulfillment === "Delivery" && r.delivery_address ? ` · ${r.delivery_address}` : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-leaf-deep">{fmt(Number(r.total))}</div>
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r, e.target.value)}
                      className="mt-2 h-9 rounded-full border border-leaf-deep/30 bg-white px-3 text-xs font-semibold text-leaf-deep outline-none focus:border-leaf-deep"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                </div>

                <details className="mt-3 rounded-xl bg-secondary/30 p-3 text-xs">
                  <summary className="cursor-pointer font-semibold text-leaf-deep">Items ({items.reduce((s, i) => s + (i.quantity ?? 0), 0)})</summary>
                  <ul className="mt-2 space-y-1">
                    {items.map((i, idx) => (
                      <li key={idx}>{i.quantity} × {i.name}{(i.size || i.protein) ? ` (${[i.size, i.protein].filter(Boolean).join(" · ")})` : ""}</li>
                    ))}
                  </ul>
                </details>

                <div className="mt-3 flex items-start gap-2">
                  <textarea
                    rows={2}
                    value={noteDraft}
                    onChange={(e) => setDraftNotes((d) => ({ ...d, [r.id]: e.target.value }))}
                    placeholder="Customer-facing note (shown on the tracking page)"
                    className="flex-1 rounded-xl border border-border bg-background p-2 text-xs outline-none focus:border-leaf-deep"
                  />
                  {noteDirty && (
                    <button onClick={() => saveNote(r)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-leaf-deep px-4 text-xs font-semibold text-cream hover:opacity-90">
                      <Save className="h-3.5 w-3.5" /> Save
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
