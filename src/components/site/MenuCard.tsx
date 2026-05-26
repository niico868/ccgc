import { useState } from "react";
import { toast } from "sonner";
import { useBasket } from "@/lib/basket";
import type { MenuItem } from "@/lib/menu-data";
import { Plus } from "lucide-react";

export function MenuCard({ item }: { item: MenuItem }) {
  const { add } = useBasket();
  const [protein, setProtein] = useState(item.proteinOptions?.[0] ?? "");
  const [preferences, setPreferences] = useState("");

  const onAdd = () => {
    add({
      itemId: item.id,
      name: item.name,
      unitPrice: item.price,
      quantity: 1,
      protein: protein || undefined,
      preferences: preferences.trim() || undefined,
    });
    toast.success(`${item.name} added to basket`);
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:shadow-soft">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition duration-700 hover:scale-105"
          style={item.category === "juice" ? { objectPosition: "center 75%" } : undefined}
        />
        {item.seafood && (
          <span className="absolute left-3 top-3 rounded-full bg-tomato px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Seafood +$5
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-display text-lg font-extrabold leading-tight">{item.name}</h3>
          <div className="shrink-0 text-base font-extrabold text-leaf">${item.price}</div>
        </div>
        {(item.size || item.pack) && (
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {[item.size, item.pack].filter(Boolean).join(" · ")}
          </div>
        )}
        <p className="text-sm leading-relaxed text-foreground/80">{item.description}</p>
        <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground/70">Ingredients: </span>{item.ingredients}</p>
        {item.benefits && (
          <div className="text-xs font-bold uppercase tracking-wider text-leaf">{item.benefits}</div>
        )}

        {item.proteinOptions && (
          <div>
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Choose protein</div>
            <div className="flex flex-wrap gap-1.5">
              {item.proteinOptions.map((p) => (
                <button key={p} onClick={() => setProtein(p)} type="button"
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    protein === p ? "border-leaf bg-leaf text-primary-foreground" : "border-border bg-background hover:border-leaf"
                  }`}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {item.category === "salad" && (
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Ingredients you do not like
            </label>
            <input
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g. no olives, no onions"
              className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-leaf"
            />
          </div>
        )}

        <button onClick={onAdd}
          className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-leaf text-sm font-bold text-primary-foreground transition hover:opacity-90">
          <Plus className="h-4 w-4" /> Add to Basket
        </button>
      </div>
    </article>
  );
}
