import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Salad } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBasket } from "@/lib/basket";
import { PRICELESS, SALAD_PROTEINS } from "@/lib/menu-data";

const INGREDIENTS = [
  "Romaine lettuce",
  "Mixed greens",
  "Spinach",
  "Broccoli florets",
  "Cucumber",
  "Sweet corn",
  "Cherry tomatoes",
  "Bell peppers",
  "Red onion",
  "Pickled onion",
  "Carrots",
  "Avocado",
  "Chickpeas",
  "Quinoa",
  "Boiled egg",
  "Feta",
  "Olives",
  "Roasted vegetables",
  "Seasonal fruit",
  "Toasted seeds",
] as const;

const MAX_INGREDIENTS = 8;
const BASE_PRICE = 40;
const IMAGE = "/__l5e/assets-v1/d05d7260-a71e-4e10-b3be-9949dff94c36/grilled-salad-bowl.png";

export function BuildYourOwnSaladDialog() {
  const { add } = useBasket();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [protein, setProtein] = useState(SALAD_PROTEINS[0]);
  const [preferences, setPreferences] = useState("");
  const [qty, setQty] = useState(1);

  const canSubmit = selected.length === MAX_INGREDIENTS;

  const summary = useMemo(() => selected.join(", "), [selected]);

  const toggleIngredient = (ingredient: string) => {
    setSelected((prev) => {
      if (prev.includes(ingredient)) {
        return prev.filter((item) => item !== ingredient);
      }
      if (prev.length >= MAX_INGREDIENTS) {
        toast.info(`Choose up to ${MAX_INGREDIENTS} ingredients.`);
        return prev;
      }
      return [...prev, ingredient];
    });
  };

  const submit = () => {
    if (!canSubmit) {
      toast.error(`Please select exactly ${MAX_INGREDIENTS} ingredients.`);
      return;
    }

    add({
      itemId: "salad-build-your-own",
      name: "Make Your Own Salad",
      unitPrice: BASE_PRICE,
      quantity: qty,
      category: "salad",
      protein,
      preferences: preferences.trim() || undefined,
      notes: `Ingredients: ${summary}`,
    });

    toast.success(`${qty} × Make Your Own Salad added`);
    setOpen(false);
    setSelected([]);
    setProtein(SALAD_PROTEINS[0]);
    setPreferences("");
    setQty(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#E76F51,#D84A2B)] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(231,111,81,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(231,111,81,0.28)]">
          <Salad className="h-4 w-4" /> Make your own
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/60 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8EA_100%)] sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-display text-3xl text-leaf-deep">Build your own salad</DialogTitle>
          <DialogDescription className="text-sm text-foreground/75">
            Pick {MAX_INGREDIENTS} ingredients, choose your protein, tell us what to leave out, and add it straight to your basket.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[26px] border border-leaf-soft/20 bg-white shadow-[0_18px_35px_rgba(31,90,53,0.14)]">
            <div className="aspect-[4/3] overflow-hidden bg-secondary">
              <img src={IMAGE} alt="Make your own salad" className="h-full w-full object-cover" />
            </div>
            <div className="space-y-4 p-5">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-leaf-soft">Your build</div>
                <div className="mt-2 text-sm leading-relaxed text-foreground/80">
                  {selected.length > 0 ? summary : "Your chosen ingredients will appear here."}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-leaf-soft">Price</div>
                <div className="mt-1 text-lg font-bold text-leaf-deep">{PRICELESS}</div>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-leaf-soft">
                  Anything you'd rather we leave out
                </label>
                <input
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g. no olives, easy onions"
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-leaf-deep"
                />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-leaf-soft">Quantity</div>
                <div className="mt-2 inline-flex items-center rounded-full border border-border bg-background">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="inline-flex h-10 w-10 items-center justify-center text-leaf-deep">−</button>
                  <span className="min-w-8 text-center text-sm font-bold">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => q + 1)} className="inline-flex h-10 w-10 items-center justify-center text-leaf-deep">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-leaf-soft">Choose 8 ingredients</div>
                <div className="rounded-full bg-leaf-deep px-3 py-1 text-[11px] font-semibold text-cream">{selected.length}/{MAX_INGREDIENTS}</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {INGREDIENTS.map((ingredient) => {
                  const active = selected.includes(ingredient);
                  return (
                    <button
                      key={ingredient}
                      type="button"
                      onClick={() => toggleIngredient(ingredient)}
                      className={`flex min-h-11 items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                        active
                          ? "border-leaf-deep bg-leaf-deep text-cream"
                          : "border-border bg-white hover:border-leaf-soft hover:bg-secondary/50"
                      }`}
                    >
                      <span>{ingredient}</span>
                      <Plus className={`h-4 w-4 transition ${active ? "rotate-45" : ""}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-leaf-soft">Choose protein</div>
              <div className="flex flex-wrap gap-2">
                {SALAD_PROTEINS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setProtein(option)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      protein === option
                        ? "border-leaf-deep bg-leaf-deep text-cream"
                        : "border-border bg-white text-foreground hover:border-leaf-soft"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={submit}
              className={`inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition ${
                canSubmit
                  ? "bg-[linear-gradient(135deg,#E76F51,#D84A2B)] text-white shadow-[0_10px_24px_rgba(231,111,81,0.25)] hover:-translate-y-0.5"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              }`}
            >
              {canSubmit ? "Add custom salad to basket" : `Select ${MAX_INGREDIENTS - selected.length} more ingredient${MAX_INGREDIENTS - selected.length === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
