import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, Shield } from "lucide-react"
import { getBrands, getCategories, getProducts } from "@/lib/api"
import { CatalogStatusPage } from "@/components/store/home/catalog-status-page"
import { ProductGrid } from "@/components/store/product-grid"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import type { Brand, Category, Product } from "@/lib/types"

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
  
  const rawCategories = categoryCatalog.ok ? categoryCatalog.categories : []
  const fallbackCategories: Category[] = []
  const categories = rawCategories.length > 0 ? rawCategories : fallbackCategories

  const selectedBrand = normalizedBrandId
    ? brands.find((b) => b.id === normalizedBrandId) ?? null
    : null

  return (
    <div className="store-surface min-h-screen bg-background text-foreground">
      <StoreHeader currentSearch="" categories={categories} brands={brands} />

      <main className="pb-14">
        <section className="container mx-auto px-4 pt-6">
          {/* Brands Grid */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-foreground lg:text-4xl">
              Marcas
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Selecciona una marca para ver sus productos
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands?brand=${brand.id}`}
                className={`group flex flex-col items-center justify-center rounded-2xl border p-4 transition ${
                  selectedBrand?.id === brand.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                {brand.logo ? (
                  <div className="relative h-16 w-full max-w-[120px]">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Shield className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <span className="mt-2 text-center text-sm font-medium">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Products from selected brand */}
          {selectedBrand && products.length > 0 && (
            <>
              <div className="mt-12 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                    Productos
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-foreground">
                    {selectedBrand.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {products.length} producto{products.length === 1 ? "" : "s"} disponibles
                  </p>
                </div>
                <Link
                  href="/brands"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  Ver todas las marcas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <ProductGrid products={products} />
            </>
          )}

          {selectedBrand && products.length === 0 && (
            <div className="mt-12 flex min-h-[200px] items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-muted/30 text-center text-sm text-muted-foreground">
              No hay productos disponibles de {selectedBrand.name}
            </div>
          )}
        </section>
      </main>

      <StoreFooter categories={categories} />
    </div>
  )
}