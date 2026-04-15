import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getBrands, getCategories, getProducts } from "@/lib/api"
import { Breadcrumbs } from "@/components/store/home/breadcrumbs"
import { CatalogStatusPage } from "@/components/store/home/catalog-status-page"
import { CategorySidebar } from "@/components/store/home/category-sidebar"
import { BrandSidebarFilter } from "@/components/store/home/brand-sidebar-filter"
import { ProductGrid } from "@/components/store/product-grid"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import type { Brand, Category, Product } from "@/lib/types"

function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<string, Category>()
  const rootCategories: Category[] = []

  // First pass: create map
  for (const category of categories) {
    categoryMap.set(category.id, { ...category, children: [] })
  }

  // Second pass: build tree
  for (const category of categories) {
    const cat = categoryMap.get(category.id)!
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(cat)
      } else {
        rootCategories.push(cat)
      }
    } else {
      rootCategories.push(cat)
    }
  }

  return rootCategories
}

function buildFallbackCategories(products: Product[]): Category[] {
  const names = Array.from(
    new Set(
      products
        .map((product) => product.category?.trim())
        .filter((category): category is string => Boolean(category)),
    ),
  )

  if (names.length > 0) {
    return names.map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      icon: null,
      description: null,
      active: true,
      parentId: null,
    }))
  }

  return []
}

function buildFallbackCategories(products: Product[]): Category[] {
  const names = Array.from(
    new Set(
      products
        .map((product) => product.category?.trim())
        .filter((category): category is string => Boolean(category)),
    ),
  )

  if (names.length > 0) {
    return names.map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      icon: null,
      description: null,
      active: true,
    }))
  }

  return []
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const rawSearch = resolvedSearchParams?.search
  const rawCategory = resolvedSearchParams?.category
  const rawBrand = resolvedSearchParams?.brand
  const search = Array.isArray(rawSearch) ? rawSearch[0] ?? "" : rawSearch ?? ""
  const categoryId = Array.isArray(rawCategory) ? rawCategory[0] ?? "" : rawCategory ?? ""
  const brandId = Array.isArray(rawBrand) ? rawBrand[0] ?? "" : rawBrand ?? ""
  const normalizedSearch = search.trim()
  const normalizedCategoryId = categoryId.trim()
  const normalizedBrandId = brandId.trim()

  const [catalog, categoryCatalog, brandsCatalog] = await Promise.all([
    getProducts({ search: normalizedSearch, categoryId: normalizedCategoryId, brandId: normalizedBrandId }),
    getCategories(),
    getBrands(),
  ])

  const brands = brandsCatalog.ok ? brandsCatalog.brands : []

  if (!catalog.ok) {
    return (
      <CatalogStatusPage
        badge="Catalog sync failed"
        title="No pudimos cargar el catalogo publico"
        message={catalog.error ?? "La API del dashboard no respondio con un catalogo valido."}
        actionLabel="Reintentar"
      />
    )
  }

  const products = catalog.products
  const rawCategories = categoryCatalog.ok ? categoryCatalog.categories : []
  const fallbackCategories = buildFallbackCategories(products)
  const categories = rawCategories.length > 0 ? buildCategoryTree(rawCategories) : buildFallbackCategories(products)
  const selectedCategory = normalizedCategoryId
    ? categories.find((category) => category.id === normalizedCategoryId) ?? null
    : null
  const selectedBrand = normalizedBrandId
    ? brands.find((brand) => brand.id === normalizedBrandId) ?? null
    : null

  const hasFilters = normalizedSearch || selectedCategory || selectedBrand

  // Build breadcrumbs
  const breadcrumbs = [
    { label: "Catálogo", href: "/catalog" },
    ...(selectedCategory ? [{ label: selectedCategory.name } : []),
    ...(selectedBrand ? [{ label: "Marca: " + selectedBrand.name }] : []),
  ]

  return (
    <div className="store-surface min-h-screen bg-background text-foreground">
      <StoreHeader currentSearch={normalizedSearch} categories={categories} brands={brands} />

      <main className="pb-14">
        <section className="container mx-auto px-4 pt-6">
          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
            <CategorySidebar
              categories={categories}
              selectedCategoryId={selectedCategory?.id ?? null}
            />
            {/* Brand filter as separate sidebar section */}
            {brands.length > 0 && (
              <div className="hidden xl:block">
                <BrandSidebarFilter brands={brands} />
              </div>
            )}

            <div className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm">
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <div className="mb-4">
                  <Breadcrumbs items={breadcrumbs} />
                </div>
              )}

              <div className="flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                    Catalogo completo
                  </p>
                  <h1 className="mt-2 text-3xl font-black text-foreground lg:text-4xl">
                    {selectedBrand ? selectedBrand.name : "Todos los productos disponibles"}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedCategory && selectedBrand
                      ? `${products.length} producto${products.length === 1 ? "" : "s"} de ${selectedBrand.name} en ${selectedCategory.name}.`
                      : selectedCategory
                      ? `${products.length} producto${products.length === 1 ? "" : "s"} dentro de ${selectedCategory.name}.`
                      : selectedBrand
                      ? `${products.length} producto${products.length === 1 ? "" : "s"} de ${selectedBrand.name}.`
                      : `${products.length} producto${products.length === 1 ? "" : "s"} visibles en el catalogo.`}
                  </p>
                </div>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  Limpiar filtros
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {hasFilters ? (
                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-slate-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-50">
                  {normalizedSearch ? (
                    <>
                      <span className="font-semibold text-foreground">Buscando:</span>
                      <span className="rounded-full bg-background px-3 py-1 font-semibold text-primary">
                        {normalizedSearch}
                      </span>
                    </>
                  ) : null}
                  {selectedCategory ? (
                    <>
                      <span className="font-semibold text-foreground">Categoria:</span>
                      <span className="rounded-full bg-background px-3 py-1 font-semibold text-primary">
                        {selectedCategory.name}
                      </span>
                    </>
                  ) : null}
                  {selectedBrand ? (
                    <>
                      <span className="font-semibold text-foreground">Marca:</span>
                      <span className="rounded-full bg-background px-3 py-1 font-semibold text-primary">
                        {selectedBrand.name}
                      </span>
                    </>
                  ) : null}
                  <Link href="/catalog" className="ml-auto text-sm font-semibold text-primary">
                    Limpiar filtros
                  </Link>
                </div>
              ) : null}

              {products.length > 0 ? (
                <div className="mt-6">
                  <ProductGrid products={products} />
                </div>
              ) : (
                <div className="mt-6 flex min-h-[280px] items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-muted/30 text-center text-sm text-muted-foreground">
                  No encontramos productos con esos filtros.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <StoreFooter categories={categories} />
    </div>
  )
}
