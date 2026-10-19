import { useBasket } from "@/lib/basket";
import { saladDaysAhead } from "@/lib/fulfillment";
import { Button } from "@/components/ui/button";

export function OrderDatePicker() {
  const { fulfillmentDate, setFulfillmentDate, unavailableLines } = useBasket();
  const days = saladDaysAhead(6);
  return (
    <div className="border-y border-border py-5">
      <label htmlFor="order-date" className="text-display text-xl text-leaf-deep">Choose your delivery or pickup date</label>
      <select id="order-date" aria-label="Delivery or pickup date" value={fulfillmentDate} onChange={(e) => setFulfillmentDate(e.target.value)} className="mt-3 h-12 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground sm:max-w-md sm:ml-4">
        {!days.some((d) => d.value === fulfillmentDate) && <option value={fulfillmentDate}>Choose an available date</option>}
        {days.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
      </select>
      {!!unavailableLines.length && <div role="alert" className="mt-3 text-sm text-coral">Not available for this week: {unavailableLines.map((l) => l.name).join(", ")}. Remove these meals from your basket or change the date back.</div>}
    </div>
  );
}