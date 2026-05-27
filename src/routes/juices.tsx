import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { MenuCard } from "@/components/site/MenuCard";
import { JUICES } from "@/lib/menu-data";
import { OrderingAccordion, CompactPageHeader } from "@/components/site/OrderingAccordion";
import { CategoryTabs } from "@/components/site/CategoryTabs";
import { MinimumNotice } from "@/components/site/MinimumNotice";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/juices")({
  head: () => ({ meta: [
    { title: "Cold-Pressed Juices | Cathy's Clean Green Classics" },
    { name: "description", content: "Beetroot, mixed vegetables, green juice and ginger shots. Minimum 6 drinks per order." },
  ]}),
  component: () => (
    <>
      <CompactPageHeader
        eyebrow="Cold-Pressed Juices"
        title="Pure Cold-Pressed Drinks"
        intro="Made fresh with organic produce. Minimum 6 drinks per order."
      />
      <Section className="pt-6 pb-2">
        <CategoryTabs active="/juices" />
      </Section>
      <Section className="pt-6 pb-4">
        <MinimumNotice kind="drink" />
      </Section>
      <Section className="pb-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {JUICES.map((s) => <MenuCard key={s.id} item={s} />)}
        </div>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton href={waLink("Hi! I'd like to order cold-pressed juices.")}>Order on WhatsApp</WhatsAppButton>
        </div>
      </Section>
      <Section className="pb-14"><OrderingAccordion /></Section>
    </>
  ),
});
