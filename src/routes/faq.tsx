import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const TITLE = "FAQ: Ordering, Delivery & Pickup | Cathy's Clean Green Classics";
const DESC = "Answers on order cutoffs, delivery windows, pickup spots in St Clair and Orange Grove, batch pricing and how to confirm your order on WhatsApp.";
const URL = "https://cathysgreenkitchen.com/faq";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: QA.map((qa) => ({
          "@type": "Question",
          name: qa.q,
          acceptedAnswer: { "@type": "Answer", text: qa.a },
        })),
      }),
    }],
  }),
  component: FAQ,
});

const QA = [
  { q: "When do I need to order by?", a: "Orders close the day before your fulfillment day. Place your order at least one day ahead so we can prep everything fresh for you." },
  { q: "Can I order for the same day?", a: "No. Every plate is made fresh to order, so anything placed today applies to the next fulfillment day." },
  { q: "When does delivery start?", a: "Delivery begins at 2:00 PM and runs along the east-west corridor." },
  { q: "How much is delivery?", a: "Delivery is a flat fee. Add your address at checkout and we'll confirm the final cost on WhatsApp." },
  { q: "Where can I pick up my order?", a: "Pickup 1: St Clair, 11 AM – 1 PM. Pickup 2: Orange Grove, Tacarigua, 2 PM – 6 PM." },
  { q: "What about prices?", a: "Salads are $45 each (batch of 5). Healthy meals are $50 each (batch of 5); seafood adds $5 per meal. Cold-pressed juices are $18 each (batch of 6). Ginger shots are $8 each (batch of 6). Everything is sold in batches only, and Cathy will confirm your final total, including delivery, on WhatsApp." },
  { q: "Do you offer seafood?", a: "Yes, fish and shrimp options are available on salads and meals on request." },
  { q: "What are the order minimums?", a: "Minimum 5 meals per food order and 6 drinks per juice order." },
  { q: "How do I confirm my order?", a: "Place your order through the website. Once submitted, you'll see a confirmation screen with your order reference and details. Cathy's team then reviews it and follows up to confirm availability, fulfilment details and payment." },
  { q: "Do I need an account?", a: "No, an account is completely optional. You can check out as a guest any time. Creating an account is a nice extra that saves your details for faster future orders and keeps your order history in one place, but it's never required." },

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
