import type { Metadata } from "next"
import { getBrands, getCategories, getProducts } from "@/lib/api"
import { buildFallbackCategories } from "@/lib/utils"
import { ActiveFilters } from "@/components/store/home/active-filters"
import { Breadcrumbs } from "@/components/store/home/breadcrumbs"
import { CatalogStatusPage } from "@/components/store/home/catalog-status-page"
import { CategorySidebar } from "@/components/store/home/category-sidebar"
import { BrandSidebarFilter } from "@/components/store/home/brand-sidebar-filter"
import { CatalogGrid } from "@/components/store/catalog-grid"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import type { Brand, Category } from "@/lib/types"

// ---------------------------------------------------------------------------
// SEO metadata — dynamic per active filters
// ---------------------------------------------------------------------------
export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>
}): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : {}
  const rawCategory = resolved?.category
  const rawBrand = resolved?.brand
  const rawSearch = resolved?.search
  const categoryId = Array.isArray(rawCategory) ? rawCategory[0] ?? "" : rawCategory ?? ""
  const brandId = Array.isArray(rawBrand) ? rawBrand[0] ?? "" : rawBrand ?? ""
  const search = Array.isArray(rawSearch) ? rawSearch[0] ?? "" : rawSearch ?? ""

  // Fetch only what we need for the title
  const [categoryCatalog, brandsCatalog] = await Promise.all([
    getCategories(),
    getBrands(),
  ])

  const categories = categoryCatalog.ok ? categoryCatalog.categories : []
  const brands = brandsCatalog.ok ? brandsCatalog.brands : []

  const selectedCategory = categoryId
    ? categories.find((c: Category) => c.id === categoryId) ?? null
    : null
  const selectedBrand = brandId
    ? brands.find((b: Brand) => b.id === brandId) ?? null
    : null

  let title = "Catálogo"
  let description = "Explorá nuestro catálogo completo de cámaras de seguridad, grabadores, kits y accesorios."

  if (search) {
    title = `Resultados para "${search}"`
    description = `Productos encontrados para "${search}" en Somme Technology.`
  } else if (selectedBrand) {
    title = `${selectedBrand.name} — Productos`
    description = `Todos los productos de ${selectedBrand.name} disponibles en Somme Technology.`
  } else if (selectedCategory) {
    title = selectedCategory.name
    description = `Catálogo de ${selectedCategory.name}. Encontrá los mejores productos de videovigilancia en Somme Technology.`
  }

  const canonicalParams = new URLSearchParams()
  if (categoryId) canonicalParams.set("category", categoryId)
  if (brandId) canonicalParams.set("brand", brandId)
  if (search) canonicalParams.set("search", search)
  const canonical = `/catalog${canonicalParams.toString() ? `?${canonicalParams}` : ""}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | Somme Technology`,
      description,
      url: canonical,
      type: "website",
    },
    // Paginated/filtered views shouldn't be indexed to avoid duplicate content
    robots: search
      ? { index: false, follow: true }
      : { index: true, follow: true },
  }
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
  const categories = rawCategories.length > 0 ? rawCategories : buildFallbackCategories(products)

  const selectedCategory = normalizedCategoryId
    ? categories.find((c: Category) => c.id === normalizedCategoryId) ?? null
    : null

  const selectedSubcategory =
    normalizedSubcategoryId && selectedCategory?.children
      ? selectedCategory.children.find((c: Category) => c.id === normalizedSubcategoryId) ?? null
      : null

  const selectedBrand = normalizedBrandId
    ? brands.find((brand: Brand) => brand.id === normalizedBrandId) ?? null
    : null

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
      <StoreHeader currentSearch={normalizedSearch} categories={categories} brands={brands} />

      <main className="pb-14">
        <section className="container mx-auto px-4 pt-6">
          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)] xl:items-start">
            {/* Sidebar — hidden on mobile, visible on xl+ */}
            <div className="hidden xl:flex xl:flex-col xl:gap-4 xl:sticky xl:top-[88px]">
              <CategorySidebar
                categories={categories}
                selectedCategoryId={selectedCategory?.id ?? null}
                selectedSubcategoryId={selectedSubcategory?.id ?? null}
              />
              {brands.length > 0 && (
                <BrandSidebarFilter brands={brands} />
              )}
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
                    search={normalizedSearch}
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
