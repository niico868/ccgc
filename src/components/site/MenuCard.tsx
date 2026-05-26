import { useState } from "react";
import { toast } from "sonner";
import { useBasket } from "@/lib/basket";
import type { MenuItem } from "@/lib/menu-data";
import { Plus } from "lucide-react";

export function MenuCard({ item }: { item: MenuItem }) {
  const { add } = useBasket();
  const [protein, setProtein] = useState(item.proteinOptions?.[0] ?? "");
  const [juice, setJuice] = useState(item.juiceOptions?.[0] ?? "");
  const [addons, setAddons] = useState<string[]>([]);

  const toggleAddon = (name: string) =>
    setAddons((a) => (a.includes(name) ? a.filter((x) => x !== name) : [...a, name]));

  const onAdd = () => {
    add({
      itemId: item.id, name: item.name, unitPrice: item.price, quantity: 1,
      protein: protein || undefined,
      addons: addons.length ? addons : undefined,
      juiceOption: juice || undefined,
    });
    toast.success(`${item.name} added to Basket`);
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img src={item.image} alt={item.name} loading="lazy"
          className="h-full w-full object-cover transition duration-700 hover:scale-105" />
        {item.seafood && (
          <span className="absolute left-3 top-3 rounded-full bg-tomato px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            Seafood +$5
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-display text-lg font-semibold leading-tight truncate">{item.name}</h3>
          <div className="shrink-0 text-base font-bold text-leaf">${item.price}</div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{item.ingredients}</p>

        {item.proteinOptions && (
          <div>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Size</div>
            <div className="flex flex-wrap gap-1.5">
              {item.proteinOptions.map((p) => (
                <button key={p} onClick={() => setProtein(p)} type="button"
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    protein === p ? "border-leaf bg-leaf text-primary-foreground" : "border-border bg-background hover:border-leaf"
                  }`}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {item.juiceOptions && (
          <div>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Size</div>
            <div className="flex flex-wrap gap-1.5">
              {item.juiceOptions.map((p) => (
                <button key={p} onClick={() => setJuice(p)} type="button"
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    juice === p ? "border-leaf bg-leaf text-primary-foreground" : "border-border bg-background hover:border-leaf"
                  }`}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {item.addons && (
          <div>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Add-ons</div>
            <div className="flex flex-wrap gap-1.5">
              {item.addons.map((a) => (
                <button key={a.name} onClick={() => toggleAddon(a.name)} type="button"
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    addons.includes(a.name) ? "border-citrus bg-citrus text-accent-foreground" : "border-border bg-background hover:border-citrus"
                  }`}>{a.name} +${a.price}</button>
              ))}
            </div>
          </div>
        )}

        <button onClick={onAdd}
          className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-leaf text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          <Plus className="h-4 w-4" /> Add to Basket
        </button>
      </div>
    </article>
  );
}
