import type { ReactNode } from "react";

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-7xl px-4 lg:px-8 ${className}`}>{children}</section>;
}

export function PageHero({ eyebrow, title, intro, image }: { eyebrow: string; title: string; intro: string; image: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">{eyebrow}</div>
          <h1 className="mt-3 text-display text-4xl font-bold leading-[1.05] lg:text-5xl">{title}</h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground">{intro}</p>
        </div>
        <div className="relative overflow-hidden rounded-3xl shadow-soft">
          <img src={image} alt={title} className="aspect-[4/3] h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
