import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getSitemapEntries, buildSitemapXml } from "@/routes/sitemap[.]xml";

const SITE_URL = "https://cathyscleangreenclassics.com/";
const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId)
    .eq("role", "admin");
  if (error || !data || data.length === 0) throw new Error("Forbidden");
}

async function gscFetch(path: string, init: RequestInit = {}) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gscKey = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  if (!lovableKey || !gscKey) {
    return { ok: false, status: 0, body: "Google Search Console connector not configured." };
  }
  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gscKey,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: any = text;
  try { body = JSON.parse(text); } catch {}
  return { ok: res.ok, status: res.status, body: body as any };
}

export const getSeoHealth = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);

    const entries = getSitemapEntries();
    const sitemapXml = buildSitemapXml();

    // Read robots.txt from disk
    let robots = "";
    try {
      const fs = await import("fs/promises");
      robots = await fs.readFile("public/robots.txt", "utf8");
    } catch {
      robots = "(unable to read public/robots.txt)";
    }

    // Fetch homepage HTML and extract JSON-LD blocks
    let jsonLd: { valid: boolean; type: string; raw: string; error?: string }[] = [];
    let homeStatus = 0;
    try {
      const homeRes = await fetch(SITE_URL, { headers: { "User-Agent": "SEO-Health-Bot" } });
      homeStatus = homeRes.status;
      const html = await homeRes.text();
      const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
      jsonLd = matches.map((m) => {
        const raw = m[1].trim();
        try {
          const parsed = JSON.parse(raw);
          const type = Array.isArray(parsed)
            ? parsed.map((p) => p["@type"]).join(", ")
            : parsed["@type"] ?? "(no @type)";
          return { valid: true, type: String(type), raw };
        } catch (e) {
          return { valid: false, type: "(invalid)", raw, error: (e as Error).message };
        }
      });
    } catch (e) {
      jsonLd = [{ valid: false, type: "(fetch failed)", raw: "", error: (e as Error).message }];
    }

    // GSC — sites list
    const sites = await gscFetch("/webmasters/v3/sites");

    // GSC — sitemap status
    const sitemapUrl = "https://cathyscleangreenclassics.com/sitemap.xml";
    const sitemapStatus = await gscFetch(
      `/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    );

    // GSC — url inspection for homepage
    const inspection = await gscFetch(`/v1/urlInspection/index:inspect`, {
      method: "POST",
      body: JSON.stringify({ inspectionUrl: SITE_URL, siteUrl: SITE_URL }),
    });

    // GSC — top 7-day search analytics
    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    const startD = new Date(today.getTime() - 7 * 864e5).toISOString().slice(0, 10);
    const analytics = await gscFetch(
      `/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
      {
        method: "POST",
        body: JSON.stringify({ startDate: startD, endDate: end, dimensions: ["query"], rowLimit: 10 }),
      },
    );

    return {
      site: SITE_URL,
      routes: entries,
      sitemapXml,
      robots,
      home: { status: homeStatus, jsonLd },
      gsc: {
        sites: sites.body,
        sitemap: sitemapStatus.body,
        sitemapOk: sitemapStatus.ok,
        inspection: inspection.body,
        analytics: analytics.body,
      },
    };
  });

export const resubmitSitemap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const sitemapUrl = "https://cathyscleangreenclassics.com/sitemap.xml";
    const res = await gscFetch(
      `/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
      { method: "PUT" },
    );
    return { ok: res.ok, status: res.status, body: res.body };
  });
