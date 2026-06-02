import { useState } from "react";
import { toast } from "sonner";
import { useBasket } from "@/lib/basket";
import type { MenuItem } from "@/lib/menu-data";
import { PRICELESS, SEAFOOD_LABELS, SEAFOOD_SURCHARGE } from "@/lib/menu-data";
import { Minus, Plus, ShoppingBasket } from "lucide-react";

export function MenuCard({ item }: { item: MenuItem }) {
  const { add } = useBasket();
  const [protein, setProtein] = useState(item.proteinOptions?.[0] ?? "");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [preferences, setPreferences] = useState("");
  const [qty, setQty] = useState(1);

  const size = item.sizes?.[sizeIdx];
  const seafood = !!protein && SEAFOOD_LABELS.includes(protein);
  const unitPrice = (size ? size.price : item.price) + (seafood ? SEAFOOD_SURCHARGE : 0);

  const onAdd = () => {
    add({
      itemId: item.id,
      name: item.name,
      unitPrice,
      quantity: qty,
      category: item.category,
      protein: protein || undefined,
      size: size?.label || item.fixedSize,
      seafood,
      preferences: preferences.trim() || undefined,
    });
    toast.success(`${qty} × ${item.name} added`);
    setQty(1);
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:shadow-soft">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 hover:scale-105"
          style={item.category === "juice" ? { objectPosition: "center 70%" } : undefined}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-display text-lg leading-tight text-leaf-deep">{item.name}</h3>
          <div className="shrink-0 text-sm font-bold tracking-wide text-leaf-deep">{PRICELESS}</div>
        </div>
        <p className="text-sm leading-relaxed text-foreground/80">{item.description}</p>
        {item.benefits && (
          <div className="text-xs font-semibold uppercase tracking-wider text-leaf-soft">{item.benefits}</div>
        )}

        {item.sizes && (
          <div>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Size</div>
            <div className="flex flex-wrap gap-1.5">
              {item.sizes.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSizeIdx(i)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    sizeIdx === i ? "border-leaf-deep bg-leaf-deep text-cream" : "border-border bg-background hover:border-leaf-deep"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {item.proteinOptions && (
          <div>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Choose protein</div>
            <div className="flex flex-wrap gap-1.5">
              {item.proteinOptions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProtein(p)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    protein === p ? "border-leaf-deep bg-leaf-deep text-cream" : "border-border bg-background hover:border-leaf-deep"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {item.category === "salad" && (
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Anything you'd rather we leave out
            </label>
            <input
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g. no olives, no onions"
              className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-leaf-deep"
            />
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 pt-1">
          <div className="inline-flex items-center rounded-full border border-border bg-background">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="inline-flex h-10 w-10 items-center justify-center text-leaf-deep hover:text-leaf-soft"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-7 text-center text-sm font-bold">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="inline-flex h-10 w-10 items-center justify-center text-leaf-deep hover:text-leaf-soft"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={onAdd}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-leaf-deep text-sm font-semibold text-cream transition hover:opacity-90"
          >
            <ShoppingBasket className="h-4 w-4" /> Add to Basket
          </button>
        </div>
      </div>
    </article>
  );
}
