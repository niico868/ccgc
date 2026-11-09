import { photoSrcSet } from "@/lib/utils";
import { useBasket } from "@/lib/basket";
import { addDays, currentMenuWeekMonday, mealsForDate, menuWeekLabel, shortDay, weekMonday } from "@/lib/menu-rotation";
import { Link } from "@tanstack/react-router";
import { dishPath } from "@/lib/menu-data";
import { MenuCard } from "./MenuCard";
import { Button } from "@/components/ui/button";

export function WeeklyMeals() {
  const { fulfillmentDate, setFulfillmentDate } = useBasket();
  const monday = fulfillmentDate ? weekMonday(fulfillmentDate) : currentMenuWeekMonday();
  const nextMonday = addDays(monday, 7);
  return <div className="col-span-full space-y-10">
    <div><h2 className="text-display text-3xl text-leaf-deep">This week's meals</h2><p className="mt-2 text-sm text-brown">{menuWeekLabel(monday)}</p></div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{mealsForDate(monday).map((item) => <MenuCard key={item.id} item={item} />)}</div>
    <details className="border-t border-border pt-6">
      <summary className="cursor-pointer text-display text-xl text-brown">Next week's menu – from {shortDay(nextMonday)}</summary>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">{mealsForDate(nextMonday).map((item) => <article key={item.id} className="overflow-hidden rounded-lg border border-border bg-card/60"><img src={item.image}
          srcSet={photoSrcSet(item.image)}
          sizes="(min-width: 640px) 33vw, 100vw" alt={item.name} loading="lazy" className="aspect-[16/10] w-full object-cover opacity-75" /><h3 className="p-3 text-display text-base text-brown"><Link to={dishPath(item)} className="hover:underline">{item.name}</Link></h3></article>)}</div>
      <Button className="mt-5" onClick={() => setFulfillmentDate(nextMonday)}>Order for next week</Button>
    </details>
  </div>;
}