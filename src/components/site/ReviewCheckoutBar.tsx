import { Link } from "@tanstack/react-router";
import { ShoppingBasket } from "lucide-react";
import { useBasket } from "@/lib/basket";
import { fmt, FOOD_MIN, DRINK_MIN } from "@/lib/menu-data";

/**
 * "Review Order & Checkout" action shown whenever the basket has any items.
 * - Desktop: fixed bottom-right pill.
 * - Mobile: sticky bottom action bar.
 * Always enabled — customers can open the basket before hitting the minimum.
 */
export function ReviewCheckoutBar() {
  const { count, subtotal, foodCount, drinkCount, minMet } = useBasket();
  if (count === 0) return null;

  const foodShort = foodCount > 0 && foodCount < FOOD_MIN ? FOOD_MIN - foodCount : 0;
  const drinkShort = drinkCount > 0 && drinkCount < DRINK_MIN ? DRINK_MIN - drinkCount : 0;

  const status = minMet
    ? "Minimum reached"
    : [
        foodShort > 0 ? `${foodShort} more food` : null,
        drinkShort > 0 ? `${drinkShort} more drinks` : null,
      ]
        .filter(Boolean)
        .join(" · ") || "Review your basket";

  return (
    <>
      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-leaf-deep/15 bg-white/95 px-4 py-3 shadow-[0_-8px_20px_rgba(31,90,53,0.12)] backdrop-blur md:hidden">
        <Link
          to="/basket"
          className="flex h-12 w-full items-center justify-between gap-3 rounded-full bg-leaf-deep px-5 text-sm font-semibold text-cream shadow-[0_10px_24px_rgba(31,90,53,0.28)] transition active:scale-[0.98]"
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBasket className="h-4 w-4" />
            {count} {count === 1 ? "item" : "items"} · {fmt(subtotal)}
          </span>
          <span className="text-[13px] font-semibold">Review &amp; Checkout →</span>
        </Link>
        <p className="mt-1.5 text-center text-[11px] text-foreground/70">{status}</p>
      </div>

      {/* Desktop floating action */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden md:block">
        <Link
          to="/basket"
          className="pointer-events-auto group inline-flex items-center gap-3 rounded-full bg-leaf-deep px-6 py-3 text-sm font-semibold text-cream shadow-[0_18px_35px_rgba(31,90,53,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(31,90,53,0.35)]"
        >
          <ShoppingBasket className="h-4 w-4" />
          <span className="flex flex-col leading-tight">
            <span>Review Order &amp; Checkout</span>
            <span className="text-[11px] font-medium text-cream/85">
              {count} {count === 1 ? "item" : "items"} · {fmt(subtotal)} · {status}
            </span>
          </span>
        </Link>
      </div>
    </>
  );
}
