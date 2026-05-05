import type { MetadataRoute } from "next"
import { getProducts, getCategories, getBrands } from "@/lib/api"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sommetechnology.com"

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
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/catalog?category=${encodeURIComponent(category.id)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${SITE_URL}/brands?brand=${encodeURIComponent(brand.id)}`,
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
