import { createFileRoute } from "@tanstack/react-router";
import { CategoryMenuView } from "@/components/site/CategoryMenuView";
import { SALADS, fmt } from "@/lib/menu-data";

const TITLE = "Fresh Salads in Trinidad | Cathy's Clean Green Classics";
const DESC = "Order fresh salads in Trinidad with chicken, beef, fish, shrimp or vegetarian options. Mix salads and meals toward a 5 item minimum. Delivery or pickup.";
const URL = "https://cathysgreenkitchen.com/salads";

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
