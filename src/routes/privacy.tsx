import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";

const TITLE = "Privacy Policy | Cathy's Clean Green Classics";
const DESC = "How Cathy's Clean Green Classics collects, uses, stores and shares your information when you order or create an account.";
const URL = "https://cathyscleangreenclassics.com/privacy";

export const Route = createFileRoute("/privacy")({
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
  component: Privacy,
});

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-display text-xl text-leaf-deep">{children}</h2>;
}

function Privacy() {
  return (
    <Section className="py-12">
      <div className="mx-auto max-w-2xl text-sm leading-relaxed text-foreground/85">
        <h1 className="text-display text-3xl text-leaf-deep lg:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-xs text-brown">Last updated: 2 November 2026</p>
        <p className="mt-4">
          This policy explains how Fine Time for Cathy's Clean Green Classics ("we", "us") handles your information when you use cathyscleangreenclassics.com in Trinidad &amp; Tobago.
        </p>

        <Heading>What we collect</Heading>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li><b>Order details:</b> your name, phone number, optional email, delivery address and area or pickup location, chosen date, items, payment method, and any notes or drop-off instructions.</li>
          <li><b>Allergy and dietary information:</b> anything you choose to tell us so we can prepare your food.</li>
          <li><b>Account details:</b> if you create an account, your name, email, phone number, saved address and delivery preferences, marketing choice, order history and Green Points.</li>
          <li><b>Google sign-in:</b> if you continue with Google, we receive your name, email address and Google account identifier.</li>
          <li><b>Messages and reviews:</b> what you send through our contact form and any review you submit.</li>
          <li><b>Your browser:</b> your basket, chosen date and sign-in session are saved in your browser so the site works properly.</li>
        </ul>
        <p className="mt-2">We do not collect card numbers on this website. Payment is by bank transfer or cash.</p>

        <Heading>How we use it</Heading>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>To prepare, deliver and confirm your orders, and to contact you about them.</li>
          <li>To run your account, order history and Green Points.</li>
          <li>To answer your messages and publish reviews we have approved.</li>
          <li>To send news and offers by email, only if you opted in.</li>
        </ul>

        <Heading>Google user data</Heading>
        <p className="mt-2">
          We only use the name, email address and account identifier received from Google to sign you in and run your account. We do not sell this data, use it for advertising, or share it except with the service providers below as needed to run the site.
        </p>

        <Heading>Who we share it with</Heading>
        <p className="mt-2">We do not sell your information. We share it only with the services that help us run the site, or where the law requires it:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li><b>Supabase:</b> stores accounts, orders and messages.</li>
          <li><b>Cloudflare:</b> hosts the website.</li>
          <li><b>Google:</b> provides Google sign-in, if you use it.</li>
          <li><b>WhatsApp:</b> receives your order details if you choose to send them to us there, or if we contact you there.</li>
        </ul>

        <Heading>How long we keep it</Heading>
        <p className="mt-2">We keep your information for as long as we need it to serve you, run your account and keep business records. You can ask us to delete it sooner.</p>

        <Heading>Your choices</Heading>
        <p className="mt-2">You can ask to see, correct or delete your information, or stop marketing emails, by contacting us. We may need to keep some records where the law requires it.</p>

        <Heading>Children</Heading>
        <p className="mt-2">Accounts and orders are meant for adults. A parent or guardian should place orders for children.</p>

        <Heading>Changes</Heading>
        <p className="mt-2">If we change this policy, we will update it on this page and change the date above.</p>

        <Heading>Contact us</Heading>
        <p className="mt-2">
          Email <a href="mailto:dfinetimerestaurant@gmail.com" className="font-semibold text-leaf-deep underline">dfinetimerestaurant@gmail.com</a> or call +1 868-488-4248. See also our <Link to="/terms" className="font-semibold text-leaf-deep underline">Terms &amp; Conditions</Link>.
        </p>
      </div>
    </Section>
  );
}
