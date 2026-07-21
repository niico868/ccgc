import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const TITLE = "FAQ: Ordering, Delivery & Pickup | Cathy's Clean Green Classics";
const DESC = "Answers on cutoffs, delivery from 11 AM, pickup at Orange Grove, batch pricing, seafood additions and how to confirm your order online.";
const URL = "https://cathysgreenkitchen.com/faq";

const QA = [
  { q: "When are salad days?", a: "Salad days are Monday and Wednesday. Every plate is made fresh on the day of fulfillment." },
  { q: "When do I need to order by?", a: "The cutoff is 8:00 AM Trinidad time on your fulfillment day. Same-day orders on Monday or Wednesday are open until 8:00 AM. After that, please choose the next salad day." },
  { q: "Can I order for the same day?", a: "Yes, if you get your order in before 8:00 AM Trinidad time on a Monday or Wednesday. After 8:00 AM, your order rolls to the next salad day." },
  { q: "When does delivery start?", a: "Delivery begins at 11:00 AM and runs along the east west corridor." },
  { q: "How much is delivery?", a: "Curepe to Arima is $30. Trincity and environs is $20. Cathy's team confirms the final fee when they review your order." },
  { q: "Where can I pick up my order?", a: "Pickup is at Orange Grove, Tacarigua, from 11:00 AM to 6:00 PM on your fulfillment day." },
  { q: "What about prices?", a: "Salads are $45 each (minimum 5 items). Healthy meals are $50 each (minimum 5 items). Fish or shrimp add $5 per item. Cold-pressed juices are $18 each (minimum 6 drinks). Ginger shots are $8 each (minimum 6 drinks). Cathy's team confirms your final total, including delivery, after you submit your order." },
  { q: "Do you offer seafood?", a: "Yes. Fish and shrimp are available on salads and meals and add $5 per item. Choose the protein on the product card and the price updates right away." },
  { q: "What are the order minimums?", a: "Food orders need at least 5 items in total. Salads and healthy meals can be combined. Drink orders need at least 6 items in total. Juices and ginger shots can be combined." },
  { q: "How do I confirm my order?", a: "Place your order through the website. After you submit, you'll see a confirmation screen with your order reference and full details. Cathy's team then reviews it and follows up to confirm availability, fulfillment details and payment." },
  { q: "Do I need an account?", a: "No, an account is completely optional. You can check out as a guest any time. Creating an account simply saves your details for faster future orders and keeps your order history in one place." },
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
