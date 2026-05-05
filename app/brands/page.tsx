import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Package, Shield } from "lucide-react"
import { getBrands, getCategories, getProducts } from "@/lib/api"
import { ProductGrid } from "@/components/store/product-grid"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import type { Brand, Category } from "@/lib/types"

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>
}): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : {}
  const rawBrand = resolved?.brand
  const brandId = Array.isArray(rawBrand) ? rawBrand[0] ?? "" : rawBrand ?? ""

  if (!brandId) {
    return {
      title: "Marcas",
      description: "Explorá todas las marcas de videovigilancia disponibles en Somme Technology.",
      alternates: { canonical: "/brands" },
      openGraph: { title: "Marcas | Somme Technology", url: "/brands", type: "website" },
    }
  }

  const brandsCatalog = await getBrands()
  const brands = brandsCatalog.ok ? brandsCatalog.brands : []
  const brand = brands.find((b: Brand) => b.id === brandId) ?? null

  if (!brand) {
    return { title: "Marca no encontrada" }
  }

  return {
    title: brand.name,
    description: `Todos los productos de ${brand.name} disponibles en Somme Technology. Cámaras, grabadores y accesorios.`,
    alternates: { canonical: `/brands?brand=${brandId}` },
    openGraph: {
      title: `${brand.name} | Somme Technology`,
      description: `Productos de ${brand.name} en Somme Technology.`,
      url: `/brands?brand=${brandId}`,
      type: "website",
      ...(brand.logo ? { images: [{ url: brand.logo, alt: brand.name }] } : {}),
    },
  }
}

export default async function BrandsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const rawBrand = resolvedSearchParams?.brand
  const brandId = Array.isArray(rawBrand) ? rawBrand[0] ?? "" : rawBrand ?? ""
  const normalizedBrandId = brandId.trim()

  const [brandsCatalog, productsCatalog, categoryCatalog] = await Promise.all([
    getBrands(),
    getProducts({ brandId: normalizedBrandId || undefined }),
    getCategories(),
  ])

  const brands = brandsCatalog.ok ? brandsCatalog.brands : []
  const products = productsCatalog.ok ? productsCatalog.products : []
  const categories = categoryCatalog.ok ? categoryCatalog.categories : []

  const selectedBrand = normalizedBrandId
    ? brands.find((b: Brand) => b.id === normalizedBrandId) ?? null
    : null

  // Count products per brand from all products (only when no brand selected)
  const brandsWithLogos = brands.filter((b: Brand) => b.logo)
  const brandsWithoutLogos = brands.filter((b: Brand) => !b.logo)

  return (
    <div className="store-surface min-h-screen bg-background text-foreground">
      <StoreHeader currentSearch="" categories={categories} brands={brands} />

      <main className="pb-14">
        <section className="container mx-auto px-4 pt-8">

          {/* Header */}
          <div className="mb-8">
            {selectedBrand ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {selectedBrand.logo && (
                    <div className="relative h-14 w-32 overflow-hidden rounded-2xl border border-border/60 bg-white dark:bg-transparent dark:border-transparent p-1.5">
                      <Image
                        src={selectedBrand.logo}
                        alt={selectedBrand.name}
                        fill
                        className="object-contain"
                        unoptimized
                        style={{ borderRadius: '0.625rem' }}
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                      Marca
                    </p>
                    <h1 className="text-3xl font-black text-foreground lg:text-4xl">
                      {selectedBrand.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {products.length} producto{products.length !== 1 ? "s" : ""} disponibles
                    </p>
                  </div>
                </div>
                <Link
                  href="/brands"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Todas las marcas
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                  Catálogo
                </p>
                <h1 className="mt-1.5 text-3xl font-black text-foreground lg:text-4xl">
                  Marcas disponibles
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {brands.length} marca{brands.length !== 1 ? "s" : ""} en nuestro catálogo
                </p>
              </div>
            )}
          </div>

          {/* Brand grid — shown when no brand selected */}
          {!selectedBrand && (
            <div className="space-y-8">
              {/* Brands with logos */}
              {brandsWithLogos.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {brandsWithLogos.map((brand: Brand) => (
                    <Link
                      key={brand.id}
                      href={`/brands?brand=${brand.id}`}
                      className="group relative overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:bg-transparent dark:border-transparent"
                    >
                      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-white dark:bg-transparent p-2">
                        <Image
                          src={brand.logo!}
                          alt={brand.name}
                          fill
                          className="object-contain transition duration-500 group-hover:scale-105"
                          unoptimized
                          style={{ borderRadius: '0.875rem' }}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Brands without logos */}
              {brandsWithoutLogos.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Otras marcas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {brandsWithoutLogos.map((brand: Brand) => (
                      <Link
                        key={brand.id}
                        href={`/brands?brand=${brand.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                      >
                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {brands.length === 0 && (
                <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
                  No hay marcas disponibles
                </div>
              )}
            </div>
          )}

          {/* Products grid — shown when brand selected */}
          {selectedBrand && (
            <div className="mt-2">
              {products.length > 0 ? (
                <ProductGrid products={products} />
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 text-center">
                  <Package className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm font-semibold text-muted-foreground">
                    No hay productos disponibles de {selectedBrand.name}
                  </p>
                  <Link
                    href="/brands"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Ver otras marcas
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <StoreFooter />
    </div>
  )
}
