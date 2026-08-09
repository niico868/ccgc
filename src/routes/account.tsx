import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Section } from "@/components/site/Section";
import { fmt } from "@/lib/menu-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account | Cathy's Clean Green Classics" }] }),
  component: AccountPage,
});

type Profile = { first_name: string | null; last_name: string | null; email: string | null; phone: string | null };
type OrderItem = { name?: string; quantity?: number; size?: string; protein?: string; seafood?: boolean; preferences?: string; notes?: string; category?: string };
type Order = {
  id: string; order_ref: string; total: number; status: string; created_at: string;
  items: OrderItem[] | null; fulfillment: string | null; pickup_location: string | null;
  delivery_address: string | null; discount_code: string | null; discount_amount: number | null;
  loyalty_points: number | null;
};
type Discount = { id: string; code: string; percent: number; created_at: string; redeemed_at: string | null };

function AccountPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [codes, setCodes] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/auth", search: { mode: "signin" } }); return; }
      const [{ data: p }, { data: o }, { data: c }] = await Promise.all([
        supabase.from("profiles").select("first_name,last_name,email,phone").eq("id", user.id).maybeSingle(),
        supabase.from("orders").select("id,order_ref,total,status,created_at,items,fulfillment,pickup_location,delivery_address,discount_code,discount_amount,loyalty_points").order("created_at", { ascending: false }),
        supabase.from("discount_codes").select("id,code,percent,created_at,redeemed_at").order("created_at", { ascending: false }),
      ]);
      setProfile(p as Profile | null);
      setOrders((o ?? []) as Order[]);
      setCodes((c ?? []) as Discount[]);
      setLoading(false);
    })();
  }, [navigate]);

  if (loading) return <Section className="py-20 text-center text-brown">Loading…</Section>;

  return (
    <Section className="py-12 space-y-6">
      <div>
        <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">My Account</h1>
        <p className="text-sm text-brown">Welcome back{profile?.first_name ? `, ${profile.first_name}` : ""}.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="text-display text-lg text-leaf-deep">Profile</div>
        <div className="mt-3 grid gap-1 text-sm text-brown">
          <div><b className="text-leaf-deep">Name:</b> {profile?.first_name} {profile?.last_name}</div>
          <div><b className="text-leaf-deep">Email:</b> {profile?.email}</div>
          <div><b className="text-leaf-deep">Phone:</b> {profile?.phone || "—"}</div>
        </div>
      </div>

      <LoyaltyCard orders={orders} />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="text-display text-lg text-leaf-deep">Order history</div>
        {orders.length === 0 ? (
          <p className="mt-2 text-sm text-brown">No orders yet. <Link to="/salads" className="text-leaf-deep underline">Browse the menu</Link>.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border text-sm">
            {orders.map((o) => (
              <li key={o.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-leaf-deep">{o.order_ref}</div>
                    <div className="text-xs text-brown">{new Date(o.created_at).toLocaleString()}</div>
                    {o.fulfillment && (
                      <div className="mt-0.5 text-xs text-brown">
                        {o.fulfillment}{o.pickup_location ? ` · ${o.pickup_location}` : ""}{o.delivery_address ? ` · ${o.delivery_address}` : ""}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-leaf-deep">{fmt(o.total ?? 0)}</div>
                    <div className="text-xs text-brown capitalize">{o.status}</div>
                    {o.discount_code && (
                      <div className="text-[11px] font-semibold text-leaf-soft">Code {o.discount_code} applied</div>
                    )}
                  </div>
                </div>
                {Array.isArray(o.items) && o.items.length > 0 && (
                  <ul className="mt-3 space-y-1 rounded-xl bg-secondary/40 p-3 text-xs text-foreground/85">
                    {o.items.map((it, i) => (
                      <li key={i}>
                        <span className="font-semibold">{it.quantity ?? 1} × {it.name ?? "Item"}</span>
                        {(it.size || it.protein) && <span className="text-brown"> · {[it.size, it.protein].filter(Boolean).join(" / ")}</span>}
                        {it.seafood && <span className="text-brown"> · seafood</span>}
                        {it.preferences && <div className="text-brown">No: {it.preferences}</div>}
                        {it.notes && <div className="text-brown">{it.notes}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
