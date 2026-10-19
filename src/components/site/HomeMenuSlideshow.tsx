import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MenuItem } from "@/lib/menu-data";

export function HomeMenuSlideshow({ title, to, items }: { title: string; to: "/salads" | "/meals" | "/juices"; items: MenuItem[] }) {
  const [ref, api] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const update = useCallback(() => setSelected(api?.selectedScrollSnap() ?? 0), [api]);
  useEffect(() => { if (!api) return; api.reInit(); update(); api.on("select", update); return () => { api.off("select", update); }; }, [api, update, items]);
  useEffect(() => {
    if (!api || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => api.scrollNext(), 4000);
    return () => window.clearInterval(timer);
  }, [api, paused]);
  return <section aria-label={title} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onPointerDown={(e) => { if (e.pointerType === "touch") setPaused((p) => !p); }} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
    <div className="flex items-center justify-between px-5 pt-4"><h3 className="text-display text-2xl text-leaf-deep">{title}</h3><Button variant="ghost" size="icon" aria-label={paused ? `Play ${title} slideshow` : `Pause ${title} slideshow`} onClick={() => setPaused((p) => !p)}>{paused ? "▶" : "Ⅱ"}</Button></div>
    <div ref={ref} className="overflow-hidden"><div className="flex">{items.map((item) => <div key={item.id} className="grid min-w-0 flex-[0_0_100%] sm:grid-cols-[40%_1fr]"><img src={item.image} alt={item.name} loading="lazy" className="aspect-[16/10] h-full max-h-72 w-full object-cover" /><div className="flex flex-col justify-center gap-3 p-5"><h4 className="text-display text-xl text-leaf-deep">{item.name}</h4><p className="text-sm text-foreground/80">{item.description}</p><Link to={to} className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-deep">Browse Menu <ArrowRight className="h-4 w-4" /></Link></div></div>)}</div></div>
    <div className="flex justify-center gap-1 py-2">{items.map((item, i) => <Button key={item.id} variant="ghost" size="icon" className="h-7 w-7" aria-label={`Show ${item.name}`} aria-pressed={selected === i} onClick={() => { setPaused(true); api?.scrollTo(i); }}><span className={`h-2 w-2 rounded-full ${selected === i ? "bg-primary" : "bg-muted-foreground/30"}`} /></Button>)}</div>
  </section>;
}