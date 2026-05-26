import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TourProvider, TourComponent } from "@/components/tour"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PusherProvider } from "@/components/pusher-provider"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import "../styles/globals.css"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuwesomme.cloud"
const IS_PRODUCTION = process.env.NODE_ENV === "production"
const SITE_NAME = "Somme Technology"
const SITE_DESCRIPTION =
  "Cámaras IP, kits de seguridad, grabadores NVR, video porteros y accesorios. Asesoramiento técnico especializado y envíos a todo el país."

// Organization JSON-LD for local SEO
// WebSite JSON-LD for Google Sitelinks Search Box
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/catalog?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.webp`,
  description: SITE_DESCRIPTION,
  areaServed: {
    "@type": "Country",
    name: "Bolivia",
  },
  serviceType: "Tienda online de videovigilancia",
  sameAs: [
    "https://www.instagram.com/sommetechnology",
    "https://www.facebook.com/sommetechnology",
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "cámaras de seguridad",
    "videovigilancia",
    "cámaras IP",
    "grabadores NVR",
    "DVR",
    "kits de seguridad",
    "video porteros",
    "CCTV",
    "seguridad electrónica",
    "Somme Technology",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
    shortcut: "/logo.webp",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    type: "website",
    locale: "es_BO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                const isProd = ${JSON.stringify(IS_PRODUCTION)};
                if (!isProd) {
                  navigator.serviceWorker.getRegistrations().then((registrations) => {
                    registrations.forEach((registration) => registration.unregister());
                  }).catch(() => {});
                } else if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').catch(() => {});
                  });
                }
              }
            `,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TourProvider>
            <Suspense fallback={
  <div className="flex min-h-screen items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
}>{children}</Suspense>
            <TourComponent />
            <PusherProvider />
            <Toaster />
            <InstallPrompt />
            <Analytics />
          </TourProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
