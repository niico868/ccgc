import { createFileRoute } from "@tanstack/react-router";
import { CategoryMenuView } from "@/components/site/CategoryMenuView";
import { Section } from "@/components/site/Section";

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
