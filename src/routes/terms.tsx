import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";

const TITLE = "Terms & Conditions | Cathy's Clean Green Classics";
const DESC = "The terms for ordering salads, meals and juices from Cathy's Clean Green Classics, including cutoffs, changes, refunds, delivery and allergens.";
const URL = "https://cathysgreenkitchen.com/terms";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Terms,
});

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-display text-xl text-leaf-deep">{children}</h2>;
}

function Terms() {
  return (
    <Section className="py-12">
      <div className="mx-auto max-w-2xl text-sm leading-relaxed text-foreground/85">
        <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-2 text-xs text-brown">Last updated: 2 November 2026</p>
        <p className="mt-4">
          These terms apply when you order from Fine Time for Cathy's Clean Green Classics ("we", "us") through cathysgreenkitchen.com. By placing an order, you agree to them.
        </p>

        <Heading>Orders</Heading>
        <p className="mt-2">Submitting an order is a request. After you submit, our team reviews it and follows up to confirm availability, fulfilment details, payment and the final total.</p>

        <Heading>Days and cutoff</Heading>
        <p className="mt-2">We fulfil orders on Mondays, Wednesdays and Fridays. Same-day orders close at 8:00 AM Trinidad time. You can book up to six months ahead. Healthy meals alternate weekly, so availability depends on the date you choose.</p>

        <Heading>Minimums, delivery and pickup</Heading>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li><b>Delivery minimum:</b> 5 salads or meals for food orders, and 6 juices or shots for drink orders.</li>
          <li><b>Pickup:</b> no minimum. Trincity 2 PM to 5 PM, or St. Clair 11 AM to 1 PM.</li>
          <li><b>Delivery:</b> 11 AM to about 2 PM along the east west corridor. Curepe to Arima is $30, and Trincity and environs is $20.</li>
        </ul>

        <Heading>Prices and payment</Heading>
        <p className="mt-2">Prices are shown on the website. Beef, fish and shrimp add $5 per item. You can pay by bank transfer or cash. Your order reference should be used when paying by bank transfer.</p>

        <Heading>Changes, cancellations and refunds</Heading>
        <p className="mt-2">You can change your order up until 8:00 AM on the day of delivery. Refunds are given up to 24 hours before delivery. After that, please contact us and we will do our best to work something out with you.</p>

        <Heading>Recurring orders</Heading>
        <p className="mt-2">You can ask us to repeat an order weekly or monthly. You are only billed for the current order, and we check in with you before each repeat.</p>

        <Heading>Allergies and dietary needs</Heading>
        <p className="mt-2">Many of our salads and meals contain nuts or peanuts. Everything is made in the same kitchen, including shrimp and other shellfish, so traces are possible even when you ask us to leave out an ingredient. We cannot guarantee any item is allergen-free. Please tell us about allergies when ordering.</p>

        <Heading>Storage</Heading>
        <p className="mt-2">Keep everything refrigerated. Salads and meals last up to 5 days. Juices are best within 3 days.</p>

        <Heading>Accounts and Green Points</Heading>
        <p className="mt-2">An account is optional. Please keep your login details safe and your information accurate. Green Points are a loyalty benefit with no cash value.</p>

        <Heading>Reviews</Heading>
        <p className="mt-2">Reviews should be honest and respectful. We approve reviews before they appear and may decline or remove them.</p>

        <Heading>Your information</Heading>
        <p className="mt-2">Our <Link to="/privacy" className="font-semibold text-leaf-deep underline">Privacy Policy</Link> explains how we handle your information.</p>

        <Heading>Governing law</Heading>
        <p className="mt-2">These terms are governed by the laws of Trinidad and Tobago.</p>

        <Heading>Contact us</Heading>
        <p className="mt-2">
          Email <a href="mailto:dfinetimerestaurant@gmail.com" className="font-semibold text-leaf-deep underline">dfinetimerestaurant@gmail.com</a> or call +1 868-488-4248.
        </p>
      </div>
    </Section>
  );
}
