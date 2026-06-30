import { createFileRoute } from "@tanstack/react-router";
import { CategoryMenuView } from "@/components/site/CategoryMenuView";

export const Route = createFileRoute("/salads")({
  head: () => ({
    meta: [
      { title: "Custom Salads | Cathy's Clean Green Classics" },
      { name: "description", content: "Made-to-order salads with chicken, fish, shrimp or vegan options." },
      { property: "og:url", content: "https://ccgc.lovable.app/salads" },
    ],
    links: [
      { rel: "canonical", href: "https://ccgc.lovable.app/salads" },
    ],
  }),
  component: () => <CategoryMenuView active="salad" />,
});
