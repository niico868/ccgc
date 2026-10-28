import { createFileRoute } from "@tanstack/react-router";
import { CategoryMenuView } from "@/components/site/CategoryMenuView";
import { Section } from "@/components/site/Section";
import { JUICES } from "@/lib/menu-data";

const TITLE = "Diabetic-Friendly Cold-Pressed Juices | Cathy's Clean Green Classics";
const DESC = "Beetroot, watermelon, mixed vegetable juices and ginger wellness shots, no added sugar. Batches of 6, cold-pressed fresh in Trinidad and Tobago.";
const URL = "https://cathysgreenkitchen.com/juices";

export const Route = createFileRoute("/juices")({
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
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Menu",
        name: "Cold-Pressed Juices",
        hasMenuSection: [{
          "@type": "MenuSection",
          name: "Juices & Shots",
          hasMenuItem: JUICES.map((j) => ({
            "@type": "MenuItem",
            name: j.name,
            description: j.description,
            offers: { "@type": "Offer", price: j.price, priceCurrency: "TTD" },
          })),
        }],
      }),
    }],
  }),
  component: JuicesPage,
});

function JuicesPage() {
  return (
    <>
      <Section className="pt-6 pb-0">
        <div className="mx-auto max-w-3xl rounded-2xl border border-leaf-soft/30 bg-cream/80 px-5 py-4 text-center text-sm leading-relaxed text-foreground/85 shadow-card backdrop-blur">
          Our diabetic-friendly cold-pressed juices are carefully made with specially sourced produce and no added sugar, giving you clean refreshment without unnecessary sweetness.
        </div>
      </Section>
      <CategoryMenuView active="juice" />
    </>
  );
}
