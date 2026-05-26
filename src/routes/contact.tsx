import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone, Truck } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — Fine Time for Cathy's" },
    { name: "description", content: "Get in touch with Fine Time for Cathy's by phone, WhatsApp, Instagram or email." },
  ]}),
  component: Contact,
});

function Contact() {
  return (
    <>
      <Section className="pt-14 lg:pt-20 pb-6">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">Contact</div>
        <h1 className="mt-2 text-display text-4xl font-bold lg:text-5xl">Let's talk fresh food.</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">WhatsApp is the fastest way to reach us — for ordering, catering, and meal prep questions.</p>
      </Section>
      <Section className="pb-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <h2 className="text-display text-xl font-semibold">Reach out</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-leaf" /> +1 868-488-4248</li>
              <li className="flex items-center gap-3"><Instagram className="h-5 w-5 text-leaf" /> @finelivingbycathy</li>
              <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-leaf" /> hello@finetimeforcathys.com</li>
            </ul>
            <a href={waLink("Hi! I have a question about ordering.")} target="_blank" rel="noreferrer"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-leaf px-6 text-sm font-semibold text-primary-foreground hover:opacity-90">
              <MessageCircle className="h-4 w-4" /> Message us on WhatsApp
            </a>
          </div>
          <div className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <h2 className="text-display text-xl font-semibold">Pickup & delivery</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3"><Clock className="mt-0.5 h-5 w-5 text-leaf" /> <span><b>Order cutoff:</b> 9:00 AM daily</span></li>
              <li className="flex items-start gap-3"><Truck className="mt-0.5 h-5 w-5 text-leaf" /> <span><b>Delivery:</b> from 2:00 PM, $40 flat. Arima → Port of Spain.</span></li>
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-leaf" /> <span><b>Pickup 1:</b> Sinclair, Port of Spain · 9 AM–12 PM</span></li>
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-leaf" /> <span><b>Pickup 2:</b> Lopinot · 2 PM–5 PM</span></li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
