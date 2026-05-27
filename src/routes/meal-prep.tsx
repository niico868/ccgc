import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { CompactPageHeader, OrderingAccordion } from "@/components/site/OrderingAccordion";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/meal-prep")({
  head: () => ({ meta: [
    { title: "Meal Prep Plans | Cathy's Clean Green Classics" },
    { name: "description", content: "Five, eight, and twelve meal plans split across two collection days per week." },
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
    desc: "Eight fresh meals for a balanced week.",
    includes: ["8 chef-built meals", "Lunch and dinner variety", "Protein choice", "Pickup or delivery"],
  },
  {
    name: "Twelve Meal Plan",
    price: "$840",
    desc: "Twelve clean meals for full-week planning and consistency.",
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

      <Section className="py-8">
        <div className="rounded-2xl border border-leaf-soft/30 bg-leaf-soft/10 px-5 py-4 text-center text-sm font-semibold text-leaf-deep">
          Lunches are prepared <span className="font-bold">Monday</span> and <span className="font-bold">Wednesday</span>. Meal plan orders are split across two collection/delivery days each week for better variety.
        </div>
      </Section>

      <Section className="py-2">
        <div className="flex flex-col gap-5">
          {PLANS.map((p) => (
            <div key={p.name} className="grid items-center gap-5 rounded-3xl border-2 border-leaf-soft/30 bg-card p-6 shadow-card lg:grid-cols-[1fr_auto] lg:p-8">
              <div>
                <div className="text-display text-2xl text-leaf-deep">{p.name}</div>
                <p className="mt-1 text-sm text-foreground/80">{p.desc}</p>
                <div className="mt-3 text-2xl font-bold text-leaf-deep">{p.price}</div>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                  {p.includes.map((i) => (
                    <li key={i} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-leaf-soft" /> {i}</li>
                  ))}
                </ul>
              </div>
              <Link
                to="/meal-plan-selection"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-leaf-deep px-7 text-sm font-semibold text-cream hover:opacity-90"
              >
                View Meal Plan <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-brown/30 bg-brown/10 px-5 py-4 text-center text-sm font-semibold text-brown">
          Minimum 5 meals per order. Seafood (shrimp or fish) adds $5 per meal.
        </div>
      </Section>

      <Section className="py-12"><OrderingAccordion /></Section>
    </>
  );
}
