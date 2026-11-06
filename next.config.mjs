import { networkInterfaces } from "os"

const localDevOrigins = Object.values(networkInterfaces())
  .flat()
  .filter((network) => network && network.family === "IPv4" && !network.internal)
  .map((network) => network.address)

/** @type {import('next').NextConfig} */
// Activa el Image Optimization de Next.js (recorte/redimensionado + AVIF/WebP).
// Requiere `sharp` instalado (dependencia nativa, ya presente en el lockfile).
const useOptimizedImages = true

let nextConfig = {
  allowedDevOrigins: localDevOrigins,
  poweredByHeader: false,
  // Baseline de seguridad: clickjacking, MIME-sniffing, referrer y permisos.
  // CSP completa con nonces se gestiona en middleware si se añade Pusher/Analytics inline.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ]
  },
  images: {
    unoptimized: !useOptimizedImages,
    // Solo se permiten orígenes del deployment (evita abrir el optimizador a
    // cualquier host como el `**` anterior).
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "**.sommetechnology.com" },
      { protocol: "https", hostname: "sommetechnology.com" },
      { protocol: "https", hostname: "**.sommetechnology.com" },
    ],
    formats: useOptimizedImages ? ["image/avif", "image/webp"] : undefined,
  },
}

const isProduction = process.env.NODE_ENV === "production"

if (isProduction) {
  const { default: withPWAInit } = await import("@ducanh2912/next-pwa")
  const withPWA = withPWAInit({
    dest: "public",
    register: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        // Precios/stock siempre frescos: nunca cachear el Service Worker.
        urlPattern: /\/api\/store\/products(\?.*)?$/,
        handler: "NetworkOnly",
      },
      {
        // Contenido semi-estático (categorías, marcas, banners): 12h.
        urlPattern: /\/api\/store\/(categories|brands|slides|ads)/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "store-api-cache",
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 12 },
        },
      },
      {
        // Sucursales/stock por sucursal: NetworkFirst con fallback 1h
        // (StaleWhileRevalidate podía servir stock/precio viejo hasta 24h).
        urlPattern: /\/api\/store\/branches/,
        handler: "NetworkFirst",
        options: {
          cacheName: "store-stock-cache",
          networkTimeoutSeconds: 3,
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
        },
      },
      {
        // Respuestas del optimizador de imágenes (sin extensión en la URL).
        urlPattern: /\/_next\/image\?.*$/,
        handler: "CacheFirst",
        options: {
          cacheName: "next-image-cache",
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        urlPattern: /\.(png|jpg|jpeg|webp|svg)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache",
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
    ],
  })

  nextConfig = withPWA(nextConfig)
}

export default nextConfig
