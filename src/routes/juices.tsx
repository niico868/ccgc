import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { MenuCard } from "@/components/site/MenuCard";
import { JUICES } from "@/lib/menu-data";
import hero from "@/assets/section-juices.jpg";
import { OrderRules } from "@/components/site/OrderRules";
import { OtherSections } from "@/components/site/OtherSections";
import { waLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/juices")({
  head: () => ({ meta: [
    { title: "Pure Cold-Pressed Drinks | Fine Time for Cathy's" },
    { name: "description", content: "Made fresh with organic fruits and vegetables. Clean, natural blends crafted to refresh, fuel, and restore." },
  ]}),
  component: () => (
    <>
      <PageHero
        eyebrow="Cold-Pressed Juices"
        title="Pure Cold-Pressed Drinks"
        intro="Made fresh with organic fruits and vegetables. Clean, natural blends crafted to refresh, fuel, and restore. Sold in sets of 6 (300 ml bottles)."
        image={hero}
      />
      <Section className="py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {JUICES.map((s) => <MenuCard key={s.id} item={s} />)}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/salads" className="inline-flex h-11 items-center gap-2 rounded-full bg-leaf px-6 text-sm font-extrabold text-primary-foreground hover:opacity-90">
            Browse Salads
          </Link>
          <a href={waLink("Hi! I'd like to order cold-pressed juices.")} target="_blank" rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-extrabold text-white hover:brightness-105">
            <MessageCircle className="h-4 w-4 fill-white" /> Order on WhatsApp
          </a>
        </div>
      </Section>
      <Section className="pb-14"><OrderRules /></Section>
      <Section className="pb-16"><OtherSections except="juice" /></Section>
    </>
  ),
});
