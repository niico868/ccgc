import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Quote, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Review = {
  id: string;
  author_name: string;
  body: string;
  rating: number;
  status: string;
  created_at: string;
};

const SEED: Review[] = [
  { id: "seed-1", author_name: "Aaliyah R.", body: "The Broccoli Power Bowl is the best lunch in my week. Fresh, filling, beautifully packed.", rating: 5, status: "approved", created_at: new Date().toISOString() },
  { id: "seed-2", author_name: "Marcus D.", body: "Cathy's juices taste like they were pressed five minutes before they reached me.", rating: 5, status: "approved", created_at: new Date().toISOString() },
  { id: "seed-3", author_name: "Simone J.", body: "Proper food, beautifully done. Everyone at the table asked who made it.", rating: 5, status: "approved", created_at: new Date().toISOString() },
];

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mineExists, setMineExists] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id,author_name,body,rating,status,created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(9);
    const approved = (data ?? []) as Review[];
    setReviews(approved.length > 0 ? approved : SEED);
  };

  useEffect(() => {
    load();
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user;
      if (!u) return;
      setUserId(u.id);
      const { data: p } = await supabase.from("profiles").select("first_name,last_name").eq("id", u.id).maybeSingle();
      const name = [p?.first_name, p?.last_name].filter(Boolean).join(" ").trim() || (u.email ?? "Guest");
      setProfileName(name);
      const { count } = await supabase.from("reviews").select("id", { count: "exact", head: true }).eq("user_id", u.id);
      setMineExists((count ?? 0) > 0);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (body.trim().length < 4) { toast.error("Tell us a bit more (4+ characters)."); return; }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: userId,
      author_name: profileName || "Customer",
      rating,
      body: body.trim(),
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Thanks! Your review is awaiting approval.");
    setBody("");
    setMineExists(true);
  };

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.id} className="rounded-[26px] border border-leaf-soft/20 bg-white/85 p-7 shadow-[0_18px_35px_rgba(31,90,53,0.1)] backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <Quote className="h-7 w-7 text-citrus" />
              <div className="flex">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-citrus text-citrus" />
                ))}
              </div>
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">&ldquo;{r.body}&rdquo;</blockquote>
            <figcaption className="mt-4 text-xs font-semibold uppercase tracking-wider text-brown">{r.author_name}</figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-[26px] border border-leaf-soft/20 bg-white/85 p-7 shadow-[0_18px_35px_rgba(31,90,53,0.08)] backdrop-blur-sm">
        <div className="text-display text-xl text-leaf-deep">Leave a review</div>
        {!userId ? (
          <p className="mt-2 text-sm text-foreground/75">
            <Link to="/auth" search={{ mode: "signin" }} className="font-semibold text-leaf-deep underline">Sign in</Link> to share your experience.
          </p>
        ) : mineExists ? (
          <p className="mt-2 text-sm text-foreground/75">Thanks for sharing — you've already left a review. It will appear once approved.</p>
        ) : (
          <form onSubmit={submit} className="mt-3 space-y-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                  <Star className={`h-6 w-6 ${n <= rating ? "fill-citrus text-citrus" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={1000}
              placeholder="Share your experience…"
              className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-leaf-deep"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-brown">Posting as <b className="text-leaf-deep">{profileName}</b></span>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-full bg-leaf-deep px-6 text-sm font-semibold text-cream hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
