import { Link } from "@tanstack/react-router";

const TABS = [
  { to: "/salads", label: "Salads" },
  { to: "/meals", label: "Healthy Meals" },
  { to: "/juices", label: "Juices" },
] as const;

export function CategoryTabs({ active }: { active: "/salads" | "/meals" | "/juices" }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2 rounded-full border border-border bg-cream p-1.5 shadow-card">
      {TABS.map((t) => {
        const isActive = t.to === active;
        return isActive ? (
          <span
            key={t.to}
            aria-current="page"
            className="inline-flex h-10 cursor-default items-center rounded-full bg-leaf-deep px-5 text-sm font-semibold text-cream"
          >
            {t.label}
          </span>
        ) : (
          <Link
            key={t.to}
            to={t.to}
            className="inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold text-foreground/80 transition hover:bg-secondary hover:text-leaf-deep"
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
