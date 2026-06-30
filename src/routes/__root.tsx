import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { BasketProvider } from "@/lib/basket";
import { SiteLayout } from "@/components/site/SiteLayout";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-display text-7xl font-bold text-leaf">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-leaf px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-display text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
        <button onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-leaf px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Fine Time for Cathy's Clean Green Classics" },
      { name: "description", content: "Fresh custom salads, healthy meals, and cold-pressed juices. Made fresh in Trinidad and Tobago." },
      { property: "og:title", content: "Fine Time for Cathy's Clean Green Classics" },
      { property: "og:description", content: "Fresh custom salads, healthy meals, and cold-pressed juices. Made fresh in Trinidad and Tobago." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Fine Time for Cathy's Clean Green Classics" },
      { name: "twitter:description", content: "Fresh custom salads, healthy meals, and cold-pressed juices. Made fresh in Trinidad and Tobago." },
      { property: "og:site_name", content: "Fine Time for Cathy's Clean Green Classics" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Great+Vibes&family=Comic+Neue:wght@400;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Fine Time for Cathy's Clean Green Classics",
          description: "Fresh custom salads, healthy meals, and cold-pressed juices. Made fresh in Trinidad and Tobago.",
          url: "https://ccgc.lovable.app",
          telephone: "+1-868-488-4248",
          email: "dfinetimerestaurant@gmail.com",
          sameAs: ["https://www.instagram.com/finelivingbycathy"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <BasketProvider>
        <SiteLayout>
          <Outlet />
        </SiteLayout>
      </BasketProvider>
    </QueryClientProvider>
  );
}
