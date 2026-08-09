import { useState } from "react";
import { toast } from "sonner";
import { useBasket } from "@/lib/basket";
import type { MenuItem } from "@/lib/menu-data";
import { fmt, PREMIUM_PROTEINS, PREMIUM_SURCHARGE, PROTEIN_COPY, SALAD_INGREDIENTS } from "@/lib/menu-data";
import { Minus, Plus, ShoppingBasket, ChevronDown } from "lucide-react";

export function MenuCard({ item }: { item: MenuItem }) {
  const { add } = useBasket();
  const [protein, setProtein] = useState(item.proteinOptions?.[0] ?? "");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [exclOpen, setExclOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const size = item.sizes?.[sizeIdx];
  const basePrice = size ? size.price : item.price;
  const seafood = !!protein && PREMIUM_PROTEINS.includes(protein);
  const seafoodAdd = seafood ? PREMIUM_SURCHARGE : 0;
  const unitPrice = basePrice + seafoodAdd;

  const toggleExcluded = (ing: string) =>
    setExcluded((p) => (p.includes(ing) ? p.filter((x) => x !== ing) : [...p, ing]));

  const onAdd = () => {
    add({
      itemId: item.id,
      name: item.name,
      unitPrice,
      basePrice,
      seafoodAdd,
      quantity: qty,
      category: item.category,
      protein: protein || undefined,
      size: size?.label || item.fixedSize,
      seafood,
      preferences: excluded.length ? excluded.join(", ") : undefined,
    });
    toast.success(`${qty} × ${item.name} added`);
    setQty(1);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-leaf-soft/25 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8EA_100%)] shadow-[0_18px_35px_rgba(31,90,53,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(31,90,53,0.18)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          style={item.category === "juice" ? { objectPosition: "center 70%" } : undefined}
        />
      </div>
      <div className="flex h-1 w-full bg-[linear-gradient(90deg,#F6E96B_0%,#A9D95A_55%,#2F7D32_100%)]" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-display text-lg leading-tight text-leaf-deep">{item.name}</h3>
          <div className="shrink-0 text-right">
            <div className="text-sm font-bold tracking-wide text-leaf-deep">{fmt(unitPrice)}<span className="text-[10px] font-medium text-muted-foreground"> /ea</span></div>
            {seafood && (
              <div className="mt-0.5 text-[10px] font-medium text-brown">Includes $5 premium protein addition per item.</div>
            )}
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-leaf-soft">
              {item.category === "salad" && "Mix & match, 5 item food minimum"}
              {item.category === "meal" && "Mix & match, 5 item food minimum"}
              {item.category === "juice" && "Mix & match, 6 drink minimum"}
            </div>
          </div>
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
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition active:scale-95 ${
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
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition active:scale-95 ${
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
          <div className="rounded-xl border border-border bg-background">
            <button
              type="button"
              onClick={() => setExclOpen((o) => !o)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-leaf-deep"
              aria-expanded={exclOpen}
            >
              <span>
                Ingredients to leave out
                {excluded.length > 0 && (
                  <span className="ml-2 rounded-full bg-leaf-deep px-2 py-0.5 text-[10px] text-cream">{excluded.length}</span>
                )}
              </span>
              <ChevronDown className={`h-4 w-4 transition ${exclOpen ? "rotate-180" : ""}`} />
            </button>
            {exclOpen && (
              <div className="grid max-h-44 grid-cols-2 gap-1 overflow-y-auto border-t border-border p-2 animate-fade-in">
                {SALAD_INGREDIENTS.map((ing) => {
                  const active = excluded.includes(ing);
                  return (
                    <label
                      key={ing}
                      className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs transition ${
                        active ? "bg-leaf-deep/10 text-leaf-deep" : "hover:bg-secondary"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleExcluded(ing)}
                        className="h-3.5 w-3.5 accent-[var(--leaf-deep)]"
                      />
                      <span>{ing}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 pt-1">
          <div className="inline-flex items-center rounded-full border border-border bg-background">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="inline-flex h-10 w-10 items-center justify-center text-leaf-deep transition hover:text-leaf-soft active:scale-90"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-7 text-center text-sm font-bold">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="inline-flex h-10 w-10 items-center justify-center text-leaf-deep transition hover:text-leaf-soft active:scale-90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={onAdd}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-leaf-deep text-sm font-semibold text-cream shadow-[0_10px_24px_rgba(31,90,53,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--leaf-deep)_88%,white)] hover:shadow-[0_14px_28px_rgba(31,90,53,0.3)] active:scale-[0.98]"
          >
            <ShoppingBasket className="h-4 w-4" /> Add to Basket
          </button>
        </div>
      </div>
    </article>
  );
}
