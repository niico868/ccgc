import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://cathyscleangreenclassics.com";

// Routes that exist as files but should never be indexed.
const EXCLUDED = new Set([
  "/admin",
  "/auth",
  "/account",
  "/basket",
  "/checkout",
]);

// Metadata overrides per path (priority + changefreq). Anything not listed
// gets sensible defaults so new routes appear automatically.
const META: Record<string, { changefreq: string; priority: string }> = {
  "/": { changefreq: "weekly", priority: "1.0" },
  "/salads": { changefreq: "weekly", priority: "0.8" },
  "/meals": { changefreq: "weekly", priority: "0.8" },
  "/juices": { changefreq: "weekly", priority: "0.8" },
  "/gallery": { changefreq: "monthly", priority: "0.6" },
  "/faq": { changefreq: "monthly", priority: "0.6" },
  "/contact": { changefreq: "monthly", priority: "0.6" },
};

// Glob every route file. Vite resolves this at build time on both client and
// server, so newly created routes flow into the sitemap automatically.
const routeFiles = import.meta.glob("/src/routes/**/*.{ts,tsx}");

function fileToPath(file: string): string | null {
  // /src/routes/foo.bar.tsx -> /foo/bar
  let p = file.replace(/^\/src\/routes\//, "").replace(/\.(tsx|ts)$/, "");
  if (p === "index") return "/";
  if (p === "__root") return null;
  if (p.startsWith("api/")) return null; // server-only routes
  if (p.includes("sitemap[.]xml")) return null;
  // exclude dynamic ($param), splat ($), and layout (_prefix) routes
  const segments = p.split("/");
  if (segments.some((s) => s.startsWith("$") || s.startsWith("_"))) return null;
  // flat dot convention -> slashes; trailing /index means folder index
  const url = "/" + p.replace(/\./g, "/").replace(/\/index$/, "");
  return url === "/" ? "/" : url;
}

export function getSitemapEntries() {
  const paths = new Set<string>();
  for (const file of Object.keys(routeFiles)) {
    const path = fileToPath(file);
    if (path && !EXCLUDED.has(path)) paths.add(path);
  }
  return Array.from(paths)
    .sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)))
    .map((path) => ({
      path,
      changefreq: META[path]?.changefreq ?? "monthly",
      priority: META[path]?.priority ?? "0.5",
    }));
}

export function buildSitemapXml(baseUrl = BASE_URL) {
  const entries = getSitemapEntries();
  const urls = entries.map(
    (e) =>
      `  <url>\n    <loc>${baseUrl}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(buildSitemapXml(), {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
