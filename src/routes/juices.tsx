import { createFileRoute } from "@tanstack/react-router";
import { CategoryMenuView } from "@/components/site/CategoryMenuView";

export const Route = createFileRoute("/juices")({
  head: () => ({
    meta: [
      { title: "Cold-Pressed Juices | Cathy's Clean Green Classics" },
      { name: "description", content: "Beetroot, mixed vegetables, green juice and ginger shots. Minimum 6 drinks per order." },
      { property: "og:url", content: "https://ccgc.lovable.app/juices" },
    ],
    links: [
      { rel: "canonical", href: "https://ccgc.lovable.app/juices" },
    ],
  }),
  component: () => <CategoryMenuView active="juice" />,
});
