import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, MessageCircle, Quote, Truck } from "lucide-react";
import hero from "@/assets/hero-salad.jpg";
import salads from "@/assets/section-salads.jpg";
import meals from "@/assets/section-meals.jpg";
import juices from "@/assets/section-juices.jpg";
import mealprep from "@/assets/section-mealprep.jpg";
import catering from "@/assets/section-catering.jpg";
import logo from "@/assets/logo.png";
import { waLink } from "@/lib/whatsapp";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fine Time for Cathy's Clean Green Classics" },
      { name: "description", content: "Custom salads, healthy meals, cold-pressed juices and meal prep. Made fresh in Trinidad and Tobago." },
    ],
  }),
  component: Home,
});

const SECTIONS = [
  {
    to: "/salads",
    title: "Custom Salads",
    image: salads,
    desc: "Made-to-order salads with fresh greens, clean toppings, fruits, nuts, seeds, and your choice of protein.",
    benefit: "Fresh. Custom. Filling.",
    objectPosition: "center 50%",
  },
  {
    to: "/meals",
    title: "Healthy Meals",
    image: meals,
    desc: "Balanced bowls and wellness plates made with grains, vegetables, legumes, seeds, and clean flavor.",
    benefit: "Wholesome. Affordable. Convenient.",
    objectPosition: "center 55%",
  },
  {
    to: "/juices",
    title: "Cold-Pressed Juices",
    image: juices,
    desc: "Fresh fruit and vegetable blends made to refresh, fuel, and restore.",
    benefit: "Fresh. Natural. Energizing.",
    objectPosition: "center 75%",
  },
];

const PLANS = [
  { name: "Five Meal Plan", price: "$375", desc: "Five clean meals to start your week light and balanced." },
  { name: "Eight Meal Plan", price: "$580", desc: "Eight fresh meals for a balanced week with more convenience." },
  { name: "Twelve Meal Plan", price: "$840", desc: "Twelve clean meals for full-week planning, convenience, and consistency." },
];

