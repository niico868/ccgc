import { Link, useRouter } from "@tanstack/react-router";
import { Menu, ShoppingBasket, X, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FOOD_MIN } from "@/lib/menu-data";
import { useBasket } from "@/lib/basket";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoAsset from "@/assets/ccgc-nav-logo.png.asset.json";

const NAV = [
  { to: "/salads", label: "Salads" },
  { to: "/meals", label: "Healthy Meals" },
  { to: "/juices", label: "Juices" },
  { to: "/gallery", label: "Gallery" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count, foodCount } = useBasket();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const badgeReady = count >= FOOD_MIN;
  const prevFoodRef = useRef(foodCount);

  useEffect(() => {
    if (prevFoodRef.current < FOOD_MIN && foodCount >= FOOD_MIN) {
      toast.success("Basket ready, minimum reached!", {
        icon: <ShoppingBasket className="h-4 w-4" />,
        position: "bottom-right",
      });
    }
    prevFoodRef.current = foodCount;
  }, [foodCount]);

  useEffect(() => {
    const sync = async (uid?: string | null) => {
      if (!uid) { setIsAdmin(false); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin");
      setIsAdmin((data ?? []).length > 0);
    };
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
      sync(data.session?.user.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setEmail(s?.user.email ?? null);
      sync(s?.user.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/78 backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <div className="relative flex items-center justify-center rounded-[28px] bg-[radial-gradient(circle_at_center,rgba(246,233,107,0.55)_0%,rgba(183,232,91,0.2)_45%,transparent_75%)] px-1 py-0.5">
            <img src={logoAsset.url} alt="Fine Time for Cathy's Clean Green Classics" className="h-16 w-auto object-contain sm:h-18 lg:h-20" />
          </div>
          <div className="hidden min-w-0 leading-none sm:block">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf-deep/85">REAL FOOD. READY WHEN YOU ARE.</div>
            <div className="mt-1 text-xs text-foreground/65">Diabetic friendly juices* prepared fresh in Trinidad &amp; Tobago</div>
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-leaf-deep/25 bg-white/70 text-leaf-deep transition hover:border-leaf-deep"
                aria-label="Account menu"
              >
                <User className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {email ? (
                <>
                  <div className="truncate px-2 py-1.5 text-xs text-muted-foreground">{email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/account">My account</Link></DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem asChild><Link to="/admin">Admin · Reviews</Link></DropdownMenuItem>}
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
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-leaf-deep/25 bg-white/70 px-4 text-sm font-semibold text-leaf-deep transition hover:border-leaf-deep"
          >
            <ShoppingBasket className="h-4 w-4" />
            <span className="hidden sm:inline">Basket</span>
            {count > 0 && (
              <span
                className={`absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white shadow-md transition ${
                  badgeReady ? "bg-[#1a9850]" : "bg-[#d73027]"
                }`}
                title={badgeReady ? "Ready for checkout" : `Add ${FOOD_MIN - count} more to reach the minimum`}
              >
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/60 xl:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-white/92 xl:hidden">
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
