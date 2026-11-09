import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { CompactPageHeader } from "@/components/site/OrderingAccordion";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import {
  ALL_ITEMS,
  CATEGORY_INFO,
  JUICES,
  MEALS,
  SALADS,
  dishPath,
  fmt,
  type MenuItem,
} from "@/lib/menu-data";
import { FACTS, SITE_URL } from "@/lib/site-facts";
import { waLink } from "@/lib/whatsapp";

const URL = `${SITE_URL}/about`;
const TITLE = "About & Quick Facts: Healthy Meals in Trinidad | Cathy's Clean Green Classics";
const DESC =
  "Quick facts about Cathy's Clean Green Classics: fresh salads, healthy meals and diabetic-friendly cold-pressed juices in Trinidad. Prices, delivery areas, pickup, order days and how to order.";

const FACT_ROWS: [string, string][] = [
  [
    "What we make",
    "Custom salads, healthy homestyle meals, and diabetic-friendly cold-pressed juices and ginger shots with no added sugar.",
  ],
  ["Where", `${FACTS.country}. Delivery ${FACTS.delivery}.`],
  ["Order days", `${FACTS.orderDays}. Order by ${FACTS.cutoff}, or book ${FACTS.bookAhead}.`],
  ["Pickup", FACTS.pickup.join(" · ")],
  ["Delivery fees", FACTS.deliveryFees],
  [
    "Prices",
    `Salads ${FACTS.prices.salad} · Meals ${FACTS.prices.meal} · Juices ${FACTS.prices.juice} · Ginger shots ${FACTS.prices.gingerShot}. ${FACTS.prices.premiumProtein}.`,
  ],
  ["Minimums", FACTS.minimums],
  ["Proteins", `${FACTS.proteins}. ${FACTS.vegetarian}`],
  ["Weekly menu", FACTS.rotation],
  ["Catering", FACTS.catering],
  ["How to order", FACTS.ordering],
  [
    "Contact",
    `${FACTS.phone} (call or WhatsApp) · ${FACTS.email} · Instagram ${FACTS.instagramHandle}`,
  ],
];

const QA: { q: string; a: string }[] = [
  {
    q: "Where can I get healthy meals delivered in Trinidad?",
    a: `Cathy's Clean Green Classics prepares fresh salads, healthy homestyle meals and cold-pressed juices in Trinidad and delivers ${FACTS.delivery} on ${FACTS.orderDays}. Pickup is also available at ${FACTS.pickup.join(" or ")}. Order online at cathyscleangreenclassics.com or on WhatsApp at ${FACTS.phone}.`,
  },
  {
    q: "Where can I buy diabetic-friendly juice in Trinidad?",
    a: `Cathy's Clean Green Classics makes diabetic-friendly cold-pressed juices (beetroot, watermelon, mixed veg) and ginger shots with no added sugar, from specially sourced produce. Juices are ${FACTS.prices.juice} and shots ${FACTS.prices.gingerShot}. ${FACTS.diabetic.split(". ").slice(1).join(". ")}`,
  },
  {
    q: "Is there a meal-prep service in Trinidad for the elderly or shut-ins?",
    a: `Yes. ${FACTS.catering} Contact Cathy's team on WhatsApp at ${FACTS.phone} to set up regular deliveries; recurring weekly or monthly orders can be requested at checkout.`,
  },
  {
    q: "Which areas do you deliver to?",
    a: `Delivery runs ${FACTS.delivery}. ${FACTS.deliveryFees}. Outside these areas, choose pickup at ${FACTS.pickup.join(" or ")}.`,
  },
  {
    q: "How much do the salads and meals cost?",
    a: `Salads are ${FACTS.prices.salad} and healthy meals ${FACTS.prices.meal}, with a choice of protein. ${FACTS.prices.premiumProtein}. ${FACTS.minimums}`,
  },
  {
    q: "Do you have vegetarian options?",
    a: `Yes, every salad and meal can be made vegetarian. ${FACTS.vegetarian}`,
  },
];

function MenuList({ items }: { items: MenuItem[] }) {
  return (
    <ul className="mt-3 space-y-1.5 text-sm">
      {items.map((i) => (
        <li key={i.id} className="flex justify-between gap-3 border-b border-border/60 pb-1.5">
          <Link to={dishPath(i)} className="font-medium text-leaf-deep hover:underline">
            {i.name}
          </Link>
          <span className="shrink-0 text-foreground/70">{fmt(i.price)}</span>
        </li>
      ))}
    </ul>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              "@id": `${URL}#page`,
              url: URL,
              name: TITLE,
              description: DESC,
              about: { "@id": `${SITE_URL}/#business` },
              mainEntity: { "@id": `${SITE_URL}/#business` },
            },
            {
              "@type": "FAQPage",
              mainEntity: QA.map((qa) => ({
                "@type": "Question",
                name: qa.q,
                acceptedAnswer: { "@type": "Answer", text: qa.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <CompactPageHeader
        eyebrow="About & quick facts"
        title="Healthy meals, fresh salads and diabetic-friendly juices in Trinidad"
        intro={FACTS.summary}
      />

      <Section className="pt-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <h2 className="text-display text-2xl text-leaf-deep">Quick facts</h2>
            <dl className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {FACT_ROWS.map(([k, v]) => (
                <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="text-xs font-bold uppercase tracking-wider text-leaf">{k}</dt>
                  <dd className="text-sm leading-relaxed text-foreground/85">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/salads"
                className="inline-flex h-11 items-center rounded-full bg-leaf-deep px-5 text-sm font-semibold text-cream"
              >
                Start your order
              </Link>
              <WhatsAppButton href={waLink("Hi! I have a question about ordering.")}>
                Ask on WhatsApp
              </WhatsAppButton>
            </div>
          </div>

          <aside className="min-w-0 rounded-2xl border border-border bg-secondary/40 p-5">
            <h2 className="text-display text-xl text-leaf-deep">The menu</h2>
            <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-leaf">
              <Link to={CATEGORY_INFO.salad.path} className="hover:underline">
                {CATEGORY_INFO.salad.label}
              </Link>
            </h3>
            <MenuList items={SALADS} />
            <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-leaf">
              <Link to={CATEGORY_INFO.meal.path} className="hover:underline">
                {CATEGORY_INFO.meal.label}
              </Link>{" "}
              (weekly rotation)
            </h3>
            <MenuList items={MEALS} />
            <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-leaf">
              <Link to={CATEGORY_INFO.juice.path} className="hover:underline">
                {CATEGORY_INFO.juice.label}
              </Link>
            </h3>
            <MenuList items={JUICES} />
            <p className="mt-4 text-xs text-muted-foreground">
              Prices in TTD, per item. {ALL_ITEMS.length} dishes in total.
            </p>
          </aside>
        </div>
      </Section>

      <Section className="py-12">
        <h2 className="text-display text-2xl text-leaf-deep">Questions people ask</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {QA.map((qa) => (
            <article key={qa.q} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-display text-lg leading-snug text-leaf-deep">{qa.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{qa.a}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          More answers on the{" "}
          <Link to="/faq" className="font-semibold text-leaf-deep underline">
            FAQ page
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
