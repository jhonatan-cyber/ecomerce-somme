import Link from "next/link"
import type { Metadata } from "next"
import { getBrands, getCategories, getProducts } from "@/lib/api"
import { ActiveFilters } from "@/components/store/home/active-filters"
import { Breadcrumbs } from "@/components/store/home/breadcrumbs"
import { CatalogStatusPage } from "@/components/store/home/catalog-status-page"
import { CategorySidebar } from "@/components/store/home/category-sidebar"
import { CatalogGrid } from "@/components/store/catalog-grid"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import { AutoTour } from "@/components/tour"
import type { Category, Product } from "@/lib/types"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuwesomme.cloud"

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : {}
  const rawSearch = resolved?.search
  const rawCategory = resolved?.category
  const rawBrand = resolved?.brand
  const search = Array.isArray(rawSearch) ? rawSearch[0] ?? "" : rawSearch ?? ""
  const categoryId = Array.isArray(rawCategory) ? rawCategory[0] ?? "" : rawCategory ?? ""
  const brandId = Array.isArray(rawBrand) ? rawBrand[0] ?? "" : rawBrand ?? ""

  let title = "Todos los productos"
  let description = "Explora nuestro catalogo completo de camaras IP, grabadores NVR, kits de seguridad y accesorios."

  if (search) {
    title = `Resultados para "${search}"`
    description = `Buscaste "${search}" - encontra camaras, grabadores y accesorios de seguridad.`
  } else if (categoryId) {
    const catalog = await getCategories()
    const categories = catalog.ok ? catalog.categories : []
    const category = categories.find((c) => c.id === categoryId)
    title = category?.name ?? "Categoria"
    description = `Productos de ${title} - camaras, grabadores y accesorios de videovigilancia.`
  } else if (brandId) {
    const catalog = await getBrands()
    const brands = catalog.ok ? catalog.brands : []
    const brand = brands.find((b) => b.id === brandId)
    title = brand?.name ?? "Marca"
    description = `Todos los productos de ${title} disponibles en Somme Technology.`
  }

  const canonical = brandId
    ? `/brands?brandId=${encodeURIComponent(brandId)}`
    : categoryId
      ? `/catalog?category=${encodeURIComponent(categoryId)}`
      : "/catalog"

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title: `${title} | Somme Technology`, description, url: canonical, type: "website" },
    twitter: { card: "summary_large_image", title: `${title} | Somme Technology`, description },
    robots: search ? { index: false, follow: true } : undefined,
  }
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

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const rawSearch = resolvedSearchParams?.search
  const rawCategory = resolvedSearchParams?.category
  const rawSubcategory = resolvedSearchParams?.subcategory
  const rawSubcategories = resolvedSearchParams?.subcategories
  const rawBrand = resolvedSearchParams?.brand

  const search = Array.isArray(rawSearch) ? rawSearch[0] ?? "" : rawSearch ?? ""
  const categoryId = Array.isArray(rawCategory) ? rawCategory[0] ?? "" : rawCategory ?? ""
  const subcategoryId = Array.isArray(rawSubcategory) ? rawSubcategory[0] ?? "" : rawSubcategory ?? ""
  const subcategoriesParam = Array.isArray(rawSubcategories) ? rawSubcategories[0] ?? "" : rawSubcategories ?? ""
  const brandId = Array.isArray(rawBrand) ? rawBrand[0] ?? "" : rawBrand ?? ""

  const normalizedSearch = search.trim()
  const normalizedCategoryId = categoryId.trim()
  const normalizedSubcategoryId = subcategoryId.trim()
  const normalizedSubcategoriesParam = subcategoriesParam.trim()
  const normalizedBrandId = brandId.trim()

  const selectedSubcategoryIds = Array.from(
    new Set(
      (normalizedSubcategoriesParam
        ? normalizedSubcategoriesParam.split(",")
        : normalizedSubcategoryId
          ? [normalizedSubcategoryId]
          : [])
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  )

  const [categoryCatalog, brandsCatalog] = await Promise.all([getCategories(), getBrands()])
  const brands = brandsCatalog.ok ? brandsCatalog.brands : []

  const rawCategories = categoryCatalog.ok ? categoryCatalog.categories : []
  const catalog = await getProducts({
    search: normalizedSearch,
    categoryId: normalizedCategoryId,
    subcategoryId: selectedSubcategoryIds.length === 1 ? selectedSubcategoryIds[0] : "",
    brandId: normalizedCategoryId ? "" : normalizedBrandId,
    limit: 1000,
  })

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

  const products = selectedSubcategoryIds.length > 1
    ? catalog.products.filter((product) => {
      const productSubcategoryId = (product.subcategoryId ?? product.categoryId)?.trim()
      return Boolean(productSubcategoryId && selectedSubcategoryIds.includes(productSubcategoryId))
    })
    : catalog.products

  const categories = rawCategories.length > 0 ? rawCategories : buildFallbackCategories(products)

  const selectedCategory = normalizedCategoryId
    ? categories.find((c) => c.id === normalizedCategoryId) ?? null
    : null

  const selectedSubcategories =
    selectedCategory?.children?.filter((c) => selectedSubcategoryIds.includes(c.id)) ?? []
  const selectedSubcategory = selectedSubcategories.length === 1 ? selectedSubcategories[0] : null

  const selectedBrand = normalizedBrandId
    ? brands.find((brand) => brand.id === normalizedBrandId) ?? null
    : null

  function buildCatalogUrl(params: {
    search?: string
    category?: string
    subcategories?: string[]
    brand?: string
  }) {
    const qs = new URLSearchParams()
    if (params.search) qs.set("search", params.search)
    if (params.category) qs.set("category", params.category)
    if (params.subcategories && params.subcategories.length > 0) {
      qs.set("subcategories", params.subcategories.join(","))
    }
    if (params.brand) qs.set("brand", params.brand)
    const str = qs.toString()
    return str ? `/catalog?${str}` : "/catalog"
  }

  const activeFilters = [
    ...(normalizedSearch
      ? [
        {
          key: "search",
          label: "Busqueda",
          value: normalizedSearch,
          removeHref: buildCatalogUrl({
            category: normalizedCategoryId || undefined,
            subcategories: selectedSubcategoryIds.length > 0 ? selectedSubcategoryIds : undefined,
            brand: normalizedBrandId || undefined,
          }),
        },
      ]
      : []),
    ...(selectedSubcategories.length > 0
      ? selectedSubcategories.map((subcategory) => ({
        key: `subcategory-${subcategory.id}`,
        label: selectedCategory?.name ?? "Categoria",
        value: subcategory.name,
        removeHref: buildCatalogUrl({
          search: normalizedSearch || undefined,
          category: normalizedCategoryId || undefined,
          subcategories: selectedSubcategoryIds.filter((id) => id !== subcategory.id),
          brand: normalizedBrandId || undefined,
        }),
      }))
      : selectedCategory
        ? [
          {
            key: "category",
            label: "Categoria",
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
            subcategories: selectedSubcategoryIds.length > 0 ? selectedSubcategoryIds : undefined,
          }),
        },
      ]
      : []),
  ]

  const breadcrumbs = [
    { label: "Catalogo", href: "/catalog" },
    ...(selectedCategory
      ? [
        {
          label: selectedCategory.name,
          href: `/catalog?category=${encodeURIComponent(selectedCategory.id)}`,
        },
      ]
      : []),
    ...(selectedSubcategory ? [{ label: selectedSubcategory.name }] : []),
    ...(selectedBrand && !selectedSubcategories.length ? [{ label: "Marca: " + selectedBrand.name }] : []),
  ]

  return (
    <div className="store-surface min-h-screen bg-background text-foreground">
      <AutoTour page="catalog" delay={1500} />
      <StoreHeader currentSearch={normalizedSearch} categories={categories} brands={brands} />

      <main className="pb-14">
        <section className="container mx-auto px-4 pt-6">
          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
            <div className="hidden xl:block">
              <CategorySidebar
                categories={categories}
                selectedCategoryId={selectedCategory?.id ?? null}
                selectedSubcategoryId={selectedSubcategory?.id ?? null}
              />
            </div>

            <div>
              {breadcrumbs.length > 1 && (
                <div className="mb-3">
                  <Breadcrumbs items={breadcrumbs} />
                </div>
              )}

              <div className="mb-4 border-b border-border/60 pb-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                  Catalogo
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
                <p className="mt-1 text-sm text-muted-foreground">
                  Mostrando <span className="font-semibold text-foreground">{products.length}</span>{" "}
                  producto{products.length === 1 ? "" : "s"}
                </p>
              </div>

              {selectedCategory && (selectedCategory.children?.length ?? 0) > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Filtrar por subcategorias
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory.children!.map((subcategory) => {
                      const isActive = selectedSubcategoryIds.includes(subcategory.id)
                      const nextSelected = isActive
                        ? selectedSubcategoryIds.filter((id) => id !== subcategory.id)
                        : [...selectedSubcategoryIds, subcategory.id]
                      return (
                        <Link
                          key={subcategory.id}
                          href={buildCatalogUrl({
                            search: normalizedSearch || undefined,
                            category: normalizedCategoryId || undefined,
                            subcategories: nextSelected,
                            brand: normalizedBrandId || undefined,
                          })}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                            isActive
                              ? "border-primary/50 bg-primary/10 text-primary"
                              : "border-border/70 bg-background text-muted-foreground hover:border-primary/30 hover:text-primary"
                          }`}
                        >
                          {subcategory.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              <ActiveFilters filters={activeFilters} clearAllHref="/catalog" />

              {products.length > 0 ? (
                <div className="mt-4">
                  <CatalogGrid
                    products={products}
                    grouped={!normalizedCategoryId && selectedSubcategoryIds.length === 0 && !normalizedSearch && !normalizedBrandId}
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
