import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { MenuCard } from "@/components/site/MenuCard";
import { MEALS } from "@/lib/menu-data";
import hero from "@/assets/section-meals.jpg";
import { OrderRules } from "@/components/site/OrderRules";
import { OtherSections } from "@/components/site/OtherSections";

export const Route = createFileRoute("/meals")({
  head: () => ({ meta: [
    { title: "Healthy Meals — Fine Time for Cathy's" },
    { name: "description", content: "Balanced gourmet-style lunches made for clean eating and real satisfaction." },
  ]}),
  component: () => (
    <>
      <PageHero eyebrow="Healthy Meals" title="Balanced plates, made clean."
        intro="Gourmet-style lunches with thoughtful proteins, fresh sides, and the flavors of home."
        image={hero} />
      <Section className="py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEALS.map((s) => <MenuCard key={s.id} item={s} />)}
        </div>
      </Section>
      <Section className="pb-20"><OtherSections except="meal" /></Section>
      <Section className="pb-20"><OrderRules /></Section>
    </>
  ),
});
