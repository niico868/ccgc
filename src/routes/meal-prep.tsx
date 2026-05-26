import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Check } from "lucide-react";
import hero from "@/assets/section-mealprep.jpg";

export const Route = createFileRoute("/meal-prep")({
  head: () => ({ meta: [
    { title: "Meal Prep Plans — Fine Time for Cathy's" },
    { name: "description", content: "5, 8, and 12 meal subscription plans for clean, convenient eating all week." },
  ]}),
  component: MealPrep,
});

const PLANS = [
  { name: "5 Meal Plan", price: "$375", desc: "Five clean meals to start your week light and balanced.",
    includes: ["5 chef-built meals", "Balanced macros", "Protein choice", "Pickup or delivery"] },
  { name: "8 Meal Plan", price: "$580", desc: "Eight meals for steady eating Monday through Friday.",
    includes: ["8 chef-built meals", "Lunch + dinner variety", "Protein choice", "Pickup or delivery"] },
  { name: "12 Meal Plan", price: "$840", desc: "Twelve meals — full coverage for busy weeks and active families.",
    includes: ["12 chef-built meals", "Maximum variety", "Protein choice", "Pickup or delivery"] },
];

function MealPrep() {
  return (
    <>
      <PageHero eyebrow="Meal Prep Plans" title="Eat clean. All week."
        intro="Plan your week with fresh, affordable meals made for convenience, balance, and flavor."
        image={hero} />
      <Section className="py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className="flex flex-col rounded-3xl border border-border bg-card p-7 shadow-card">
              <div className="text-display text-2xl font-semibold">{p.name}</div>
              <div className="mt-1 text-3xl font-bold text-leaf">{p.price}</div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.includes.map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-leaf" /> {i}
                  </li>
                ))}
              </ul>
              <Link to="/contact"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-leaf text-sm font-semibold text-primary-foreground hover:opacity-90">
                Choose This Plan
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">Seafood meals cost $5 more. Final pricing confirmed at checkout.</p>
      </Section>
    </>
  );
}
