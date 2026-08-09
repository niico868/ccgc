import { useEffect, useMemo, useState } from "react";

const COLORS = ["#2F7D32", "#A9D95A", "#F6E96B", "#E9C46A", "#FFFFFF"];

/**
 * Subtle, one shot confetti burst. Purely decorative, respects reduced motion,
 * and removes itself from the DOM once the animation finishes.
 */
export function Confetti({ pieces = 40, duration = 4200 }: { pieces?: number; duration?: number }) {
  const [done, setDone] = useState(false);

  const reduced = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        fall: 2.6 + Math.random() * 1.8,
        size: 5 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        round: Math.random() > 0.6,
      })),
    [pieces],
  );

  useEffect(() => {
    const t = setTimeout(() => setDone(true), duration);
    return () => clearTimeout(t);
  }, [duration]);

  if (done || reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      <style>{`
        @keyframes ccgc-confetti-fall {
          0%   { transform: translate3d(0, -12vh, 0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.9; }
          100% { transform: translate3d(var(--drift), 104vh, 0) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {bits.map((b) => (
        <span
          key={b.id}
          style={{
            position: "absolute",
            top: 0,
            left: `${b.left}%`,
            width: b.size,
            height: b.size * (b.round ? 1 : 1.8),
            background: b.color,
            borderRadius: b.round ? "50%" : 2,
            opacity: 0,
            transform: `rotate(${b.rotate}deg)`,
            ["--drift" as string]: `${(Math.random() - 0.5) * 120}px`,
            animation: `ccgc-confetti-fall ${b.fall}s cubic-bezier(0.25,0.6,0.4,1) ${b.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
