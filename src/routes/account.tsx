import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Section } from "@/components/site/Section";
import { fmt } from "@/lib/menu-data";
import { supabase } from "@/integrations/supabase/client";
import { fmtPoints } from "@/lib/loyalty";
import { Sparkles, Gift } from "lucide-react";

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
                    {Number(o.loyalty_points ?? 0) > 0 && (
                      <div className="text-[11px] font-semibold text-leaf-soft">+{fmtPoints(Number(o.loyalty_points))} points</div>
                    )}
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

/** Encouraging loyalty summary: points earned so far and progress to the next reward. */
function LoyaltyCard({ orders }: { orders: Order[] }) {
  const points = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.loyalty_points ?? 0), 0);
  const NEXT_TIER = 100;
  const progress = Math.min(100, (points / NEXT_TIER) * 100);
  const toGo = Math.max(0, NEXT_TIER - points);

  return (
    <div className="overflow-hidden rounded-2xl border border-leaf-soft/40 bg-[linear-gradient(135deg,#FFFDF5_0%,#F3FBE7_55%,#FFF8E3_100%)] p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-display text-lg text-leaf-deep">
            <Sparkles className="h-5 w-5 text-leaf-soft" aria-hidden /> Green Points
          </div>
          <p className="mt-1 max-w-md text-sm text-brown">
            {points === 0
              ? "Place your first order and start collecting points. Every batch you order brings something good your way."
              : "Look at you go. Every order you place adds to your balance."}
          </p>
        </div>
        <div className="text-right">
          <div className="text-display text-4xl leading-none text-leaf-deep">{fmtPoints(points)}</div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-leaf-soft">points earned</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#F6E96B_0%,#A9D95A_55%,#2F7D32_100%)] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-brown">
          {toGo > 0
            ? `${fmtPoints(toGo)} points to go until your next reward tier.`
            : "You have reached the first reward tier. Nice work."}
        </div>
      </div>

      <div className="mt-5 grid gap-2 rounded-xl bg-white/70 p-4 text-sm text-brown sm:grid-cols-2">
        <div><b className="text-leaf-deep">10 points</b> for every 5 salads or meals</div>
        <div><b className="text-leaf-deep">5.5 points</b> for every 6 juices or shots</div>
      </div>

      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-leaf-deep/10 px-3 py-1.5 text-xs font-semibold text-leaf-deep">
        <Gift className="h-4 w-4" aria-hidden /> Rewards coming soon. Your points are already banking.
      </div>
    </div>
  );
}
