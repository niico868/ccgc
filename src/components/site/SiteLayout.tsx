import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PromoPopup } from "./PromoPopup";
import { ThemePlayer } from "./ThemePlayer";
import { SignupCtaBand } from "./SignupCtaBand";
import { ChatWidget } from "./ChatWidget";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [signedIn, setSignedIn] = useState(false);
  const hideFooter = pathname === "/contact";
  const hideChat = pathname.startsWith("/admin");
  const hideSignupBand = pathname === "/auth" || pathname === "/account" || signedIn;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideSignupBand && <SignupCtaBand />}
      {!hideFooter && <Footer />}
      <PromoPopup />
      <ThemePlayer />
      {!hideChat && <ChatWidget />}
      <Toaster richColors position="top-center" />
    </div>
  );
}
