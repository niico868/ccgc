import { createFileRoute } from "@tanstack/react-router";
import { CategoryMenuView } from "@/components/site/CategoryMenuView";

export const Route = createFileRoute("/meals")({
  head: () => ({
    meta: [
      { title: "Healthy Meals | Cathy's Clean Green Classics" },
      { name: "description", content: "Hearty, homestyle bowls — well-seasoned, balanced and properly prepared." },
      { property: "og:url", content: "https://ccgc.lovable.app/meals" },
    ],
    links: [
      { rel: "canonical", href: "https://ccgc.lovable.app/meals" },
    ],
  }),
  component: () => <CategoryMenuView active="meal" />,
});
