import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

export function PhotoCarousel({ images, name }: { images: string[]; name: string }) {
  const [ref, api] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const update = useCallback(() => setSelected(api?.selectedScrollSnap() ?? 0), [api]);
  useEffect(() => { if (!api) return; update(); api.on("select", update); return () => { api.off("select", update); }; }, [api, update]);
  return <div className="relative h-full">
    <div ref={ref} className="h-full overflow-hidden"><div className="flex h-full">{images.map((src, i) => <img key={src} src={src} alt={`${name}${i ? " Mediterranean salad side" : " main photo"}`} loading="lazy" className="h-full min-w-0 flex-[0_0_100%] object-cover" />)}</div></div>
    <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">{images.map((src, i) => <Button key={src} variant="secondary" size="icon" aria-label={`Show photo ${i + 1} of ${name}`} aria-pressed={selected === i} onClick={() => api?.scrollTo(i)} className="h-7 w-7 rounded-full"><span className={`h-2 w-2 rounded-full ${selected === i ? "bg-primary" : "bg-muted-foreground/40"}`} /></Button>)}</div>
  </div>;
}