import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { StorefrontProvider } from "@/components/storefront";
import { Shell } from "@/components/layout/shell";
import appCss from "../styles.css?url";

const APP_NAME = "Sitara — Fine Jewellery";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Sitara is a Lahore house of hallmarked 22k gold, kundan, and the quiet pieces Pakistani women actually live in. Cash on delivery. Complimentary shipping over Rs 5,000.",
      },
      { name: "theme-color", content: "#1B4332" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Noto+Naskh+Arabic:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <StorefrontProvider>
            <Shell>
              <Outlet />
            </Shell>
          </StorefrontProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
