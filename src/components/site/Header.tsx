import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBasket, X } from "lucide-react";
import { useState } from "react";
import { useBasket } from "@/lib/basket";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/salads", label: "Salads" },
  { to: "/meals", label: "Healthy Meals" },
  { to: "/juices", label: "Juices" },
  { to: "/meal-prep", label: "Meal Prep" },
  { to: "/catering", label: "Catering" },
  { to: "/gallery", label: "Gallery" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { count } = useBasket();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white ring-1 ring-border shadow-card">
            <img src={logo} alt="Fine Time for Cathy's Clean Green Classics" className="h-12 w-12 object-contain" />
          </div>
          <div className="leading-[1.1]">
            <div className="text-display text-[13px] font-extrabold uppercase tracking-wide text-leaf-deep">Fine Time for</div>
            <div className="text-display text-[13px] font-extrabold uppercase tracking-wide text-leaf">Cathy's Clean Green Classics</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to}
              className="text-sm font-semibold text-foreground/80 transition hover:text-leaf"
              activeProps={{ className: "text-leaf" }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/basket"
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold hover:border-leaf hover:text-leaf">
            <ShoppingBasket className="h-4 w-4" />
            <span className="hidden sm:inline">Basket</span>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-tomato px-1.5 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
            aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-secondary"
                activeProps={{ className: "bg-secondary text-leaf" }}>
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
