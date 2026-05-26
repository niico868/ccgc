import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { MenuCard } from "@/components/site/MenuCard";
import { JUICES } from "@/lib/menu-data";
import hero from "@/assets/section-juices.jpg";
import { OrderRules } from "@/components/site/OrderRules";
import { OtherSections } from "@/components/site/OtherSections";

export const Route = createFileRoute("/juices")({
  head: () => ({ meta: [
    { title: "Cold-Pressed Juices — Fine Time for Cathy's" },
    { name: "description", content: "Fresh fruit and vegetable blends made to refresh, fuel and restore." },
  ]}),
  component: () => (
    <>
      <PageHero eyebrow="Cold-Pressed Juices" title="Bright. Cold. Honest."
        intro="Pressed fresh from real produce — no shortcuts, no concentrates."
        image={hero} />
      <Section className="py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {JUICES.map((s) => <MenuCard key={s.id} item={s} />)}
        </div>
      </Section>
      <Section className="pb-20"><OtherSections except="juice" /></Section>
      <Section className="pb-20"><OrderRules /></Section>
    </>
  ),
});
