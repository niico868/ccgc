import { createFileRoute } from "@tanstack/react-router";
import { CategoryMenuView } from "@/components/site/CategoryMenuView";
import { SALADS, dishPath, fmt } from "@/lib/menu-data";

const TITLE = "Custom Salads in Trinidad | Cathy's Clean Green Classics";
const DESC = "Made-to-order salads with fresh greens and your choice of chicken, fish, shrimp or vegetarian protein. Batches of 5, prepared fresh in Trinidad and Tobago.";
const URL = "https://cathyscleangreenclassics.com/salads";

export const Route = createFileRoute("/salads")({
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
      { property: "og:image", content: "https://cathyscleangreenclassics.com/og/salads.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Cathy's Clean Green Classics made-to-order salads" },
      { name: "twitter:image", content: "https://cathyscleangreenclassics.com/og/salads.png" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Menu",
        name: "Custom Salads",
        hasMenuSection: [{
          "@type": "MenuSection",
          name: "Salads",
          hasMenuItem: SALADS.map((s) => ({
            "@type": "MenuItem",
            name: s.name,
            description: s.description,
            url: `https://cathyscleangreenclassics.com${dishPath(s)}`,
            offers: { "@type": "Offer", price: s.price, priceCurrency: "TTD" },
          })),
        }],
      }),
    }],
  }),
  component: () => <CategoryMenuView active="salad" />,
});

// keep fmt import used
void fmt;
