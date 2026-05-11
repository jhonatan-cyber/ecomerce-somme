import Link from "next/link"
import { getBrands, getCategories, getProducts } from "@/lib/api"
import { ActiveFilters } from "@/components/store/home/active-filters"
import { Breadcrumbs } from "@/components/store/home/breadcrumbs"
import { CatalogStatusPage } from "@/components/store/home/catalog-status-page"
import { CategorySidebar } from "@/components/store/home/category-sidebar"
import { CatalogGrid } from "@/components/store/catalog-grid"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import { AutoTour } from "@/components/tour"
import type { Brand, Category, Product } from "@/lib/types"

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

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const rawSearch = resolvedSearchParams?.search
  const rawCategory = resolvedSearchParams?.category
  const rawSubcategory = resolvedSearchParams?.subcategory
  const rawBrand = resolvedSearchParams?.brand
  const search = Array.isArray(rawSearch) ? rawSearch[0] ?? "" : rawSearch ?? ""
  const categoryId = Array.isArray(rawCategory) ? rawCategory[0] ?? "" : rawCategory ?? ""
  const subcategoryId = Array.isArray(rawSubcategory) ? rawSubcategory[0] ?? "" : rawSubcategory ?? ""
  const brandId = Array.isArray(rawBrand) ? rawBrand[0] ?? "" : rawBrand ?? ""
  const normalizedSearch = search.trim()
  const normalizedCategoryId = categoryId.trim()
  const normalizedSubcategoryId = subcategoryId.trim()
  const normalizedBrandId = brandId.trim()

  const [catalog, categoryCatalog, brandsCatalog] = await Promise.all([
    getProducts({
      search: normalizedSearch,
      categoryId: normalizedCategoryId,
      subcategoryId: normalizedSubcategoryId,
      brandId: normalizedBrandId,
      limit: 1000, // Obtener todos los productos
    }),
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
  // API now returns root categories with children already nested
  const categories = rawCategories.length > 0 ? rawCategories : buildFallbackCategories(products)

  // Find selected category (root level)
  const selectedCategory = normalizedCategoryId
    ? categories.find((c) => c.id === normalizedCategoryId) ?? null
    : null

  // Find selected subcategory within the selected category's children
  const selectedSubcategory =
    normalizedSubcategoryId && selectedCategory?.children
      ? selectedCategory.children.find((c) => c.id === normalizedSubcategoryId) ?? null
      : null

  const selectedBrand = normalizedBrandId
    ? brands.find((brand) => brand.id === normalizedBrandId) ?? null
    : null

  // Build active filter chips with individual remove hrefs
  function buildCatalogUrl(params: {
    search?: string
    category?: string
    subcategory?: string
    brand?: string
  }) {
    const qs = new URLSearchParams()
    if (params.search) qs.set("search", params.search)
    if (params.category) qs.set("category", params.category)
    if (params.subcategory) qs.set("subcategory", params.subcategory)
    if (params.brand) qs.set("brand", params.brand)
    const str = qs.toString()
    return str ? `/catalog?${str}` : "/catalog"
  }

  const activeFilters = [
    ...(normalizedSearch
      ? [
          {
            key: "search",
            label: "Búsqueda",
            value: normalizedSearch,
            removeHref: buildCatalogUrl({
              category: normalizedCategoryId || undefined,
              subcategory: normalizedSubcategoryId || undefined,
              brand: normalizedBrandId || undefined,
            }),
          },
        ]
      : []),
    ...(selectedSubcategory
      ? [
          {
            key: "subcategory",
            label: selectedCategory?.name ?? "Categoría",
            value: selectedSubcategory.name,
            removeHref: buildCatalogUrl({
              search: normalizedSearch || undefined,
              category: normalizedCategoryId || undefined,
              brand: normalizedBrandId || undefined,
            }),
          },
        ]
      : selectedCategory
      ? [
          {
            key: "category",
            label: "Categoría",
            value: selectedCategory.name,
            removeHref: buildCatalogUrl({
              search: normalizedSearch || undefined,
              brand: normalizedBrandId || undefined,
            }),
          },
        ]
      : []),
    ...(selectedBrand
      ? [
          {
            key: "brand",
            label: "Marca",
            value: selectedBrand.name,
            removeHref: buildCatalogUrl({
              search: normalizedSearch || undefined,
              category: normalizedCategoryId || undefined,
              subcategory: normalizedSubcategoryId || undefined,
            }),
          },
        ]
      : []),
  ]

  // Build breadcrumbs
  const breadcrumbs = [
    { label: "Catálogo", href: "/catalog" },
    ...(selectedCategory
      ? [
          {
            label: selectedCategory.name,
            href: `/catalog?category=${encodeURIComponent(selectedCategory.id)}`,
          },
        ]
      : []),
    ...(selectedSubcategory ? [{ label: selectedSubcategory.name }] : []),
    ...(selectedBrand && !selectedSubcategory ? [{ label: "Marca: " + selectedBrand.name }] : []),
  ]

  return (
    <div className="store-surface min-h-screen bg-background text-foreground">
      <AutoTour page="catalog" delay={1500} />
      <StoreHeader currentSearch={normalizedSearch} categories={categories} brands={brands} />

      <main className="pb-14">
        <section className="container mx-auto px-4 pt-6">
          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
            {/* Sidebar — hidden on mobile, visible on xl+ */}
            <div className="hidden xl:block">
              <CategorySidebar
                categories={categories}
                selectedCategoryId={selectedCategory?.id ?? null}
                selectedSubcategoryId={selectedSubcategory?.id ?? null}
              />
            </div>

            <div>
              {/* Breadcrumbs */}
              {breadcrumbs.length > 1 && (
                <div className="mb-3">
                  <Breadcrumbs items={breadcrumbs} />
                </div>
              )}

              {/* Header */}
              <div className="mb-4 border-b border-border/60 pb-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                  Catálogo
                </p>
                <h1 className="mt-1 text-xl font-black text-foreground sm:text-3xl">
                  {selectedSubcategory
                    ? selectedSubcategory.name
                    : selectedBrand
                    ? selectedBrand.name
                    : selectedCategory
                    ? selectedCategory.name
                    : "Todos los productos"}
                </h1>
              </div>

              {/* Active filter chips */}
              <ActiveFilters filters={activeFilters} clearAllHref="/catalog" />

              {products.length > 0 ? (
                <div className="mt-4">
                  <CatalogGrid
                    products={products}
                    grouped={!normalizedCategoryId && !normalizedSubcategoryId && !normalizedSearch && !normalizedBrandId}
                  />
                </div>
              ) : (
                <div className="mt-6 flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-center text-sm text-muted-foreground">
                  No encontramos productos con esos filtros.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  )
}
