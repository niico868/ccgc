import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, MessageCircle, Quote, Truck } from "lucide-react";
import hero from "@/assets/hero-salad.jpg";
import salads from "@/assets/section-salads.jpg";
import meals from "@/assets/section-meals.jpg";
import juices from "@/assets/section-juices.jpg";
import mealprep from "@/assets/section-mealprep.jpg";
import catering from "@/assets/section-catering.jpg";
import logo from "@/assets/logo.jpg";
import { waLink } from "@/lib/whatsapp";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fine Time for Cathy's — Clean Green Classics" },
      { name: "description", content: "Custom salads, healthy meals, cold-pressed juices and meal prep delivered across Trinidad's east-west corridor." },
    ],
  }),
  component: Home,
});

const SECTIONS = [
  { to: "/salads", title: "Custom Salads", image: salads,
    desc: "Fresh greens, grilled proteins, crisp toppings, and bold house-style flavor.",
    benefit: "Fresh. Filling. Built your way." },
  { to: "/meals", title: "Healthy Meals", image: meals,
    desc: "Balanced gourmet-style lunches made for clean eating and real satisfaction.",
    benefit: "Wholesome. Convenient. Affordable." },
  { to: "/juices", title: "Cold-Pressed Juices", image: juices,
    desc: "Fresh fruit and vegetable blends made to refresh, fuel, and restore.",
    benefit: "Fresh. Natural. Energizing." },
];

const PLANS = [
  { name: "5 Meal Plan", price: "$375", desc: "Five clean meals to start your week light and balanced." },
  { name: "8 Meal Plan", price: "$580", desc: "Eight meals for steady, balanced eating Monday through Friday." },
  { name: "12 Meal Plan", price: "$840", desc: "Twelve meals — full coverage for busy weeks and active families." },
];

const REVIEWS = [
  { name: "Aaliyah R.", text: "The Grilled Chicken Bowl is the best lunch in my week. Fresh, filling, and beautifully packed." },
  { name: "Marcus D.", text: "Cathy's juices taste like they were pressed five minutes ago. The beetroot blend is unreal." },
  { name: "Simone J.", text: "Catered our office event — everyone asked who made the salads. Premium from start to finish." },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Fresh garden salad with grilled chicken" width={1920} height={1080}
          className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/30 via-foreground/40 to-foreground/70" />

        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-24 pt-12 text-center text-white lg:pb-32 lg:pt-16 lg:px-8">
          <img src={logo} alt="Fine Time for Cathy's logo" className="h-44 w-auto drop-shadow-2xl lg:h-56" />
          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-white/95 lg:text-lg">
            Clean, green, sun-kissed classics — handmade salads, healthy meals and cold-pressed juices delivered fresh across Trinidad.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/salads"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-leaf px-7 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95">
              Order Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/catering"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-citrus px-7 text-sm font-semibold text-accent-foreground shadow-soft hover:opacity-95">
              Request Catering
            </Link>
            <a href={waLink("Hi! I'd like to ask about today's menu.")} target="_blank" rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* NOTICE BAR */}
      <div className="border-b border-border bg-leaf text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-center text-sm font-medium lg:px-8">
          <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-citrus" /> Daily orders close at 9:00 AM</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:inline-block" />
          <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-citrus" /> Delivery starts at 2:00 PM</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:inline-block" />
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-citrus" /> Arima → Port of Spain · $40</span>
        </div>
      </div>

      {/* FOOD SECTIONS */}
      <Section className="py-20 lg:py-28">
        <div className="mb-12 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">The Menu</div>
          <h2 className="mt-2 text-display text-3xl font-bold lg:text-4xl">Today's clean green classics</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Three honest categories. Real food, beautifully made.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link key={s.to} to={s.to}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:shadow-soft hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="text-display text-xl font-semibold truncate">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
                <div className="text-xs font-semibold uppercase tracking-wider text-leaf">{s.benefit}</div>
                <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-leaf">
                  Browse menu <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* MEAL PREP */}
      <Section className="pb-20 lg:pb-28">
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary to-background p-8 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">Meal Prep Subscription Plans</div>
              <h2 className="mt-2 text-display text-3xl font-bold lg:text-4xl">Plan your week, the clean way.</h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                Fresh, affordable meals made for convenience, balance, and flavor — delivered or picked up on your schedule.
              </p>
              <Link to="/meal-prep"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-leaf px-6 text-sm font-semibold text-primary-foreground hover:opacity-90">
                View All Plans <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <img src={mealprep} alt="Meal prep containers" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card" />
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="text-display text-xl font-semibold">{p.name}</div>
                <div className="mt-1 text-2xl font-bold text-leaf">{p.price}</div>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <Link to="/meal-prep"
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-leaf px-4 text-sm font-semibold text-leaf hover:bg-leaf hover:text-primary-foreground">
                  View Meal Plan
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground">Seafood meals cost $5 more.</p>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section className="pb-20 lg:pb-28">
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">Loved by regulars</div>
          <h2 className="mt-2 text-display text-3xl font-bold lg:text-4xl">What our community says</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-3xl border border-border bg-card p-7 shadow-card">
              <Quote className="h-7 w-7 text-citrus" />
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">"{r.text}"</blockquote>
              <figcaption className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* CATERING BAND */}
      <Section className="pb-20 lg:pb-28">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={catering} alt="Catering spread" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/55 to-foreground/30" />
          <div className="relative grid gap-4 px-8 py-14 text-white lg:max-w-xl lg:py-20 lg:pl-14">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-citrus">Catering</div>
            <h2 className="text-display text-3xl font-bold lg:text-4xl">Family-style trays, planned in advance.</h2>
            <p className="text-white/90">Office lunches, family gatherings, intimate events — clean, generous, and beautifully presented.</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link to="/catering"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-citrus px-7 text-sm font-semibold text-accent-foreground hover:opacity-95">
                Request Catering
              </Link>
              <a href={waLink("Hi! I'd like to ask about catering.")} target="_blank" rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
