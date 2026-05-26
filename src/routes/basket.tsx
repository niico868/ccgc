import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { useBasket } from "@/lib/basket";
import { Minus, Plus, Trash2, ShoppingBasket } from "lucide-react";

export const Route = createFileRoute("/basket")({
  head: () => ({ meta: [{ title: "Your Basket — Fine Time for Cathy's" }] }),
  component: Basket,
});

function Basket() {
  const { lines, setQty, remove, subtotal } = useBasket();

  if (lines.length === 0) {
    return (
      <Section className="py-24 text-center">
        <ShoppingBasket className="mx-auto h-12 w-12 text-leaf" />
        <h1 className="mt-4 text-display text-3xl font-bold">Your basket is empty</h1>
        <p className="mt-2 text-muted-foreground">Browse the menu and start adding fresh classics.</p>
        <Link to="/salads" className="mt-6 inline-flex h-11 items-center rounded-full bg-leaf px-6 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Browse menu
        </Link>
      </Section>
    );
  }

  return (
    <Section className="py-14">
      <h1 className="text-display text-3xl font-bold lg:text-4xl">Your Basket</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-3">
          {lines.map((l) => (
            <li key={l.lineId} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex-1">
                <div className="font-semibold">{l.name}</div>
                <div className="text-xs text-muted-foreground">
                  {[l.protein, l.juiceOption, l.addons?.join(", ")].filter(Boolean).join(" · ") || "Standard"}
                </div>
                <div className="mt-1 text-sm font-semibold text-leaf">${l.unitPrice}</div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-background">
                <button onClick={() => setQty(l.lineId, l.quantity - 1)} className="inline-flex h-9 w-9 items-center justify-center hover:text-leaf"><Minus className="h-3.5 w-3.5" /></button>
                <span className="min-w-6 text-center text-sm font-semibold">{l.quantity}</span>
                <button onClick={() => setQty(l.lineId, l.quantity + 1)} className="inline-flex h-9 w-9 items-center justify-center hover:text-leaf"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              <button onClick={() => remove(l.lineId)} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-tomato">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="text-display text-lg font-semibold">Order summary</div>
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Delivery fee ($40) added at checkout if you choose delivery. Seafood items already include +$5.</p>
          <Link to="/checkout"
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-leaf text-sm font-semibold text-primary-foreground hover:opacity-90">
            Confirm Order
          </Link>
          <Link to="/salads" className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-medium hover:border-leaf hover:text-leaf">
            Add more items
          </Link>
        </aside>
      </div>
    </Section>
  );
}
