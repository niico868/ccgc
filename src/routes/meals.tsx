import { createFileRoute } from "@tanstack/react-router";
import { CategoryMenuView } from "@/components/site/CategoryMenuView";
import { MEALS } from "@/lib/menu-data";

const TITLE = "Healthy Homestyle Meals in Trinidad | Cathy's Clean Green Classics";
const DESC = "Healthy eating made convenient in Trinidad. Order homestyle meals with vegetarian options from our rotating menu for Monday, Wednesday or Friday delivery or pickup.";
const URL = "https://cathysgreenkitchen.com/meals";

export const Route = createFileRoute("/meals")({
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
        name: "Healthy Meals",
        hasMenuSection: [{
          "@type": "MenuSection",
          name: "Healthy Meals",
          hasMenuItem: MEALS.map((m) => ({
            "@type": "MenuItem",
            name: m.name,
            description: m.description,
            offers: { "@type": "Offer", price: m.price, priceCurrency: "TTD" },
          })),
        }],
      }),
    }],
  }),
  component: () => <CategoryMenuView active="meal" />,
});
