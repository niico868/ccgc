import { photoSrcSet } from "@/lib/utils";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, Clock, MapPin, Truck } from "lucide-react";
import { Section } from "@/components/site/Section";
import { MenuCard, DishTags } from "@/components/site/MenuCard";
import { PhotoCarousel } from "@/components/site/PhotoCarousel";
import { OrderDatePicker } from "@/components/site/OrderDatePicker";
import { ReviewCheckoutBar } from "@/components/site/ReviewCheckoutBar";
import {
  ALL_ITEMS,
  CATEGORY_INFO,
  DIABETIC_NOTE,
  MENU_A_MEALS,
  dishPath,
  dishSlug,
  findBySlug,
  fmt,
  type MenuItem,
} from "@/lib/menu-data";
import { addDays, currentMenuWeekMonday, mealsForDate, menuWeekLabel } from "@/lib/menu-rotation";
import { FACTS, SITE_URL } from "@/lib/site-facts";

const BUSINESS_ID = `${SITE_URL}/#business`;

function seoTitle(item: MenuItem) {
  if (item.category === "juice")
    return `${item.name} Cold-Pressed Juice, No Added Sugar | Cathy's Clean Green Classics`;
  if (item.category === "salad")
    return `${item.name}: Fresh Salad in Trinidad | Cathy's Clean Green Classics`;
  return `${item.name}: Healthy Meal in Trinidad | Cathy's Clean Green Classics`;
}

function seoDescription(item: MenuItem) {
  const price = `${fmt(item.price)} TTD`;
  const when = `Order for ${FACTS.orderDays} delivery or pickup in Trinidad.`;
  if (item.category === "juice") {
    const kind = item.name.toLowerCase().includes("shot") ? item.name : `${item.name} juice`;
    return `${kind}, cold-pressed with no added sugar: a diabetic-friendly ${item.fixedSize} for ${price}. ${when}`;
  }
  const first = item.description.split(/(?<=\.)\s/)[0];
  return `${first} ${price}, choice of protein. ${when}`;
}

function dietFor(item: MenuItem) {
  return item.category === "juice"
    ? ["https://schema.org/DiabeticDiet", "https://schema.org/LowSugarDiet"]
    : undefined;
}

export const Route = createFileRoute("/menu/$slug")({
  loader: ({ params }) => {
    const item = findBySlug(params.slug);
    if (!item) throw notFound();
    return { slug: dishSlug(item) };
  },
  head: ({ params }) => {
    const item = findBySlug(params.slug);
    if (!item)
      return {
        meta: [
          { title: "Dish not found | Cathy's Clean Green Classics" },
          { name: "robots", content: "noindex" },
        ],
      };
    const url = `${SITE_URL}${dishPath(item)}`;
    const title = seoTitle(item);
    const desc = seoDescription(item);
    const og = `${SITE_URL}/og/${dishSlug(item)}.png`;
    const cat = CATEGORY_INFO[item.category];
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: og },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        {
          property: "og:image:alt",
          content: `${item.name}, ${cat.single} from Cathy's Clean Green Classics`,
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: og },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "MenuItem",
                "@id": `${url}#dish`,
                name: item.name,
                description: item.description,
                url,
                image: [`${SITE_URL}${item.image}`],
                offers: {
                  "@type": "Offer",
                  price: item.price,
                  priceCurrency: "TTD",
                  availability: "https://schema.org/InStock",
                  areaServed: FACTS.country,
                  seller: { "@id": BUSINESS_ID },
                },
                ...(dietFor(item) ? { suitableForDiet: dietFor(item) } : {}),
                ...(item.proteinOptions
                  ? {
                      menuAddOn: item.proteinOptions.map((p) => ({
                        "@type": "MenuItem",
                        name: `${p} protein`,
                      })),
                    }
                  : {}),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: cat.label,
                    item: `${SITE_URL}${cat.path}`,
                  },
                  { "@type": "ListItem", position: 3, name: item.name, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: DishPage,
});

/** First menu week (from the current one) in which this rotating meal is served. */
function useNextMealWeek(item: MenuItem) {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    if (item.category !== "meal") return;
    let monday = currentMenuWeekMonday();
    for (let i = 0; i < 4; i++) {
      if (mealsForDate(monday).some((m) => m.id === item.id)) {
        setLabel(
          i === 0
            ? `On this week's menu: ${menuWeekLabel(monday).replace("Menu for deliveries", "deliveries")}.`
            : `Next on the menu: ${menuWeekLabel(monday).replace("Menu for deliveries", "deliveries")}.`,
        );
        return;
      }
      monday = addDays(monday, 7);
    }
  }, [item]);
  return label;
}