const REVIEWS = [
  { name: "Aaliyah R.", text: "The Broccoli Power Bowl is the best lunch in my week. Fresh, filling, and beautifully packed." },
  { name: "Marcus D.", text: "Cathy's juices taste like they were pressed five minutes ago. The beet blend is unreal." },
  { name: "Simone J.", text: "Catered our office event and everyone asked who made the salads. Premium from start to finish." },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Fresh garden salad" width={1920} height={1080}
          className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/40 via-foreground/45 to-foreground/75" />

        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-12 text-center text-white lg:pb-28 lg:pt-16 lg:px-8">
          <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white/95 p-4 shadow-2xl ring-4 ring-white/40 backdrop-blur lg:h-56 lg:w-56">
            <img src={logo} alt="Fine Time for Cathy's Clean Green Classics logo" className="h-full w-full object-contain" />
          </div>
          <h1 className="mt-8 text-display text-3xl font-extrabold leading-tight text-white drop-shadow-lg lg:text-5xl">
            Clean green sun-kissed classics.
          </h1>
          <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-white/95 lg:text-lg">
            Homemade salads, healthy meals, and cold-pressed juices. Made fresh in Trinidad and Tobago.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/salads"
              className="btn-tomato inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-extrabold uppercase tracking-wide">
              Order Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/catering"
              className="btn-pepper inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-extrabold uppercase tracking-wide">
              Request Catering
            </Link>
            <a href={waLink("Hi! I'd like to ask about today's menu.")} target="_blank" rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-extrabold uppercase tracking-wide text-white shadow-soft hover:brightness-105">
              <MessageCircle className="h-5 w-5 fill-white" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* NOTICE BAR */}
      <div className="border-b border-border bg-leaf-deep text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-center text-sm font-semibold lg:px-8">
          <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-citrus" /> Daily orders close at 9 AM. Salads close at 8 AM (Mon, Wed, Fri).</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:inline-block" />
          <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-citrus" /> Delivery starts at 2 PM</span>
        </div>
      </div>

      {/* MENU SECTIONS */}
      <Section className="py-20 lg:py-24">
        <div className="mb-10 text-center">
          <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-leaf">Menu Today</div>
          <h2 className="mt-2 text-display text-3xl font-extrabold lg:text-4xl">Clean Green Classics</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Real food, beautifully made.</p>
        </div>
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {SECTIONS.map((s) => (
            <Link key={s.to} to={s.to}
              className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:shadow-soft sm:grid-cols-[40%_1fr]">
              <div className="relative aspect-[16/9] overflow-hidden sm:aspect-auto sm:min-h-[180px]">
                <img src={s.image} alt={s.title} loading="lazy"
                  style={{ objectPosition: s.objectPosition }}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-col gap-2 p-6 lg:p-7">
                <h3 className="text-display text-xl font-extrabold lg:text-2xl">{s.title}</h3>
                <p className="text-sm text-foreground/80">{s.desc}</p>
                <div className="text-xs font-bold uppercase tracking-wider text-leaf">{s.benefit}</div>
                <div className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold text-leaf">
                  Browse Menu <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* MEAL PREP */}
      <Section className="pb-16 lg:pb-20">
        <div className="overflow-hidden rounded-3xl border-2 border-leaf/30 bg-gradient-to-br from-leaf/10 via-cream to-citrus/15 p-7 shadow-soft lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-leaf">Meal Prep Plans</div>
              <h2 className="mt-2 text-display text-3xl font-extrabold text-leaf-deep lg:text-4xl">Plan your week the clean way.</h2>
              <p className="mt-3 max-w-lg text-foreground/80">
                Fresh, affordable meals made for convenience, balance, and flavor. Delivered or picked up on your schedule.
              </p>
              <Link to="/meal-prep"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-leaf-deep px-6 text-sm font-extrabold text-primary-foreground hover:opacity-90">
                View All Plans <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <img src={mealprep} alt="Meal prep containers" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card" />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {PLANS.map((p) => (
              <div key={p.name} className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="text-display text-lg font-extrabold">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.desc}</div>
                  <div className="mt-1 text-xl font-extrabold text-leaf">{p.price}</div>
                </div>
                <Link to="/meal-prep"
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-leaf px-5 text-sm font-extrabold text-primary-foreground hover:opacity-90">
                  View Meal Plan <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-tomato/30 bg-tomato/10 px-4 py-3 text-center text-sm font-semibold text-tomato">
            Seafood meals cost $5 more each. Our 5-meal combos can be delivered or picked up once or twice a week.
          </div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section className="pb-16 lg:pb-20">
        <div className="mb-8 text-center">
          <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-leaf">Loved by regulars</div>
          <h2 className="mt-2 text-display text-3xl font-extrabold lg:text-4xl">What our community says</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-3xl border border-border bg-card p-7 shadow-card">
              <Quote className="h-7 w-7 text-citrus" />
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">"{r.text}"</blockquote>
              <figcaption className="mt-4 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* CATERING BAND */}
      <Section className="pb-12 lg:pb-16">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={catering} alt="Catering spread" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/55 to-foreground/30" />
          <div className="relative grid gap-4 px-8 py-12 text-white lg:max-w-xl lg:py-16 lg:pl-14">
            <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-citrus">Catering</div>
            <h2 className="text-display text-3xl font-extrabold lg:text-4xl">Family-style trays planned in advance.</h2>
            <p className="text-white/90">Office lunches, family gatherings, intimate events. Clean, generous, and beautifully presented.</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link to="/catering"
                className="btn-pepper inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-extrabold uppercase tracking-wide">
                Request Catering
              </Link>
              <a href={waLink("Hi! I'd like to ask about catering.")} target="_blank" rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-extrabold uppercase tracking-wide text-white hover:brightness-105">
                <MessageCircle className="h-5 w-5 fill-white" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
