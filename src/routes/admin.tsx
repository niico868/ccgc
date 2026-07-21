import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { Star, Trash2, Check, EyeOff, Save } from "lucide-react";
import { AdminOrders } from "@/components/site/AdminOrders";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | Cathy's Clean Green Classics" }] }),
  component: AdminPage,
});

type Review = {
  id: string;
  author_name: string;
  rating: number;
  body: string;
  status: "pending" | "approved" | "hidden";
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"orders" | "reviews">("orders");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "hidden">("pending");
  const [drafts, setDrafts] = useState<Record<string, { body: string; rating: number }>>({});

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/auth", search: { mode: "signin" } }); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
      const admin = (roles ?? []).length > 0;
      setIsAdmin(admin);
      if (admin) await load();
      setLoading(false);
    })();
  }, [navigate]);

  const load = async () => {
    const { data } = await supabase.from("reviews").select("id,author_name,rating,body,status,created_at").order("created_at", { ascending: false });
    setReviews((data ?? []) as Review[]);
  };

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

  if (loading) return <Section className="py-20 text-center text-brown">Loading…</Section>;
  if (!isAdmin) return (
    <Section className="py-20 text-center">
      <h1 className="text-display text-3xl text-leaf-deep">Admin access only</h1>
      <p className="mt-2 text-sm text-brown">You don't have permission to view this page.</p>
    </Section>
  );

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <Section className="py-12 space-y-6">
      <div>
        <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">Admin · Reviews</h1>
        <p className="text-sm text-brown">Approve, edit, hide or delete customer reviews.</p>
      </div>

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
    </Section>
  );
}
