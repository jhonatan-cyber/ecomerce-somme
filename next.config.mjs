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
  images: {
    unoptimized: !useOptimizedImages,
    // Solo se permiten orígenes del deployment (evita abrir el optimizador a
    // cualquier host como el `**` anterior).
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "**.nuwesomme.cloud" },
      { protocol: "https", hostname: "nuwesomme.cloud" },
      { protocol: "https", hostname: "**.nuwesomme.cloud" },
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
        urlPattern: /\/api\/store\/products(\?.*)?$/,
        handler: "NetworkOnly",
      },
      {
        urlPattern: /\/api\/store\/(categories|brands|slides|ads|branches)/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "store-api-cache",
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
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
