import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { MenuCard } from "@/components/site/MenuCard";
import { SALADS, SALAD_INGREDIENTS } from "@/lib/menu-data";
import hero from "@/assets/section-salads.jpg";
import { OrderRules, FirstTimerCard } from "@/components/site/OrderRules";
import { OtherSections } from "@/components/site/OtherSections";
import { waLink } from "@/lib/whatsapp";
import { MessageCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/salads")({
  head: () => ({ meta: [
    { title: "Cathy's Clean Green Classics Salads" },
    { name: "description", content: "Fresh, made-to-order salads with clean greens, fruits, nuts, seeds, and your choice of protein." },
  ]}),
  component: SaladsPage,
});

function SaladsPage() {
  return (
    <>
      <PageHero
        eyebrow="Custom Salads"
        title="Cathy's Clean Green Classics Salads"
        intro="Fresh, made-to-order salads prepared with clean greens, fruits, nuts, seeds, vegetables, and your choice of chicken, fish, shrimp, or vegan options. Choose from our specialty salads or freestyle your own from the full ingredient list."
        image={hero}
      />

      <Section className="py-10">
        <div className="rounded-3xl border-2 border-leaf/25 bg-cream p-6 lg:p-8">
          <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-tomato">Important salad ordering info</div>
          <div className="mt-3 grid gap-4 text-sm text-foreground/85 sm:grid-cols-2 lg:grid-cols-3">
            <p><span className="font-bold text-leaf-deep">Made:</span> Mondays, Wednesdays, and Fridays only.</p>
            <p><span className="font-bold text-leaf-deep">Order by:</span> 8 AM on salad days. Pre-orders only.</p>
            <p><span className="font-bold text-leaf-deep">Freshness:</span> Salads stay fresh up to 5 days.</p>
            <p><span className="font-bold text-leaf-deep">Pickup, St Clair:</span> 11 AM to 1 PM.</p>
            <p><span className="font-bold text-leaf-deep">Pickup, Trincity:</span> 2 PM to 6 PM.</p>
            <p><span className="font-bold text-leaf-deep">Payment:</span> Online or cash on delivery.</p>
          </div>
        </div>
      </Section>

      <Section className="pb-10">
        <div className="mb-6 text-center">
          <h2 className="text-display text-2xl font-extrabold lg:text-3xl">Specialty salads</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pick a favorite. Note any ingredients you do not like.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {SALADS.map((s) => <MenuCard key={s.id} item={s} />)}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={waLink("Hi! I'd like to order salads.")} target="_blank" rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-extrabold text-white hover:brightness-105">
            <MessageCircle className="h-4 w-4 fill-white" /> Order on WhatsApp
          </a>
        </div>
      </Section>

      <Section className="pb-14">
        <div className="rounded-3xl border-2 border-citrus/40 bg-gradient-to-br from-citrus/15 to-cream p-7 lg:p-10">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.22em] text-leaf-deep">
            <Sparkles className="h-4 w-4" /> Build Your Own Salad
          </div>
          <p className="mt-2 max-w-2xl text-sm text-foreground/85">
            Choose what you love. Leave out what you do not. Cathy's Clean Green Classics salads can be built from the fresh ingredient list below.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Object.entries(SALAD_INGREDIENTS).map(([group, items]) => (
              <div key={group} className="rounded-2xl border border-border bg-white p-5">
                <div className="text-sm font-extrabold uppercase tracking-wide text-leaf-deep">{group}</div>
                <p className="mt-2 text-sm text-foreground/80">{items}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/catering"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-leaf px-6 text-sm font-extrabold text-primary-foreground hover:opacity-90">
              Build My Salad (request)
            </Link>
          </div>
        </div>
      </Section>

      <Section className="pb-14"><FirstTimerCard /></Section>
      <Section className="pb-14"><OrderRules /></Section>
      <Section className="pb-16"><OtherSections except="salad" /></Section>
    </>
  );
}
