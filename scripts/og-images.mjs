// Generates the 1200x630 link-preview images in public/og/.
// Run after adding or renaming a dish:
//   1. npm run dev -- --host 127.0.0.1 --port 5199
//   2. OG_BASE=http://127.0.0.1:5199 node scripts/og-images.mjs
// Needs Playwright with Chromium available (npx playwright install chromium).
import { createRequire } from "node:module";
import { readFileSync, mkdirSync } from "node:fs";

// Loaded with require so a globally installed Playwright also works (it is not a site dependency).
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = process.env.OG_BASE ?? "http://127.0.0.1:5199";

/** Inline SVG markup for a Lucide icon, read from the installed lucide-react package. */
function icon(name) {
  const src = readFileSync(`node_modules/lucide-react/dist/esm/icons/${name}.js`, "utf8");
  const nodes = Function(`return ${src.match(/__iconNode = (\[[\s\S]*?\]);/)[1]}`)();
  return nodes
    .map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== "key").map(([k, v]) => `${k}="${v}"`).join(" ")}/>`)
    .join("");
}
const ICONS = { salad: icon("salad"), meal: icon("soup"), juice: icon("cup-soda") };

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const html = ({ kind, eyebrow, title, sub }) => `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@500;700&display=block" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;font-family:'DM Sans',sans-serif;background:#FFF8EA;position:relative;overflow:hidden;color:#1F5A35}
.bg{position:absolute;inset:0;background:radial-gradient(circle at 92% 8%,rgba(169,217,90,.45),transparent 38%),radial-gradient(circle at 0% 100%,rgba(246,233,107,.45),transparent 40%)}
.bar{position:absolute;left:0;right:0;bottom:0;height:14px;background:linear-gradient(90deg,#F6E96B 0%,#A9D95A 55%,#2F7D32 100%)}
.wrap{position:relative;display:flex;align-items:center;gap:64px;height:100%;padding:0 80px 110px}
.badge{flex:none;width:300px;height:300px;border-radius:50%;background:#1F5A35;display:grid;place-items:center;box-shadow:0 30px 60px -20px rgba(31,90,53,.55)}
.badge svg{width:180px;height:180px;stroke:#FFF8EA;stroke-width:1.5;fill:none;stroke-linecap:round;stroke-linejoin:round}
.eyebrow{font-weight:700;font-size:24px;letter-spacing:.2em;text-transform:uppercase;color:#4E9A55}
h1{font-family:'DM Serif Display',serif;font-weight:400;font-size:${title.length > 34 ? 58 : 72}px;line-height:1.05;margin-top:14px}
.sub{margin-top:20px;font-size:27px;font-weight:500;color:#5b4632}
.foot{position:absolute;left:80px;right:80px;bottom:40px;display:flex;align-items:center;justify-content:space-between}
.foot img{height:88px}
.url{font-size:24px;font-weight:700;color:#1F5A35;letter-spacing:.02em}
</style></head><body><div class="bg"></div>
<div class="wrap"><div class="badge"><svg viewBox="0 0 24 24">${ICONS[kind]}</svg></div>
<div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1><div class="sub">${esc(sub)}</div></div></div>
<div class="foot"><img src="${BASE}/images/ccgc-nav-logo.webp"><div class="url">cathyscleangreenclassics.com</div></div>
<div class="bar"></div></body></html>`;

// The dish list comes from the running site's /llms-full.txt, so it never drifts from menu-data.ts.
const res = await fetch(`${BASE}/llms-full.txt`).catch(() => null);
if (!res?.ok) throw new Error(`Start the dev server first, then set OG_BASE (tried ${BASE}).`);
const text = await res.text();
const section = (heading) => text.split(heading)[1]?.split("\n## ")[0] ?? "";
const dishesIn = (block, kind) =>
  [...block.matchAll(/^- \[(.+?)\]\(.+?\/menu\/(.+?)\): \$(\d+) TTD/gm)].map((m) => ({ title: m[1], slug: m[2], price: m[3], kind }));
const dishes = [
  ...dishesIn(section("## Custom salads"), "salad"),
  ...dishesIn(section("## Healthy meals"), "meal"),
  ...dishesIn(section("## Diabetic-friendly cold-pressed juices"), "juice"),
];

const EYEBROW = { salad: "Custom salad", meal: "Healthy meal", juice: "Cold-pressed juice" };
const cards = [
  { file: "default", kind: "salad", eyebrow: "Trinidad & Tobago", title: "Fresh salads, healthy meals & diabetic-friendly juices", sub: "Delivery & pickup · Monday, Wednesday & Friday" },
  { file: "salads", kind: "salad", eyebrow: "Custom salads", title: "Made-to-order salads", sub: "$45 TTD · Your choice of protein · Made fresh on the day" },
  { file: "meals", kind: "meal", eyebrow: "Healthy meals", title: "Healthy homestyle meals", sub: "$50 TTD · New menu every week · Vegetarian option" },
  { file: "juices", kind: "juice", eyebrow: "Diabetic-friendly", title: "Cold-pressed juices, no added sugar", sub: "$18 TTD · Beetroot · Watermelon · Mixed Veg · Ginger shots" },
  ...dishes.map((d) => ({
    file: d.slug,
    kind: d.kind,
    eyebrow: EYEBROW[d.kind],
    title: d.title,
    sub: d.kind === "juice" ? `$${d.price} TTD · No added sugar · Diabetic-friendly` : `$${d.price} TTD · Choice of protein · Delivery in Trinidad`,
  })),
];

mkdirSync("public/og", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of cards) {
  await page.setContent(html(c), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/og/${c.file}.png` });
  console.log(`public/og/${c.file}.png`);
}
await browser.close();
