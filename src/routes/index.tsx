import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Quote, Truck } from "lucide-react";
import hero from "@/assets/hero-salad.jpg";
import salads from "@/assets/section-salads.jpg";
import meals from "@/assets/section-meals.jpg";
import juices from "@/assets/section-juices.jpg";
import mealprep from "@/assets/section-mealprep.jpg";
import { waLink } from "@/lib/whatsapp";
import { Section } from "@/components/site/Section";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fine Time for Cathy's Clean Green Classics" },
      { name: "description", content: "Homemade salads, healthy meals, and cold-pressed juices. Made fresh in Trinidad and Tobago." },
    ],
  }),
  component: Home,
});

const SECTIONS = [
  {
    to: "/salads",
    title: "Custom Salads",
    image: salads,
    desc: "Fresh greens, clean toppings, and your choice of protein.",
    benefit: "Fresh. Custom. Filling.",
    objectPosition: "center 50%",
  },
  {
    to: "/meals",
    title: "Healthy Meals",
    image: meals,
    desc: "Balanced bowls with grains, vegetables, legumes, and seeds.",
    benefit: "Wholesome. Convenient.",
    objectPosition: "center 55%",
  },
  {
    to: "/juices",
    title: "Cold-Pressed Juices",
    image: juices,
    desc: "Fresh fruit and vegetable blends to refresh and restore.",
    benefit: "Fresh. Natural.",
    objectPosition: "center 70%",
  },
];

const PLANS = [
  { name: "Five Meal Plan", price: "$375", desc: "Five clean meals to start your week balanced." },
  { name: "Eight Meal Plan", price: "$580", desc: "Eight fresh meals for a balanced week." },
  { name: "Twelve Meal Plan", price: "$840", desc: "Twelve clean meals for full-week planning." },
];

const REVIEWS = [
  { name: "Aaliyah R.", text: "The Broccoli Power Bowl is the best lunch in my week. Fresh, filling, beautifully packed." },
  { name: "Marcus D.", text: "Cathy's juices taste like they were pressed five minutes ago." },
  { name: "Simone J.", text: "Premium from start to finish. Everyone asked who made the salads." },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={hero}
          alt="Fresh salad bowl on a teak counter"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0 -z-10" />

        <div className="mx-auto flex max-w-7xl flex-col items-start px-4 pb-24 pt-16 text-cream lg:pb-32 lg:pt-24 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-cream/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-leaf-deep shadow-card">
              Made Fresh in Trinidad &amp; Tobago
            </div>
            <h1 className="mt-5 text-display text-4xl leading-[1.05] text-cream drop-shadow-sm lg:text-6xl">
              Clean Green Classics,<br />Made Fresh Daily.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/95 lg:text-lg">
              Homemade salads, healthy meals, and cold-pressed juices prepared fresh in Trinidad &amp; Tobago.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/salads"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-leaf-deep px-8 text-sm font-semibold text-cream shadow-soft transition hover:opacity-95"
              >
                Start Your Order <ArrowRight className="h-4 w-4" />
              </Link>
              <WhatsAppButton href={waLink("Hi! I'd like to ask about today's menu.")}>
                WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </section>

      {/* NOTICE BAR */}
      <div className="border-b border-border bg-leaf-deep text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-center text-sm font-medium lg:px-8">
          <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-citrus" /> Salads close 8 AM (Mon, Wed, Fri). Daily orders close 9 AM.</span>
          <span className="hidden h-1 w-1 rounded-full bg-cream/40 sm:inline-block" />
          <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-citrus" /> Delivery from 2 PM</span>
        </div>
      </div>

      {/* MENU SECTIONS */}
      <Section className="py-20 lg:py-24">
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-soft">Menu Today</div>
          <h2 className="mt-2 text-display text-3xl text-leaf-deep lg:text-4xl">Clean Green Classics</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Real food, beautifully made.</p>
        </div>
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {SECTIONS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:shadow-soft sm:grid-cols-[40%_1fr]"
            >
              <div className="relative aspect-[16/9] overflow-hidden sm:aspect-auto sm:min-h-[180px]">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  style={{ objectPosition: s.objectPosition }}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2 p-6 lg:p-7">
                <h3 className="text-display text-xl text-leaf-deep lg:text-2xl">{s.title}</h3>
                <p className="text-sm text-foreground/80">{s.desc}</p>
                <div className="text-xs font-semibold uppercase tracking-wider text-leaf-soft">{s.benefit}</div>
                <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-leaf-deep">
                  Browse Menu <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* MEAL PREP */}
      <Section className="pb-16 lg:pb-20">
        <div className="overflow-hidden rounded-3xl border border-leaf-soft/30 bg-cream p-7 shadow-card lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-soft">Meal Prep Plans</div>
              <h2 className="mt-2 text-display text-3xl text-leaf-deep lg:text-4xl">Plan your week the clean way.</h2>
              <p className="mt-3 max-w-lg text-foreground/80">
                Lunches are prepared Monday and Wednesday. Meal plan orders are split across two collection/delivery days each week for better variety.
              </p>
              <Link
                to="/meal-prep"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-leaf-deep px-6 text-sm font-semibold text-cream hover:opacity-90"
              >
                View All Plans <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <img src={mealprep} alt="Meal prep containers" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card" />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {PLANS.map((p) => (
              <div key={p.name} className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="text-display text-lg text-leaf-deep">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.desc}</div>
                  <div className="mt-1 text-xl font-bold text-leaf-deep">{p.price}</div>
                </div>
                <Link
                  to="/meal-prep"
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-leaf-deep px-5 text-sm font-semibold text-cream hover:opacity-90"
                >
                  View Plan <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-leaf-soft/30 bg-leaf-soft/10 px-4 py-3 text-center text-sm font-semibold text-leaf-deep">
            Minimum 5 meals per order · Seafood adds $5 per meal.
          </div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section className="pb-16 lg:pb-20">
        <div className="mb-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-soft">Loved by regulars</div>
          <h2 className="mt-2 text-display text-3xl text-leaf-deep lg:text-4xl">What our community says</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-3xl border border-border bg-card p-7 shadow-card">
              <Quote className="h-7 w-7 text-citrus" />
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">"{r.text}"</blockquote>
              <figcaption className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </>
  );
}