function DishPage() {
  const { slug } = Route.useLoaderData();
  const item = findBySlug(slug)!;
  const cat = CATEGORY_INFO[item.category];
  const nextWeek = useNextMealWeek(item);
  const related = ALL_ITEMS.filter((i) => i.category === item.category && i.id !== item.id).slice(
    0,
    3,
  );
  const menuName =
    item.category === "meal"
      ? MENU_A_MEALS.some((m) => m.id === item.id)
        ? "Menu A"
        : "Menu B"
      : null;
  const minimum = item.category === "juice" ? "6 drinks" : "5 food items";

  return (
    <>
      <Section className="pt-5">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-leaf-deep">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <Link to={cat.path} className="hover:text-leaf-deep">
                {cat.label}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li aria-current="page" className="font-semibold text-leaf-deep">
              {item.name}
            </li>
          </ol>
        </nav>
      </Section>

      <Section className="pt-5 pb-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="min-w-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] bg-secondary shadow-[0_18px_35px_rgba(31,90,53,0.14)]">
              {item.images && item.images.length > 1 ? (
                <PhotoCarousel images={item.images} name={item.name} />
              ) : (
                <img
                  src={item.image}
          srcSet={photoSrcSet(item.image)}
          sizes="(min-width: 1024px) 55vw, 100vw"
                  alt={item.name}
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-leaf">
              {cat.single}
              {menuName ? ` · ${menuName}` : ""}
            </div>
            <h1 className="mt-1.5 text-display text-3xl leading-tight text-leaf-deep lg:text-4xl [overflow-wrap:anywhere]">
              {item.name}
            </h1>
            {item.tags && (
              <div className="mt-3">
                <DishTags tags={item.tags} />
              </div>
            )}
            <p className="mt-4 text-base leading-relaxed text-foreground/85">{item.description}</p>
            {item.note && <p className="mt-2 text-sm text-brown">{item.note}</p>}
            {item.benefits && (
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-leaf-soft">
                {item.benefits}
              </p>
            )}
            {item.category === "juice" && (
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{DIABETIC_NOTE}</p>
            )}
            {nextWeek && (
              <p className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-sm font-medium text-brown">
                {nextWeek}
              </p>
            )}

            <div className="mt-6">
              <OrderDatePicker />
            </div>
            <div className="mt-4 rounded-[22px] border border-leaf-soft/25 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8EA_100%)] p-5 shadow-card">
              <MenuCard item={item} orderOnly />
            </div>
          </div>
        </div>
      </Section>

      <Section className="pb-10">
        <h2 className="text-display text-2xl text-leaf-deep">Good to know</h2>
        <ul className="mt-4 grid gap-3 text-sm text-foreground/85 sm:grid-cols-3">
          <li className="flex gap-3 rounded-2xl border border-border bg-card p-4">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-leaf" />
            <span>
              Made fresh for {FACTS.orderDays}. Order by {FACTS.cutoff}, or book {FACTS.bookAhead}.
            </span>
          </li>
          <li className="flex gap-3 rounded-2xl border border-border bg-card p-4">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-leaf" />
            <span>
              Delivery {FACTS.delivery}. Minimum {minimum} for delivery; mix and match across the
              menu.
            </span>
          </li>
          <li className="flex gap-3 rounded-2xl border border-border bg-card p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-leaf" />
            <span>Pickup at {FACTS.pickup.join(" or ")}. No minimum for pickup.</span>
          </li>
        </ul>
        {item.proteinOptions && (
          <p className="mt-4 text-sm text-muted-foreground">
            {FACTS.prices.premiumProtein}. {FACTS.vegetarian}
          </p>
        )}
      </Section>

      <Section className="pb-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-display text-2xl text-leaf-deep">More {cat.label.toLowerCase()}</h2>
          <Link
            to={cat.path}
            className="shrink-0 text-sm font-semibold text-leaf-deep hover:underline"
          >
            See the full menu
          </Link>
        </div>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <li key={r.id}>
              <Link
                to={dishPath(r)}
                className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <img
                  src={r.image}
          srcSet={photoSrcSet(r.image)}
          sizes="(min-width: 640px) 33vw, 100vw"
                  alt={r.name}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="p-3">
                  <div className="text-display text-base leading-tight text-leaf-deep group-hover:underline">
                    {r.name}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-foreground/70">
                    {fmt(r.price)}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <ReviewCheckoutBar />
    </>
  );
}
