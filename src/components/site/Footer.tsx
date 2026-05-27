import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-border bg-cream">
      <img
        src={logo}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-[0.06]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-3 lg:px-8">
        <div>
          <div className="font-script text-3xl leading-tight text-leaf-deep">Fine Time for Cathy's</div>
          <p className="mt-2 max-w-xs font-script text-xl leading-snug text-leaf-deep/85">
            Clean Green Classics — fresh homemade food from Trinidad &amp; Tobago.
          </p>
        </div>
        <div>
          <div className="text-display text-base text-leaf-deep">Order</div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li><Link to="/salads" className="hover:text-leaf-deep">Custom Salads</Link></li>
            <li><Link to="/meals" className="hover:text-leaf-deep">Healthy Meals</Link></li>
            <li><Link to="/juices" className="hover:text-leaf-deep">Cold-Pressed Juices</Link></li>
            <li><Link to="/account" className="hover:text-leaf-deep">My Account</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-display text-base text-leaf-deep">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-leaf-soft" /><span>+1 868-488-4248</span></li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-leaf-soft" /><span>@finelivingbycathy</span></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-leaf-soft" /><span>dfinetimerestaurant@gmail.com</span></li>
          </ul>
          <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
            <li><span className="font-semibold text-leaf-deep">St Clair:</span> 11 AM – 1 PM</li>
            <li><span className="font-semibold text-leaf-deep">Orange Grove, Tacarigua:</span> 2 PM – 6 PM</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-border/70 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Fine Time for Cathy's Clean Green Classics.
      </div>
    </footer>
  );
}
