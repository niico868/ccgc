import { Link } from "@tanstack/react-router";
import salads from "@/assets/section-salads.jpg";
import meals from "@/assets/section-meals.jpg";
import juices from "@/assets/section-juices.jpg";

const ALL = [
  { key: "salad", to: "/salads", title: "Custom Salads", image: salads },
  { key: "meal", to: "/meals", title: "Healthy Meals", image: meals },
  { key: "juice", to: "/juices", title: "Cold-Pressed Juices", image: juices },
] as const;

export function OtherSections({ except }: { except: "salad" | "meal" | "juice" }) {
  const items = ALL.filter((a) => a.key !== except);
  return (
    <div>
      <h3 className="text-display text-xl font-semibold">Keep exploring</h3>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {items.map((it) => (
          <Link key={it.to} to={it.to}
            className="group relative flex h-40 overflow-hidden rounded-2xl border border-border">
            <img src={it.image} alt={it.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="relative mt-auto p-5 text-white">
              <div className="text-display text-xl font-semibold">{it.title}</div>
              <div className="text-xs uppercase tracking-wider opacity-90">View menu →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
