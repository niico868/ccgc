import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { OrderRules } from "./OrderRules";

export function OrderingAccordion() {
  return (
    <Accordion type="single" collapsible className="rounded-3xl border border-border bg-secondary/40">
      <AccordionItem value="how" className="border-0">
        <AccordionTrigger className="px-6 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-leaf-deep hover:no-underline">
          How ordering works
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <OrderRules />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function CompactPageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="border-b border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-7 lg:px-8 lg:py-9">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-leaf">{eyebrow}</div>
        <h1 className="mt-1.5 text-display text-2xl font-extrabold leading-tight text-leaf-deep lg:text-3xl">{title}</h1>
        {intro && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{intro}</p>}
      </div>
    </div>
  );
}
