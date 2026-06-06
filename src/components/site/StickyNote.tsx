import type { ReactNode } from "react";

type StickyNoteProps = {
  children: ReactNode;
  className?: string;
};

export function StickyNote({ children, className = "" }: StickyNoteProps) {
  return (
    <div
      className={`relative isolate w-full max-w-[18rem] rotate-[-2deg] rounded-[6px] border border-leaf-deep/20 bg-[linear-gradient(180deg,rgba(183,232,91,0.98)_0%,rgba(167,217,72,0.98)_100%)] p-4 shadow-[0_18px_28px_rgba(31,90,53,0.18)] ${className}`}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 96%, 97% 100%, 0 100%)" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-2 h-5 w-16 -translate-x-1/2 rotate-[-2deg] rounded-sm bg-white/45 shadow-sm" />
      <div className="relative pt-4 font-['Comic_Neue',_'Trebuchet_MS',_ui-sans-serif,_system-ui,_sans-serif] text-[15px] leading-relaxed text-black">
        {children}
      </div>
    </div>
  );
}
