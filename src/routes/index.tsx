import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Truck } from "lucide-react";
import hero from "@/assets/hero-salad.jpg";
import { SALAD_FEATURE_IMAGE, MEAL_FEATURE_IMAGE, JUICE_FEATURE_IMAGE } from "@/lib/menu-data";
import { waLink } from "@/lib/whatsapp";
import { Section } from "@/components/site/Section";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { StickyNote } from "@/components/site/StickyNote";
import { Reviews } from "@/components/site/Reviews";

const TITLE = "Fresh Salads, Meals & Cold-Pressed Juices in Trinidad | Cathy's Clean Green Classics";
const DESC = "Order made-to-order salads, hearty homestyle meals and diabetic-friendly cold-pressed juices. Fresh from Trinidad and Tobago, with delivery and pickup.";
const URL = "https://cathysgreenkitchen.com/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://cathysgreenkitchen.com/og-image.jpg" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: "https://cathysgreenkitchen.com/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Home,
});

const SECTIONS = [
  { to: "/salads", title: "Custom Salads", image: SALAD_FEATURE_IMAGE, desc: "Fresh greens, clean toppings and your choice of protein, built to order.", benefit: "Fresh. Custom. Filling.", objectPosition: "center 50%" },
  { to: "/meals", title: "Healthy Meals", image: MEAL_FEATURE_IMAGE, desc: "Hearty, homestyle bowls. Properly seasoned, well-balanced and made with care.", benefit: "Wholesome. Satisfying.", objectPosition: "center 55%" },
  { to: "/juices", title: "Cold-Pressed Juices", image: JUICE_FEATURE_IMAGE, desc: "Pressed fresh from clean produce, to lift, restore and refresh.", benefit: "Fresh. Pure.", objectPosition: "center 60%" },
];


function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Fresh grilled chicken salad bowl on a wooden counter" width={1920} height={1080} fetchPriority="high" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(31,90,53,0.82)_0%,rgba(31,90,53,0.56)_42%,rgba(31,90,53,0.15)_100%)]" />
        <div className="absolute left-[10%] top-[16%] -z-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(246,233,107,0.45)_0%,rgba(169,217,90,0.16)_58%,transparent_76%)] blur-2xl" />

        <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-24 pt-16 text-cream lg:grid-cols-[1.15fr_0.85fr] lg:pb-28 lg:pt-24 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-[rgba(255,248,234,0.78)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-leaf-deep shadow-[0_12px_30px_rgba(31,90,53,0.12)] backdrop-blur-[14px]">
              Mon &amp; Wed orders close at 8 AM · Delivery from 11 AM
            </div>
            <h1 className="mt-5 text-display text-4xl leading-[1.02] text-cream drop-shadow-sm lg:text-6xl">
              Make a healthy start to your day.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/95 lg:text-lg">
              Hearty salads and meals with diabetic-friendly cold-pressed juices, properly made, packed with care, and ready for your next order.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/salads" className="inline-flex h-12 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#E76F51,#D84A2B)] px-8 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(231,111,81,0.25)] transition hover:-translate-y-0.5">
                Start Your Order <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="inline-flex h-12 items-center rounded-full border border-white/45 bg-white/12 px-7 text-sm font-semibold text-cream backdrop-blur hover:bg-white/20">
                Catering Request
              </Link>
              <WhatsAppButton href={waLink("Hi! I'd like to ask about today's menu.")}>WhatsApp</WhatsAppButton>
            </div>
          </div>
          <div className="flex items-end justify-center lg:justify-end">
            <StickyNote className="rotate-[4deg] self-end">
              <span className="text-[16px] font-semibold">Sign in once. Order easier every time after.</span>
            </StickyNote>
          </div>
        </div>
      </section>

      <div className="border-b border-border bg-leaf-deep text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-center text-sm font-medium lg:px-8">
          <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-citrus" /> Mon &amp; Wed cutoff 8 AM · Other days the day before.</span>
          <span className="hidden h-1 w-1 rounded-full bg-cream/40 sm:inline-block" />
          <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-citrus" /> Delivery &amp; pickup 12 PM – 5 PM</span>
        </div>
      </div>

      <Section className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-leaf-soft/30 bg-cream/80 px-6 py-7 text-center shadow-card backdrop-blur lg:px-10 lg:py-9">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-soft">Catering to shut-ins</div>
          <h2 className="mt-2 text-display text-2xl text-leaf-deep lg:text-3xl">Meal prep &amp; delivery for those at home</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80 lg:text-base">
            We cater to shut-ins, the elderly and health-challenged with a steady meal-prep and delivery service so a proper, homestyle plate is never far away.
          </p>
        </div>
      </Section>

      <Section className="py-16 lg:py-20">
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-soft">On the menu</div>
          <h2 className="mt-2 text-display text-3xl text-leaf-deep lg:text-4xl">Clean Green Classics</h2>
          <p className="mx-auto mt-3 max-w-xl text-brown">Real food, beautifully made.</p>
        </div>
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {SECTIONS.map((s) => (
            <Link key={s.to} to={s.to} className="group grid overflow-hidden rounded-[26px] border border-leaf-soft/25 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8EA_100%)] shadow-[0_18px_35px_rgba(31,90,53,0.14)] transition hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(31,90,53,0.18)] sm:grid-cols-[40%_1fr]">
              <div className="relative aspect-[16/9] overflow-hidden sm:aspect-auto sm:min-h-[180px]">
                <img src={s.image} alt={s.title} loading="lazy" style={{ objectPosition: s.objectPosition }} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
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

      <Section className="pb-16 lg:pb-20">
        <div className="mb-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-soft">Loved by regulars</div>
          <h2 className="mt-2 text-display text-3xl text-leaf-deep lg:text-4xl">What our community is saying</h2>
        </div>
        <Reviews />
      </Section>
    </>
  );
}
