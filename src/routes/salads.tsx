import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { MenuCard } from "@/components/site/MenuCard";
import { SALADS } from "@/lib/menu-data";
import { FirstTimerCard } from "@/components/site/OrderRules";
import { OrderingAccordion, CompactPageHeader } from "@/components/site/OrderingAccordion";
import { CategoryTabs } from "@/components/site/CategoryTabs";
import { MinimumNotice } from "@/components/site/MinimumNotice";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/salads")({
  head: () => ({ meta: [
    { title: "Custom Salads | Cathy's Clean Green Classics" },
    { name: "description", content: "Fresh, made-to-order salads from $40. Choose chicken, fish, shrimp, or vegan." },
  ]}),
  component: SaladsPage,
});

function SaladsPage() {
  return (
    <>
      <CompactPageHeader
        eyebrow="Custom Salads"
        title="Cathy's Clean Green Classics Salads"
        intro="Salads from $40. Seafood adds $5 per salad. Minimum 5 meals per order."
      />

      <Section className="pt-6 pb-2">
        <CategoryTabs active="/salads" />
      </Section>

      <Section className="pt-6 pb-4">
        <MinimumNotice kind="food" />
      </Section>

      <Section className="pb-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {SALADS.map((s) => <MenuCard key={s.id} item={s} />)}
        </div>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton href={waLink("Hi! I'd like to order salads.")}>Order on WhatsApp</WhatsAppButton>
        </div>
      </Section>

      <Section className="pb-14"><FirstTimerCard /></Section>
      <Section className="pb-14"><OrderingAccordion /></Section>
    </>
  );
}
