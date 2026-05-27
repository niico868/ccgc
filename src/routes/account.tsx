import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account | Cathy's Clean Green Classics" }] }),
  component: AccountPage,
});

type Profile = { first_name: string | null; last_name: string | null; email: string | null; phone: string | null };
type Order = { id: string; order_ref: string; total: number; status: string; created_at: string };
type Discount = { id: string; code: string; percent: number; created_at: string };

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
        supabase.from("orders").select("id,order_ref,total,status,created_at").order("created_at", { ascending: false }),
        supabase.from("discount_codes").select("id,code,percent,created_at").order("created_at", { ascending: false }),
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

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="text-display text-lg text-leaf-deep">Saved discount codes</div>
        {codes.length === 0 ? (
          <p className="mt-2 text-sm text-brown">No discount codes yet. Look out for our signup offer.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {codes.map((c) => (
              <li key={c.id} className="flex justify-between rounded-xl border border-leaf-soft/30 bg-leaf-soft/10 px-4 py-2 font-mono">
                <span className="font-bold text-leaf-deep">{c.code}</span>
                <span className="text-brown">{c.percent}% off</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="text-display text-lg text-leaf-deep">Order history</div>
        {orders.length === 0 ? (
          <p className="mt-2 text-sm text-brown">No orders yet. <Link to="/salads" className="text-leaf-deep underline">Browse the menu</Link>.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border text-sm">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-semibold text-leaf-deep">{o.order_ref}</div>
                  <div className="text-xs text-brown">{new Date(o.created_at).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-leaf-deep">${Number(o.total).toFixed(2)}</div>
                  <div className="text-xs text-brown capitalize">{o.status}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
