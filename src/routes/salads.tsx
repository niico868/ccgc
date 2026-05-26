import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { MenuCard } from "@/components/site/MenuCard";
import { SALADS } from "@/lib/menu-data";
import hero from "@/assets/section-salads.jpg";
import { OrderRules } from "@/components/site/OrderRules";
import { OtherSections } from "@/components/site/OtherSections";

export const Route = createFileRoute("/salads")({
  head: () => ({ meta: [
    { title: "Custom Salads — Fine Time for Cathy's" },
    { name: "description", content: "Fresh, build-your-way salads with grilled proteins, crisp toppings and house-style dressings." },
  ]}),
  component: () => (
    <>
      <PageHero eyebrow="Custom Salads" title="Fresh greens, your way."
        intro="Big leafy bowls, grilled proteins, crisp toppings and bold house-style flavor. Built fresh the morning you order."
        image={hero} />
      <Section className="py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SALADS.map((s) => <MenuCard key={s.id} item={s} />)}
        </div>
      </Section>
      <Section className="pb-20"><OtherSections except="salad" /></Section>
      <Section className="pb-20"><OrderRules /></Section>
    </>
  ),
});
