import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHero, Section } from "@/components/site/Section";
import hero from "@/assets/section-catering.jpg";
import { waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/catering")({
  head: () => ({ meta: [
    { title: "Catering — Fine Time for Cathy's" },
    { name: "description", content: "Request catering for events, office lunches and family gatherings." },
  ]}),
  component: Catering,
});

function Catering() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", date: "", location: "",
    guests: "", eventType: "", menu: "", budget: "", fulfillment: "Delivery", notes: "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("cgcc.catering") || "[]");
    existing.push({ ...form, at: new Date().toISOString() });
    localStorage.setItem("cgcc.catering", JSON.stringify(existing));

    const msg = `Hi! I'd like to request catering from Fine Time for Cathy's.

Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
Event date: ${form.date}
Location: ${form.location}
Guests: ${form.guests}
Event type: ${form.eventType}
Menu preference: ${form.menu}
Budget: ${form.budget}
Pickup/Delivery: ${form.fulfillment}
Notes: ${form.notes}`;
    toast.success("Catering request received!", { description: "Opening WhatsApp to confirm." });
    setTimeout(() => window.open(waLink(msg), "_blank"), 700);
  };

  const input = "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf";

  return (
    <>
      <PageHero eyebrow="Catering" title="Family-style food, beautifully planned."
        intro="Office lunches, birthdays, intimate weddings, family events. Tell us the details — we'll handle the rest."
        image={hero} />
      <Section className="py-14">
        <form onSubmit={submit} className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-7 shadow-card lg:p-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Your name" value={form.name} onChange={set("name")} className={input} />
            <input required placeholder="Phone number" value={form.phone} onChange={set("phone")} className={input} />
            <input placeholder="Email" type="email" value={form.email} onChange={set("email")} className={input} />
            <input required type="date" placeholder="Event date" value={form.date} onChange={set("date")} className={input} />
            <input required placeholder="Event location" value={form.location} onChange={set("location")} className={input} />
            <input required type="number" placeholder="Number of guests" value={form.guests} onChange={set("guests")} className={input} />
            <input placeholder="Type of event (corporate, wedding...)" value={form.eventType} onChange={set("eventType")} className={input} />
            <input placeholder="Preferred menu style" value={form.menu} onChange={set("menu")} className={input} />
            <input placeholder="Budget range" value={form.budget} onChange={set("budget")} className={input} />
            <select value={form.fulfillment} onChange={set("fulfillment")} className={input}>
              <option>Delivery</option>
              <option>Pickup</option>
            </select>
          </div>
          <textarea placeholder="Extra notes" value={form.notes} onChange={set("notes")} rows={4}
            className="mt-4 w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-leaf" />
          <button type="submit"
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-leaf text-sm font-semibold text-primary-foreground hover:opacity-90">
            Submit Catering Request
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">After submission, you'll be guided to WhatsApp to confirm.</p>
        </form>
      </Section>
    </>
  );
}
