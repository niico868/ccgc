import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Phone, Mail } from "lucide-react";
import { waLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="text-display text-2xl font-bold text-leaf">Fine Time for Cathy's</div>
          <p className="mt-2 text-sm text-muted-foreground">Clean. Green. Classics. Fresh meals delivered across the east-west corridor.</p>
          <a href={waLink("Hi! I'd like to place an order from your website.")} target="_blank" rel="noreferrer"
             className="mt-5 inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <MessageCircle className="h-4 w-4" /> Message Us on WhatsApp
          </a>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Order</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/salads" className="hover:text-leaf">Salads</Link></li>
            <li><Link to="/meals" className="hover:text-leaf">Healthy Meals</Link></li>
            <li><Link to="/juices" className="hover:text-leaf">Cold-Pressed Juices</Link></li>
            <li><Link to="/meal-prep" className="hover:text-leaf">Meal Prep Plans</Link></li>
            <li><Link to="/catering" className="hover:text-leaf">Catering</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Pickup & Delivery</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Orders close at <span className="font-medium text-foreground">9:00 AM</span> daily.</li>
            <li>Delivery starts at <span className="font-medium text-foreground">2:00 PM</span>. Fee $40.</li>
            <li>Pickup 1: Sinclair, POS — 9 AM–12 PM.</li>
            <li>Pickup 2: Lopinot — 2 PM–5 PM.</li>
            <li>Seafood meals cost $5 more.</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-leaf" /> +1 868-488-4248</li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-leaf" /> @finelivingbycathy</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-leaf" /> hello@finetimeforcathys.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Fine Time for Cathy's Clean Green Classics. All rights reserved.
      </div>
    </footer>
  );
}
