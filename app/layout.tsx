import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { WhatsAppWidget } from "@/components/store/whatsapp-widget"
import { TourProvider, TourComponent } from "@/components/tour"
import "../styles/globals.css"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sommetechnology.com"
const SITE_NAME = "Somme Technology"
const SITE_DESCRIPTION =
  "Cámaras IP, kits de seguridad, grabadores NVR, video porteros y accesorios. Asesoramiento técnico especializado y envíos a todo el país."

// Organization JSON-LD for local SEO
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.webp`,
  description: SITE_DESCRIPTION,
  areaServed: {
    "@type": "Country",
    name: "Argentina",
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
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TourProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            <TourComponent />
            <Toaster />
            <WhatsAppWidget />
            <Analytics />
          </TourProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
