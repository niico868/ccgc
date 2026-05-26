import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: "FAQ | Fine Time for Cathy's" },
    { name: "description", content: "Frequently asked questions about ordering, delivery, pickup, and meal prep." },
  ]}),
  component: FAQ,
});

const QA = [
  { q: "When do daily orders close?", a: "Daily orders close at 9:00 AM. Place your order the day before or first thing in the morning." },
  { q: "When does delivery start?", a: "Delivery starts at 2:00 PM and runs along the east-west corridor from Arima to Port of Spain." },
  { q: "How much is delivery?", a: "Delivery is a flat $40. We stay close to the main route | let us know your address at checkout." },
  { q: "Where can I pick up my order?", a: "Pickup 1: Sinclair, Port of Spain | 9 AM to 12 PM. Pickup 2: Orange Grove, Tacarigua / home restaurant | 2 PM to 5 PM." },
  { q: "Do you offer seafood?", a: "Yes | seafood meals (shrimp, fish, etc.) cost $5 more than the standard option." },
  { q: "How do I confirm my order?", a: "Order through the website. After checkout, we'll guide you to WhatsApp to confirm and arrange payment." },
  { q: "Do you cater events?", a: "Absolutely. Catering is planned in advance | submit a catering request and we'll be in touch." },
  { q: "More questions coming soon", a: "Final FAQ content will be added shortly. For now, message us on WhatsApp anytime." },
];

function FAQ() {
  return (
    <>
      <Section className="pt-14 lg:pt-20 pb-6">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">FAQ</div>
        <h1 className="mt-2 text-display text-4xl font-bold lg:text-5xl">Good questions, clear answers.</h1>
      </Section>
      <Section className="pb-20">
        <Accordion type="single" collapsible className="mx-auto max-w-2xl rounded-2xl border border-border bg-card px-6">
          {QA.map((qa, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">{qa.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{qa.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  );
}
