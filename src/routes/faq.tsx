import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const TITLE = "FAQ: Ordering, Delivery & Pickup | Cathy's Clean Green Classics";
const DESC = "Answers on cutoffs, delivery 11 AM to about 2 PM, pickup at Trincity or St. Clair, batch pricing, protein choices and how to confirm your order online.";
const URL = "https://cathysgreenkitchen.com/faq";

const QA = [
  { q: "When are salad days?", a: "Salad days are Monday, Wednesday and Friday. Every plate is made fresh on the day of fulfillment." },
  { q: "When do I need to order by?", a: "The cutoff is 8:00 AM Trinidad time on your fulfillment day. Same-day orders on Monday, Wednesday or Friday are open until 8:00 AM. After that, please choose the next salad day." },
  { q: "Can I order for the same day?", a: "Yes, if you get your order in before 8:00 AM Trinidad time on a Monday, Wednesday or Friday. After 8:00 AM, your order rolls to the next salad day." },
  { q: "When does delivery start?", a: "Delivery 11 AM – about 2 PM along the east west corridor." },
  { q: "How much is delivery?", a: "Curepe to Arima is $30. Trincity and environs is $20. Cathy's team confirms the final fee when they review your order." },
  { q: "Where can I pick up my order?", a: "Pickup is at Trincity, 2 PM to 5 PM, or St. Clair, 11 AM to 1 PM on your fulfillment day." },
  { q: "What about prices?", a: "Salads are $45 each (minimum 5 items). Healthy meals are $50 each (minimum 5 items). Beef, fish or shrimp add $5 per item. Cold-pressed juices are $18 each (minimum 6 drinks). Ginger shots are $8 each (minimum 6 drinks). Cathy's team confirms your final total, including delivery, after you submit your order." },
  { q: "Which proteins can I choose?", a: "Chicken, beef, fish, shrimp or vegetarian on salads and healthy meals. Beef, fish and shrimp add $5 per item. Choose the protein on the product card and the price updates right away." },
  { q: "What do vegetarian options include?", a: "Vegetarian options contain no meat or seafood but may include dairy (such as feta) and egg." },
  { q: "How do the weekly menus work?", a: "Healthy meals alternate between Menu A and Menu B each week. Choose your delivery date first to see the meals for that week. Salads and juices do not rotate." },
  { q: "What are the order minimums?", a: "Food orders need at least 5 items in total. Salads and healthy meals can be combined. Drink orders need at least 6 items in total. Juices and ginger shots can be combined." },
  { q: "How far ahead can I order?", a: "You can book any Monday, Wednesday or Friday up to six months ahead. Choose your date before adding meals. The menu matches your selected week." },
  { q: "Can I set up a recurring order?", a: "Yes. At checkout you can ask us to repeat this order weekly or monthly. You are only billed for the order you are placing now, and we contact you before each repeat." },
  { q: "How do I confirm my order?", a: "Place your order through the website. After you submit, you'll see a confirmation screen with your order reference and full details. Cathy's team then reviews it and follows up to confirm availability, fulfillment details and payment." },
  { q: "Do I need an account?", a: "No, an account is completely optional. You can check out as a guest any time. Creating an account simply saves your details for faster future orders and keeps your order history in one place." },
];

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
