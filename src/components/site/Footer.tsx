import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 lg:px-8">
        <div>
          <div className="text-display text-sm font-extrabold uppercase tracking-wider text-leaf-deep">Order</div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li><Link to="/salads" className="hover:text-leaf">Custom Salads</Link></li>
            <li><Link to="/meals" className="hover:text-leaf">Healthy Meals</Link></li>
            <li><Link to="/juices" className="hover:text-leaf">Cold-Pressed Juices</Link></li>
            <li><Link to="/meal-prep" className="hover:text-leaf">Meal Prep Plans</Link></li>
            <li><Link to="/catering" className="hover:text-leaf">Catering</Link></li>
            <li className="pt-2 text-xs">Salads: Mon, Wed, Fri. Orders close 8 AM on salad days.</li>
          </ul>
        </div>
        <div>
          <div className="text-display text-sm font-extrabold uppercase tracking-wider text-leaf-deep">Pickup &amp; Delivery</div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li><span className="font-semibold text-foreground">St Clair:</span> 11 AM to 1 PM</li>
            <li><span className="font-semibold text-foreground">Trincity:</span> 2 PM to 6 PM</li>
            <li><span className="font-semibold text-foreground">Pickup 2:</span> Orange Grove, Tacarigua</li>
            <li>Limited delivery available.</li>
            <li>Salads stay fresh up to 5 days.</li>
            <li className="pt-1 text-xs">Seafood meals cost $5 more.</li>
          </ul>
        </div>
        <div>
          <div className="text-display text-sm font-extrabold uppercase tracking-wider text-leaf-deep">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-leaf" /><span>+1 868-488-4248</span></li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-leaf" /><span>@finelivingbycathy</span></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-leaf" /><span>dfinetimerestaurant@gmail.com</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Fine Time for Cathy's Clean Green Classics.
      </div>
    </footer>
  );
}
