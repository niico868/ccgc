import { Check } from "lucide-react";
import { useBasket } from "@/lib/basket";
import { FOOD_MIN, DRINK_MIN } from "@/lib/menu-data";

type Kind = "food" | "drink";

function Row({ kind, count }: { kind: Kind; count: number }) {
  const target = kind === "food" ? FOOD_MIN : DRINK_MIN;
  const filled = Math.min(count, target);
  const remaining = Math.max(0, target - count);
  const reached = count >= target;

  const label = kind === "food" ? "food items" : "drinks";
  const support =
    kind === "food"
      ? "Mix and match any salads and healthy meals."
      : "Mix and match any juices and ginger shots.";

  let headline: string;
  if (count === 0) {
    headline = `Add ${target} ${label} to complete your order.`;
  } else if (reached) {
    headline =
      kind === "food"
        ? "5-item food minimum reached, checkout ready."
        : "6-drink minimum reached, checkout ready.";
  } else {
    headline = `${count} of ${target} ${label} added, add ${remaining} more to complete your order.`;
  }

  return (
    <div className="rounded-2xl border border-leaf-soft/40 bg-leaf-soft/10 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-leaf-deep">{headline}</div>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: target }).map((_, i) => {
            const done = i < filled;
            return (
              <span
                key={i}
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full border transition ${
                  done
                    ? "border-leaf-deep bg-leaf-deep text-cream"
                    : "border-leaf-deep/30 bg-white/60"
                }`}
              >
                {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-xs text-foreground/70">{support}</p>
    </div>
  );
}

/**
 * Dynamic minimum-order progress.
 * - kind="food"|"drink": always shows that row.
 * - When the basket also has items from the other side, shows both rows.
 */
export function OrderProgress({ kind }: { kind: Kind }) {
  const { foodCount, drinkCount } = useBasket();
  const showFood = kind === "food" || foodCount > 0;
  const showDrink = kind === "drink" || drinkCount > 0;
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {showFood && <Row kind="food" count={foodCount} />}
      {showDrink && <Row kind="drink" count={drinkCount} />}
    </div>
  );
}
