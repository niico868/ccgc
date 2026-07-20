import { createFileRoute, useNavigate, Link, useServerFn } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { getSeoHealth, resubmitSitemap } from "@/lib/seo-health.functions";
import { CheckCircle2, XCircle, RefreshCw, ExternalLink, FileCode, Bot, Globe, Search } from "lucide-react";

export const Route = createFileRoute("/admin-seo")({
  head: () => ({ meta: [{ title: "SEO Health | Admin" }, { name: "robots", content: "noindex" }] }),
  component: SeoAdminPage,
});

type Health = Awaited<ReturnType<typeof getSeoHealth>>;

function Badge({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${ok ? "bg-leaf-soft/20 text-leaf-deep" : "bg-coral/15 text-coral"}`}>
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {children}
    </span>
  );
}

function Card({ title, icon, children, action }: { title: string; icon: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-deep">{icon}{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function SeoAdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState<Health | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const fetchHealth = useServerFn(getSeoHealth);
  const submitSitemap = useServerFn(resubmitSitemap);

  const load = async () => {
    setRefreshing(true);
    try {
      const d = await fetchHealth();
      setData(d);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setRefreshing(false);
    }
  };

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

  if (loading) return <Section className="py-20 text-center text-brown">Loading SEO health…</Section>;
  if (!isAdmin) return (
    <Section className="py-20 text-center">
      <h1 className="text-display text-3xl text-leaf-deep">Admin access only</h1>
      <p className="mt-2 text-sm text-brown">You don't have permission to view this page.</p>
    </Section>
  );
  if (!data) return <Section className="py-20 text-center text-brown">No data.</Section>;

  const sitemapUrl = "https://cathysgreenkitchen.com/sitemap.xml";
  const gscSitemap = data.gsc.sitemap as any;
  const inspection = data.gsc.inspection as any;
  const analytics = data.gsc.analytics as any;
  const indexStatus = inspection?.inspectionResult?.indexStatusResult;

  return (
    <Section className="py-10 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">SEO Health</h1>
          <p className="text-sm text-brown">Live snapshot of your sitemap, robots, structured data and Google Search Console status.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin" className="rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-leaf-deep hover:border-leaf-soft">Reviews admin</Link>
          <button onClick={load} disabled={refreshing} className="inline-flex items-center gap-1.5 rounded-full bg-leaf-deep px-4 py-1.5 text-xs font-semibold text-cream hover:opacity-90 disabled:opacity-60">
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Sitemap" icon={<FileCode className="h-4 w-4" />} action={
          <div className="flex gap-2">
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-deep hover:underline">
              View <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={async () => {
                const r = await submitSitemap();
                if (r.ok) toast.success("Resubmitted to Google");
                else toast.error(`Submit failed (${r.status})`);
                await load();
              }}
              className="rounded-full border border-leaf-deep/30 bg-white px-3 py-1 text-[11px] font-semibold text-leaf-deep hover:bg-secondary"
            >
              Resubmit
            </button>
          </div>
        }>
          <p className="text-sm text-brown">Auto-generated from your route files, {data.routes.length} URLs indexed:</p>
          <ul className="mt-2 grid grid-cols-2 gap-1 text-xs text-leaf-deep sm:grid-cols-3">
            {data.routes.map((r) => <li key={r.path} className="truncate">• {r.path}</li>)}
          </ul>
          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-semibold text-brown">Raw XML</summary>
            <pre className="mt-2 max-h-56 overflow-auto rounded-lg bg-muted p-3 text-[11px]">{data.sitemapXml}</pre>
          </details>
        </Card>

        <Card title="robots.txt" icon={<Bot className="h-4 w-4" />} action={
          <a href="/robots.txt" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-deep hover:underline">
            View <ExternalLink className="h-3 w-3" />
          </a>
        }>
          <pre className="max-h-56 overflow-auto rounded-lg bg-muted p-3 text-xs">{data.robots}</pre>
        </Card>

        <Card title="JSON-LD structured data" icon={<FileCode className="h-4 w-4" />}>
          <p className="text-xs text-brown">Homepage fetch: <Badge ok={data.home.status === 200}>HTTP {data.home.status}</Badge> · {data.home.jsonLd.length} blocks</p>
          <ul className="mt-3 space-y-2">
            {data.home.jsonLd.map((b, i) => (
              <li key={i} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-leaf-deep">{b.type}</span>
                  <Badge ok={b.valid}>{b.valid ? "Valid" : "Invalid"}</Badge>
                </div>
                {b.error && <p className="mt-1 text-xs text-coral">{b.error}</p>}
              </li>
            ))}
            {data.home.jsonLd.length === 0 && <li className="text-xs text-coral">No JSON-LD found on the homepage.</li>}
          </ul>
        </Card>

        <Card title="Google Search Console — Sitemap" icon={<Globe className="h-4 w-4" />}>
          <p className="text-xs text-brown break-all">{sitemapUrl}</p>
          {gscSitemap?.lastSubmitted ? (
            <div className="mt-3 space-y-1 text-xs text-leaf-deep">
              <div>Last submitted: <strong>{new Date(gscSitemap.lastSubmitted).toLocaleString()}</strong></div>
              {gscSitemap.lastDownloaded && <div>Last downloaded: <strong>{new Date(gscSitemap.lastDownloaded).toLocaleString()}</strong></div>}
              <div>Warnings: {gscSitemap.warnings ?? 0} · Errors: {gscSitemap.errors ?? 0}</div>
              <Badge ok={!gscSitemap.errors || gscSitemap.errors === "0"}>{gscSitemap.isPending ? "Pending" : "Processed"}</Badge>
            </div>
          ) : (
            <p className="mt-3 text-xs text-brown">Not yet visible in Google Search Console. Click <strong>Resubmit</strong> above.</p>
          )}
        </Card>

        <Card title="Homepage index status (Google)" icon={<Search className="h-4 w-4" />}>
          {indexStatus ? (
            <div className="space-y-1 text-xs">
              <div>Verdict: <Badge ok={indexStatus.verdict === "PASS"}>{indexStatus.verdict}</Badge></div>
              <div>Coverage: <strong>{indexStatus.coverageState}</strong></div>
              {indexStatus.lastCrawlTime && <div>Last crawl: <strong>{new Date(indexStatus.lastCrawlTime).toLocaleString()}</strong></div>}
              {indexStatus.robotsTxtState && <div>Robots: <strong>{indexStatus.robotsTxtState}</strong></div>}
              {indexStatus.indexingState && <div>Indexing: <strong>{indexStatus.indexingState}</strong></div>}
              {indexStatus.pageFetchState && <div>Page fetch: <strong>{indexStatus.pageFetchState}</strong></div>}
            </div>
          ) : (
            <p className="text-xs text-brown">No inspection data yet — Google may still be crawling.</p>
          )}
        </Card>

        <Card title="Top queries (last 7 days)" icon={<Search className="h-4 w-4" />}>
          {analytics?.rows?.length ? (
            <table className="w-full text-xs">
              <thead className="text-left text-brown"><tr><th className="pb-1">Query</th><th>Clicks</th><th>Impr.</th><th>CTR</th><th>Pos</th></tr></thead>
              <tbody>
                {analytics.rows.map((r: any, i: number) => (
                  <tr key={i} className="border-t border-border"><td className="py-1">{r.keys?.[0]}</td><td>{r.clicks}</td><td>{r.impressions}</td><td>{(r.ctr * 100).toFixed(1)}%</td><td>{r.position?.toFixed(1)}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-xs text-brown">No search data yet. Google needs a few days after verification to gather impressions.</p>
          )}
        </Card>
      </div>
    </Section>
  );
}
