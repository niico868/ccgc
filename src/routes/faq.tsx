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
  { q: "When do I need to order by?", a: "Orders close the day before your fulfillment day. Place your order at least one day in advance so we can prep fresh for you." },
  { q: "Can I order for the same day?", a: "No. All lunches are made to order, so any order placed today will apply to the next fulfillment day." },
  { q: "When does delivery start?", a: "Delivery starts at 2:00 PM and runs along the east-west corridor." },
  { q: "How much is delivery?", a: "Delivery is a flat $40. Add your address at checkout and we'll confirm on WhatsApp." },
  { q: "Where can I pick up my order?", a: "Pickup 1: St Clair, 11 AM – 1 PM. Pickup 2: Orange Grove, Tacarigua, 2 PM – 6 PM." },
  { q: "What are the prices?", a: "Custom salads start at $40 each. Healthy meals start at $45 each. Seafood (fish or shrimp) adds $5 per meal." },
  { q: "Do you offer seafood?", a: "Yes — fish and shrimp options are available on salads and meals for an extra $5 per item." },
  { q: "What are the order minimums?", a: "Minimum 5 meals per food order and 6 drinks per juice order." },
  { q: "How do I confirm my order?", a: "Place your order through the website. After checkout, we'll open WhatsApp with your order details — press send to confirm with Cathy and arrange payment." },
  { q: "Do I need an account?", a: "Yes — accounts are quick to set up at checkout (or via the account menu) and let you save your order history and discount codes." },
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
              <AccordionContent className="text-sm text-brown">{qa.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  );
}
