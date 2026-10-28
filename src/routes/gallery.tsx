import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import hero from "@/assets/hero-salad.jpg";
import { SALAD_FEATURE_IMAGE, MEAL_FEATURE_IMAGE } from "@/lib/menu-data";

const TITLE = "Gallery | Cathy's Clean Green Classics";
const DESC = "Photos of our salads, healthy meals, cold-pressed juices and prep-counter moments from the kitchen in Trinidad.";
const URL = "https://cathysgreenkitchen.com/gallery";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Gallery,
});

const IMAGES = [
  { src: hero, caption: "Signature Grilled Chicken Garden Salad" },
  { src: SALAD_FEATURE_IMAGE, caption: "Chef's Choice salad" },
  { src: MEAL_FEATURE_IMAGE, caption: "Healthy meal favourite" },
];



function Gallery() {
  return (
    <>
      <Section className="pt-14 lg:pt-20 pb-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf-soft">Gallery</div>
        <h1 className="mt-2 text-display text-4xl text-leaf-deep lg:text-5xl">From the kitchen to the table.</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Finished dishes, fresh produce, and prep-counter moments.</p>
      </Section>
      <Section className="pb-20">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
          {IMAGES.map((img, i) => (
            <figure key={i} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="aspect-square overflow-hidden">
                <img src={img.src} alt={img.caption} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <figcaption className="px-4 py-3 text-xs text-muted-foreground">{img.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </>
  );
}
