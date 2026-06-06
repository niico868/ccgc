import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PromoPopup } from "./PromoPopup";
import { ThemePlayer } from "./ThemePlayer";
import { SignupCtaBand } from "./SignupCtaBand";
import { Toaster } from "@/components/ui/sonner";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideFooter = pathname === "/contact";
  const hideSignupBand = pathname === "/auth" || pathname === "/account";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideSignupBand && <SignupCtaBand />}
      {!hideFooter && <Footer />}
      <PromoPopup />
      <ThemePlayer />
      <Toaster richColors position="top-center" />
    </div>
  );
}
