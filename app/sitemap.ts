import type { MetadataRoute } from "next"
import { getProducts, getCategories, getBrands } from "@/lib/api"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuwesomme.cloud"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productsCatalog, categoryCatalog, brandsCatalog] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ])

  const products = productsCatalog.ok ? productsCatalog.products : []
  const categories = categoryCatalog.ok ? categoryCatalog.categories : []
  const brands = brandsCatalog.ok ? brandsCatalog.brands : []

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/brands`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/promotions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/new-arrivals`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/quote-generator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/category/${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, "-"))}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    ...(products.some((p) => p.category === category.name) ? { images: products.filter((p) => p.category === category.name && p.image_url).map((p) => p.image_url!).slice(0, 3) } : {}),
  }))

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${SITE_URL}/brands/${encodeURIComponent(brand.name.toLowerCase().replace(/\s+/g, "-"))}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/product/${encodeURIComponent(product.id)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
    ...(product.image_url
      ? {
          images: [product.image_url],
        }
      : {}),
  }))

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes]
}
