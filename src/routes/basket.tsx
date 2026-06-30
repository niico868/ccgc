import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { useBasket } from "@/lib/basket";
import { FOOD_MIN, DRINK_MIN, fmt } from "@/lib/menu-data";
import { Minus, Plus, Trash2, ShoppingBasket, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/basket")({
  head: () => ({ meta: [{ title: "Your Basket | Cathy's Clean Green Classics" }] }),
  component: Basket,
});

function Basket() {
  const { lines, setQty, remove, subtotal, foodCount, drinkCount, foodOk, drinkOk, minMet } = useBasket();

  if (lines.length === 0) {
    return (
      <Section className="py-20 text-center">
        <ShoppingBasket className="mx-auto h-12 w-12 text-leaf-deep" />
        <h1 className="mt-4 text-display text-3xl text-leaf-deep">Your basket is empty</h1>
        <p className="mt-2 text-muted-foreground">Take a look at the menu and start adding a few classics.</p>
        <Link to="/salads" className="mt-6 inline-flex h-11 items-center rounded-full bg-leaf-deep px-6 text-sm font-semibold text-cream hover:opacity-90">
          Browse menu
        </Link>
      </Section>
    );
  }

  return (
    <Section className="py-12">
      <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">Your Basket</h1>

      {!minMet && (
        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-coral/40 bg-coral/10 p-4 text-sm">
          {!foodOk && (
            <div className="flex items-center gap-2 text-coral">
              <AlertCircle className="h-4 w-4" />
              You need at least {FOOD_MIN} meals to complete this order. You currently have {foodCount}.
            </div>
          )}
          {!drinkOk && (
            <div className="flex items-center gap-2 text-coral">
              <AlertCircle className="h-4 w-4" />
              You need at least {DRINK_MIN} drinks to complete this order. You currently have {drinkCount}.
            </div>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-3">
          {lines.map((l) => (
            <li key={l.lineId} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex-1">
                <div className="font-semibold text-leaf-deep">{l.name}</div>
                <div className="text-xs text-muted-foreground">
                  {[l.size, l.protein].filter(Boolean).join(" · ") || "Standard"}
                  {l.seafood && <span className="ml-1 text-brown">· Seafood</span>}
                </div>
                {l.preferences && (
                  <div className="text-xs text-brown">No: {l.preferences}</div>
                )}
                <div className="mt-1 text-sm font-bold text-leaf-deep">{fmt(l.unitPrice * l.quantity)} <span className="text-[11px] font-medium text-muted-foreground">({fmt(l.unitPrice)} ea)</span></div>
              </div>
              <div className="inline-flex items-center rounded-full border border-border bg-background">
                <button onClick={() => setQty(l.lineId, l.quantity - 1)} className="inline-flex h-9 w-9 items-center justify-center text-leaf-deep hover:text-leaf-soft" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                <span className="min-w-6 text-center text-sm font-bold">{l.quantity}</span>
                <button onClick={() => setQty(l.lineId, l.quantity + 1)} className="inline-flex h-9 w-9 items-center justify-center text-leaf-deep hover:text-leaf-soft" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              <button onClick={() => remove(l.lineId)} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-coral" aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="text-display text-lg text-leaf-deep">Order summary</div>
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-bold">{fmt(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Items are sold in batches (5 meals/salads, 6 drinks). Final total — including delivery — is confirmed on WhatsApp.</p>
          <Link
            to={minMet ? "/checkout" : "/basket"}
            onClick={(e) => { if (!minMet) e.preventDefault(); }}
            aria-disabled={!minMet}
            className={`mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition ${
              minMet ? "bg-leaf-deep text-cream hover:opacity-90" : "cursor-not-allowed bg-muted-foreground/30 text-muted-foreground"
            }`}
          >
            {minMet ? "Confirm Order" : "Minimum not met"}
          </Link>
          <Link to="/salads" className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-semibold hover:border-leaf-deep hover:text-leaf-deep">
            Add more items
          </Link>
        </aside>
      </div>
    </Section>
  );
}
