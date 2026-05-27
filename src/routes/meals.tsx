import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { MenuCard } from "@/components/site/MenuCard";
import { MEALS } from "@/lib/menu-data";
import { OrderingAccordion, CompactPageHeader } from "@/components/site/OrderingAccordion";
import { CategoryTabs } from "@/components/site/CategoryTabs";
import { MinimumNotice } from "@/components/site/MinimumNotice";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/meals")({
  head: () => ({ meta: [
    { title: "Healthy Meals | Cathy's Clean Green Classics" },
    { name: "description", content: "Balanced, clean meals with grains, vegetables, legumes, and your choice of protein." },
  ]}),
  component: () => (
    <>
      <CompactPageHeader
        eyebrow="Healthy Meals"
        title="Healthy Meals"
        intro="Balanced bowls with your choice of protein. Seafood adds $5 per meal. Minimum 5 meals per order."
      />
      <Section className="pt-6 pb-2">
        <CategoryTabs active="/meals" />
      </Section>
      <Section className="pt-6 pb-4">
        <MinimumNotice kind="food" />
      </Section>
      <Section className="pb-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEALS.map((s) => <MenuCard key={s.id} item={s} />)}
        </div>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton href={waLink("Hi! I'd like to order healthy meals.")}>Order on WhatsApp</WhatsAppButton>
        </div>
      </Section>
      <Section className="pb-14"><OrderingAccordion /></Section>
    </>
  ),
});
