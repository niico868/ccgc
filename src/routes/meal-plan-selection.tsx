import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/meal-plan-selection")({
  head: () => ({ meta: [
    { title: "Meal Plan Selection Coming Soon | Fine Time for Cathy's" },
    { name: "description", content: "Choose from 5, 8, or 12 meal plans. Full meal selection and customization will be available soon." },
  ]}),
  component: () => (
    <Section className="py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border-2 border-leaf/20 bg-cream p-10 text-center shadow-card lg:p-14">
        <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-leaf">Meal Prep</div>
        <h1 className="mt-3 text-display text-3xl font-extrabold text-leaf-deep lg:text-4xl">Meal Plan Selection Coming Soon</h1>
        <p className="mt-4 text-base text-foreground/80">
          Choose from 5, 8, or 12 meal plans. Full meal selection and customization will be available soon.
        </p>
        <Link to="/meal-prep"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-leaf px-7 text-sm font-extrabold text-primary-foreground hover:opacity-90">
          <ArrowLeft className="h-4 w-4" /> Back to Meal Plans
        </Link>
      </div>
    </Section>
  ),
});
