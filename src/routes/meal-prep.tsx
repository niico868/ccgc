import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { CompactPageHeader, OrderingAccordion } from "@/components/site/OrderingAccordion";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/meal-prep")({
  head: () => ({ meta: [
    { title: "Meal Prep Plans | Fine Time for Cathy's Clean Green Classics" },
    { name: "description", content: "Five, eight, and twelve meal plans for clean, convenient eating all week." },
  ]}),
  component: MealPrep,
});

const PLANS = [
  {
    name: "Five Meal Plan",
    price: "$375",
    desc: "Five clean meals to start your week light and balanced.",
    includes: ["5 chef-built meals", "Balanced macros", "Protein choice", "Pickup or delivery"],
  },
  {
    name: "Eight Meal Plan",
    price: "$580",
    desc: "Eight fresh meals for a balanced week with more convenience.",
    includes: ["8 chef-built meals", "Lunch and dinner variety", "Protein choice", "Pickup or delivery"],
  },
  {
    name: "Twelve Meal Plan",
    price: "$840",
    desc: "Twelve clean meals for full-week planning, convenience, and consistency.",
    includes: ["12 chef-built meals", "Maximum variety", "Protein choice", "Pickup or delivery"],
  },
];

function MealPrep() {
  return (
    <>
      <CompactPageHeader
        eyebrow="Meal Prep Plans"
        title="Eat clean. All week."
        intro="Fresh, affordable meals made for convenience, balance, and flavor."
      />

      <Section className="py-10">
        <div className="flex flex-col gap-5">
          {PLANS.map((p) => (
            <div key={p.name} className="grid items-center gap-5 rounded-3xl border-2 border-leaf/20 bg-card p-6 shadow-card lg:grid-cols-[1fr_auto] lg:p-8">
              <div>
                <div className="text-display text-2xl font-extrabold text-leaf-deep">{p.name}</div>
                <p className="mt-1 text-sm text-foreground/80">{p.desc}</p>
                <div className="mt-3 text-2xl font-extrabold text-leaf">{p.price}</div>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                  {p.includes.map((i) => (
                    <li key={i} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-leaf" /> {i}</li>
                  ))}
                </ul>
              </div>
              <Link to="/meal-plan-selection"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-leaf px-7 text-sm font-extrabold text-primary-foreground hover:opacity-90">
                View Meal Plan <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border-2 border-brown/30 bg-brown/10 px-5 py-4 text-center text-sm font-bold text-brown">
          Seafood meals cost $5 more each. Our 5-meal combos can be delivered or picked up once or twice a week.
        </div>
      </Section>

      <Section className="pb-14"><OrderingAccordion /></Section>
    </>
  );
}
