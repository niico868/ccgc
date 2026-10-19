import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";
import logoAsset from "@/assets/ccgc-nav-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-leaf-deep text-cream">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,217,72,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(246,233,107,0.16),transparent_30%)]" />
      <img
        src={logoAsset.url}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-10 top-0 h-72 w-auto opacity-[0.07]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-3 lg:px-8">
        <div>
          <div className="space-y-1 text-2xl leading-tight text-white">
            <div>Fine Time for</div>
            <div>Cathy's Clean Green Classics</div>
            <div>fresh homemade food from</div>
            <div>Trinidad &amp; Tobago.</div>
          </div>
        </div>
        <div>
          <div className="text-display text-base text-white">Order</div>
          <ul className="mt-3 space-y-1.5 text-sm text-cream/80">
            <li><Link to="/salads" className="hover:text-white">Custom Salads</Link></li>
            <li><Link to="/meals" className="hover:text-white">Healthy Meals</Link></li>
            <li><Link to="/juices" className="hover:text-white">Cold-Pressed Juices</Link></li>
            <li><Link to="/account" className="hover:text-white">My Account</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-display text-base text-white">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-citrus" /><span>+1 868-488-4248</span></li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-citrus" /><span>@finelivingbycathy</span></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-citrus" /><span>dfinetimerestaurant@gmail.com</span></li>
          </ul>
          <ul className="mt-4 space-y-1 text-xs text-cream/70">
            <li><span className="font-semibold text-white">Pickup:</span> Trincity 2–5 PM · St. Clair 11 AM–1 PM</li>
            <li><span className="font-semibold text-white">Delivery:</span> 11 AM – about 2 PM, east west corridor</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-4 text-center text-xs text-cream/70">
        © {new Date().getFullYear()} Fine Time for Cathy's Clean Green Classics.
      </div>
    </footer>
  );
}
