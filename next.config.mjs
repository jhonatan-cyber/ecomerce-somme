/** @type {import('next').NextConfig} */
const useOptimizedImages = process.env.NEXT_PUBLIC_UPLOADS_URL?.trim().length > 0

let nextConfig = {
  images: {
    unoptimized: !useOptimizedImages,
    remotePatterns: [
      { protocol: "http", hostname: "**" },
      { protocol: "https", hostname: "**" },
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
