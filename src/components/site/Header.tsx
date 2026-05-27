import { Link, useRouter } from "@tanstack/react-router";
import { Menu, ShoppingBasket, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useBasket } from "@/lib/basket";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/salads", label: "Salads" },
  { to: "/meals", label: "Healthy Meals" },
  { to: "/juices", label: "Juices" },
  { to: "/gallery", label: "Gallery" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { count, minMet } = useBasket();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const badgeReady = count > 0 && minMet;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card ring-1 ring-border shadow-card">
            <img src={logo} alt="Fine Time for Cathy's Clean Green Classics" className="h-10 w-10 object-contain" />
          </div>
          <div className="leading-none">
            <div className="font-script text-2xl text-leaf-deep lg:text-3xl">
              Fine Time for Cathy's Clean Green Classics
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/80 transition hover:text-leaf-deep"
              activeProps={{ className: "text-leaf-deep font-semibold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-leaf-deep/40 bg-cream text-leaf-deep transition hover:border-leaf-deep"
                aria-label="Account menu"
              >
                <User className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {email ? (
                <>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/account">My account</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild><Link to="/auth" search={{ mode: "signin" }}>Sign in</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/auth" search={{ mode: "signup" }}>Create account</Link></DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/basket"
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-leaf-deep/40 bg-cream px-4 text-sm font-semibold text-leaf-deep transition hover:border-leaf-deep"
          >
            <ShoppingBasket className="h-4 w-4" />
            <span className="hidden sm:inline">Basket</span>
            {count > 0 && (
              <span
                className={`absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white transition ${
                  badgeReady ? "bg-coral" : "bg-muted-foreground"
                }`}
                title={badgeReady ? "Ready for checkout" : "Minimum not yet met"}
              >
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border xl:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-cream xl:hidden">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                activeProps={{ className: "bg-secondary text-leaf-deep font-semibold" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
