import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PromoPopup } from "./PromoPopup";
import { Toaster } from "@/components/ui/sonner";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <PromoPopup />
      <Toaster richColors position="top-center" />
    </div>
  );
}
