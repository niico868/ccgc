import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { FOOD_MIN, DRINK_MIN } from "./menu-data";
import { saladDaysAhead } from "./fulfillment";
import { unavailableMeals } from "./menu-rotation";

export type BasketCategory = "salad" | "meal" | "juice";
export type Fulfillment = "Delivery" | "Pickup";

export type BasketLine = {
  lineId: string;
  itemId: string;
  name: string;
  /** Adjusted unit price customers actually pay (base + seafood addition when applicable). */
  unitPrice: number;
  /** Original product base price, before any seafood addition. */
  basePrice?: number;
  /** Per-unit seafood addition included in unitPrice. */
  seafoodAdd?: number;
  quantity: number;
  category: BasketCategory;
  protein?: string;
  size?: string;
  seafood?: boolean;
  preferences?: string;
  notes?: string;
};

type BasketCtx = {
  fulfillmentDate: string;
  setFulfillmentDate: (date: string) => void;
  fulfillment: Fulfillment;
  setFulfillment: (value: Fulfillment) => void;
  unavailableLines: BasketLine[];
  lines: BasketLine[];
  add: (line: Omit<BasketLine, "lineId">) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  foodCount: number;
  drinkCount: number;
  foodOk: boolean;
  drinkOk: boolean;
  minMet: boolean;
};

const Ctx = createContext<BasketCtx | null>(null);
const KEY = "cgcc.basket.v2";

export function BasketProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BasketLine[]>([]);
  const [fulfillmentDate, setFulfillmentDate] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("Delivery");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setLines((JSON.parse(raw) as BasketLine[]).map((l) => ({ ...l, protein: l.protein === "Vegan" ? "Vegetarian" : l.protein })));
      const days = saladDaysAhead(6);
      const savedDate = localStorage.getItem(`${KEY}.date`);
      setFulfillmentDate(days.some((d) => d.value === savedDate) ? savedDate ?? "" : days[0]?.value ?? "");
      if (localStorage.getItem(`${KEY}.fulfillment`) === "Pickup") setFulfillment("Pickup");
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(lines)); localStorage.setItem(`${KEY}.date`, fulfillmentDate); localStorage.setItem(`${KEY}.fulfillment`, fulfillment); } catch {}
  }, [lines, fulfillmentDate, fulfillment, ready]);

  const add: BasketCtx["add"] = useCallback((line) => {
    setLines((prev) => [...prev, { ...line, lineId: crypto.randomUUID() }]);
  }, []);
  const remove = useCallback((id: string) => setLines((p) => p.filter((l) => l.lineId !== id)), []);
  const setQty = useCallback((id: string, qty: number) =>
    setLines((p) => p.map((l) => (l.lineId === id ? { ...l, quantity: Math.max(1, qty) } : l))), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<BasketCtx>(() => {
    const foodCount = lines.filter((l) => l.category !== "juice").reduce((s, l) => s + l.quantity, 0);
    const drinkCount = lines.filter((l) => l.category === "juice").reduce((s, l) => s + l.quantity, 0);
    // Minimums apply to delivery only; pickup has no minimum.
    const foodOk = fulfillment === "Pickup" || foodCount === 0 || foodCount >= FOOD_MIN;
    const drinkOk = fulfillment === "Pickup" || drinkCount === 0 || drinkCount >= DRINK_MIN;
    const hasItems = lines.length > 0;
    const unavailableLines = unavailableMeals(lines, fulfillmentDate) as BasketLine[];
    const dateOk = saladDaysAhead(6).some((d) => d.value === fulfillmentDate);
    return {
      fulfillmentDate, setFulfillmentDate, fulfillment, setFulfillment, unavailableLines,
      lines, add, remove, setQty, clear,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal: lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0),
      foodCount, drinkCount, foodOk, drinkOk,
      minMet: hasItems && foodOk && drinkOk && dateOk && unavailableLines.length === 0,
    };
  }, [lines, add, remove, setQty, clear, fulfillmentDate, fulfillment]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBasket() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBasket must be used within BasketProvider");
  return ctx;
}
