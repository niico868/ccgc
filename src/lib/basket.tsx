import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type BasketLine = {
  lineId: string;
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  protein?: string;
  addons?: string[];
  juiceOption?: string;
  notes?: string;
};

type BasketCtx = {
  lines: BasketLine[];
  add: (line: Omit<BasketLine, "lineId">) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<BasketCtx | null>(null);
const KEY = "cgcc.basket.v1";

export function BasketProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BasketLine[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines]);

  const add: BasketCtx["add"] = useCallback((line) => {
    setLines((prev) => [...prev, { ...line, lineId: crypto.randomUUID() }]);
  }, []);
  const remove = useCallback((id: string) => setLines((p) => p.filter((l) => l.lineId !== id)), []);
  const setQty = useCallback((id: string, qty: number) =>
    setLines((p) => p.map((l) => (l.lineId === id ? { ...l, quantity: Math.max(1, qty) } : l))), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<BasketCtx>(() => ({
    lines, add, remove, setQty, clear,
    count: lines.reduce((s, l) => s + l.quantity, 0),
    subtotal: lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0),
  }), [lines, add, remove, setQty, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBasket() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBasket must be used within BasketProvider");
  return ctx;
}
