import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/site/Section";
import { z } from "zod";

const search = z.object({ ref: z.string().optional() });

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({ meta: [{ title: "Order Confirmed | Cathy's Clean Green Classics" }] }),
  validateSearch: (raw) => search.parse(raw),
  component: Confirmation,
});

function Confirmation() {
  const { ref } = Route.useSearch();
  return (
    <Section className="py-20 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-leaf-deep" />
      <h1 className="mt-4 text-display text-3xl text-leaf-deep lg:text-4xl">Order submitted, thank you.</h1>
      <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
        Your order has been received and is awaiting confirmation from Cathy. You'll hear from us shortly with
        final total and next steps.
      </p>
      {ref && (
        <div className="mx-auto mt-6 inline-flex flex-col items-center gap-1 rounded-2xl border border-leaf-soft/40 bg-leaf-soft/10 px-6 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-leaf-soft">Your order reference</div>
          <div className="font-mono text-xl font-bold text-leaf-deep">{ref}</div>
        </div>
      )}
      <p className="mx-auto mt-4 max-w-md text-xs text-muted-foreground">
        Status: <b>Submitted, awaiting confirmation.</b> Keep this reference for your records.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/account" className="inline-flex h-11 items-center rounded-full bg-leaf-deep px-7 text-sm font-semibold text-cream hover:opacity-90">
          View my orders
        </Link>
        <Link to="/" className="inline-flex h-11 items-center rounded-full border border-border px-7 text-sm font-semibold hover:border-leaf-deep hover:text-leaf-deep">
          Back home
        </Link>
      </div>
    </Section>
  );
}
