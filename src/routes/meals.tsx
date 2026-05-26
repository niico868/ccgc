import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { MenuCard } from "@/components/site/MenuCard";
import { MEALS } from "@/lib/menu-data";
import hero from "@/assets/section-meals.jpg";
import { OrderRules } from "@/components/site/OrderRules";
import { OtherSections } from "@/components/site/OtherSections";
import { waLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/meals")({
  head: () => ({ meta: [
    { title: "Healthy Meals — Fine Time for Cathy's Clean Green Classics" },
    { name: "description", content: "Balanced, clean meals made with grains, roasted vegetables, legumes, seeds and fresh toppings." },
  ]}),
  component: () => (
    <>
      <PageHero
        eyebrow="Healthy Meals"
        title="Healthy Meals"
        intro="Balanced, comforting, and clean meals made with grains, roasted vegetables, legumes, seeds, nuts, and fresh toppings. Built for everyday convenience without losing flavor."
        image={hero}
      />
      <Section className="py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEALS.map((s) => <MenuCard key={s.id} item={s} />)}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/meal-prep" className="inline-flex h-11 items-center gap-2 rounded-full bg-leaf px-6 text-sm font-extrabold text-primary-foreground hover:opacity-90">
            View Meal Prep Plans
          </Link>
          <a href={waLink("Hi! I'd like to order healthy meals.")} target="_blank" rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-extrabold text-white hover:brightness-105">
            <MessageCircle className="h-4 w-4 fill-white" /> Order on WhatsApp
          </a>
        </div>
      </Section>
      <Section className="pb-14"><OrderRules /></Section>
      <Section className="pb-16"><OtherSections except="meal" /></Section>
    </>
  ),
});
