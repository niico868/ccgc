import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "./Section";
import { MenuCard } from "./MenuCard";
import { MinimumNotice } from "./MinimumNotice";
import { WhatsAppButton } from "./WhatsAppButton";
import { OrderingAccordion, CompactPageHeader } from "./OrderingAccordion";
import { FirstTimerCard } from "./OrderRules";
import { SALADS, MEALS, JUICES, type MenuItem } from "@/lib/menu-data";
import { waLink } from "@/lib/whatsapp";

type Key = "salad" | "meal" | "juice";

type CategoryDef = {
  key: Key;
  to: "/salads" | "/meals" | "/juices";
  label: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: MenuItem[];
  minKind: "food" | "drink";
  waMsg: string;
};

const CATEGORIES: CategoryDef[] = [
  {
    key: "salad",
    to: "/salads",
    label: "Salads",
    eyebrow: "Custom Salads",
    title: "Cathy's Clean Green Classics Salads",
    intro: "Made-to-order salads with your choice of protein. Minimum 5 meals per food order.",
    items: SALADS,
    minKind: "food",
    waMsg: "Hi! I'd like to order salads.",
  },
  {
    key: "meal",
    to: "/meals",
    label: "Healthy Meals",
    eyebrow: "Healthy Meals",
    title: "Healthy Meals",
    intro: "Hearty, well-prepared bowls — homestyle done properly. Minimum 5 meals per food order.",
    items: MEALS,
    minKind: "food",
    waMsg: "Hi! I'd like to order healthy meals.",
  },
  {
    key: "juice",
    to: "/juices",
    label: "Cold-Pressed Juices",
    eyebrow: "Cold-Pressed Juices",
    title: "Pure Cold-Pressed Drinks",
    intro: "Pressed fresh from clean produce. Minimum 6 drinks per juice order.",
    items: JUICES,
    minKind: "drink",
    waMsg: "Hi! I'd like to order cold-pressed juices.",
  },
];

export function CategoryMenuView({ active }: { active: Key }) {
  const navigate = useNavigate();
  const [shown, setShown] = useState<Key>(active);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync when URL changes (parent route remounts with different active)
  useEffect(() => { setShown(active); }, [active]);

  const goTo = (k: Key) => {
    if (k === shown) return;
    setShown(k);
    const target = CATEGORIES.find((c) => c.key === k)!;
    // Update URL without scroll jump.
    navigate({ to: target.to, replace: true });
  };

  // Swipe support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let tracking = false;
    const onStart = (e: TouchEvent) => {
      tracking = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
      const idx = CATEGORIES.findIndex((c) => c.key === shown);
      if (dx < 0 && idx < CATEGORIES.length - 1) goTo(CATEGORIES[idx + 1].key);
      if (dx > 0 && idx > 0) goTo(CATEGORIES[idx - 1].key);
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [shown]);

  const current = CATEGORIES.find((c) => c.key === shown)!;

  return (
    <div ref={containerRef}>
      <CompactPageHeader eyebrow={current.eyebrow} title={current.title} intro={current.intro} />

      <Section className="pt-6 pb-2">
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2 rounded-full border border-border bg-cream p-1.5 shadow-card">
          {CATEGORIES.map((c) => {
            const isActive = c.key === shown;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => goTo(c.key)}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold transition ${
                  isActive ? "bg-leaf-deep text-cream" : "text-foreground/80 hover:bg-secondary hover:text-leaf-deep"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground sm:hidden">Tip: swipe left or right to switch sections.</p>
      </Section>

      {/* All three sections preloaded; only the active one is visible. */}
      <div className="relative">
        {CATEGORIES.map((c) => (
          <div key={c.key} className={c.key === shown ? "" : "hidden"} aria-hidden={c.key !== shown}>
            <AnimatePresence mode="wait">
              {c.key === shown && (
                <motion.div
                  key={c.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Section className="pt-6 pb-4">
                    <MinimumNotice kind={c.minKind} />
                  </Section>
                  <Section className="pb-10">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {c.items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: 0.05 }}
                        >
                          <MenuCard item={item} />
                        </motion.div>
                      ))}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mt-6 flex justify-center"
                    >
                      <WhatsAppButton href={waLink(c.waMsg)}>Order on WhatsApp</WhatsAppButton>
                    </motion.div>
                  </Section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {shown === "salad" && (
        <Section className="pb-14"><FirstTimerCard /></Section>
      )}
      <Section className="pb-14"><OrderingAccordion /></Section>

      {/* Hidden cross-links for SEO / preloading */}
      <nav className="sr-only" aria-label="All menu sections">
        {CATEGORIES.map((c) => (
          <Link key={c.to} to={c.to}>{c.label}</Link>
        ))}
      </nav>
    </div>
  );
}
