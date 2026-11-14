import { createFileRoute } from "@tanstack/react-router";
import { CategoryMenuView } from "@/components/site/CategoryMenuView";
import { MEALS, dishPath } from "@/lib/menu-data";

const TITLE = "Healthy Homestyle Meals in Trinidad | Cathy's Clean Green Classics";
const DESC = "Weekly rotating meals in Trinidad: Quinoa Chow Mein, Basil Sweet Potato, Cumin Basmati, Roasted Vegetable Medley, Zesty Herb, Mediterranean Mex and Moroccan Chicken & Couscous. Monday, Wednesday and Friday delivery 11 AM to about 2 PM.";
const URL = "https://cathyscleangreenclassics.com/meals";

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
      { property: "og:image", content: "https://cathyscleangreenclassics.com/og/meals.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Cathy's Clean Green Classics healthy homestyle meals" },
      { name: "twitter:image", content: "https://cathyscleangreenclassics.com/og/meals.png" },
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
            url: `https://cathyscleangreenclassics.com${dishPath(m)}`,
            offers: { "@type": "Offer", price: m.price, priceCurrency: "TTD" },
          })),
        }],
      }),
    }],
  }),
  component: () => <CategoryMenuView active="meal" />,
});
