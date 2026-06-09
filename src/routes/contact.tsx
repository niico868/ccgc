import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone, Truck } from "lucide-react";
import { waLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact | Fine Time for Cathy's Clean Green Classics" },
    { name: "description", content: "Leave us a message, or reach us on WhatsApp, Instagram, phone or email." },
  ]}),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: p } = await supabase.from("profiles").select("first_name,last_name,email,phone").eq("id", user.id).maybeSingle();
      if (!p) return;
      const name = [p.first_name, p.last_name].filter(Boolean).join(" ").trim();
      setForm((f) => ({
        name: f.name || name,
        email: f.email || p.email || user.email || "",
        phone: f.phone || p.phone || "",
        message: f.message,
      }));
    })();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("cgcc.messages") || "[]");
    existing.push({ ...form, at: new Date().toISOString() });
    localStorage.setItem("cgcc.messages", JSON.stringify(existing));
    toast.success("Message sent. We'll get back to you soon.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const input = "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-leaf";

  return (
    <>
      <Section className="pt-12 lg:pt-16 pb-4">
        <h1 className="text-display text-3xl font-extrabold lg:text-4xl">Let's Chat</h1>
      </Section>

      <Section className="pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-card lg:p-8">
            <div className="text-display text-xl font-extrabold">Leave Us a Message</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Use this form to share your thoughts, feedback, questions, or any note you would like us to receive. For faster order-related communication, please message us directly on WhatsApp.
            </p>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <input required placeholder="Customer name" value={form.name} onChange={set("name")} className={input} />
              <input required type="email" placeholder="Customer email" value={form.email} onChange={set("email")} className={input} />
              <input type="tel" placeholder="Phone number (optional)" value={form.phone} onChange={set("phone")} className={input} />
              <textarea required rows={5} placeholder="Your message" value={form.message} onChange={set("message")}
                className="w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-leaf" />
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-full bg-leaf px-6 text-sm font-extrabold text-primary-foreground hover:opacity-90">
                  Send Message
                </button>
                <a href={waLink("Hi! I have a question.")} target="_blank" rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-extrabold text-white hover:brightness-105">
                  <MessageCircle className="h-4 w-4 fill-white" /> WhatsApp Us
                </a>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="text-display text-base font-extrabold uppercase tracking-wider text-leaf-deep">Reach out</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-leaf" /> +1 868-488-4248</li>
                <li className="flex items-center gap-3"><Instagram className="h-4 w-4 text-leaf" /> @finelivingbycathy</li>
                <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-leaf" /> dfinetimerestaurant@gmail.com</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="text-display text-base font-extrabold uppercase tracking-wider text-leaf-deep">Pickup &amp; delivery</div>
              <ul className="mt-3 space-y-2 text-sm text-brown">
                <li className="flex items-start gap-3"><Clock className="mt-0.5 h-4 w-4 text-leaf" /> <span><b className="text-leaf-deep">Order cutoff:</b> The day before your fulfillment day. No same-day orders.</span></li>
                <li className="flex items-start gap-3"><Truck className="mt-0.5 h-4 w-4 text-leaf" /> <span><b className="text-leaf-deep">Delivery:</b> from 2 PM.</span></li>
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-leaf" /> <span><b className="text-leaf-deep">St Clair:</b> 11 AM to 1 PM</span></li>
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-leaf" /> <span><b className="text-leaf-deep">Orange Grove, Tacarigua:</b> 2 PM to 6 PM</span></li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
