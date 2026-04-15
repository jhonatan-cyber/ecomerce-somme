import Link from "next/link"
import { getBrands, getCategories, getProducts } from "@/lib/api"
import { CatalogStatusPage } from "@/components/store/home/catalog-status-page"
import { CatalogSection } from "@/components/store/home/catalog-section"
import { CategorySidebar } from "@/components/store/home/category-sidebar"
import { EditorialDealsSection } from "@/components/store/home/editorial-deals-section"
import { FeaturedShowcaseSection } from "@/components/store/home/featured-showcase-section"
import { HeroSection } from "@/components/store/home/hero-section"
import { ProductRailSection } from "@/components/store/home/product-rail-section"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import { ShieldCheck, Truck, Zap } from "lucide-react"
import type { Brand, Category, Product } from "@/lib/types"

function formatPrice(price: number) {
  return `$${price.toLocaleString()}`
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

  return [
    "Camaras IP",
    "Kits de seguridad",
    "Grabadores NVR",
    "Accesorios",
    "Video porteros",
    "Audio y sirenas",
    "Sensores",
    "Automatizacion",
  ].map((name) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    icon: null,
    description: null,
    active: true,
    parentId: null,
  }))
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const rawSearch = resolvedSearchParams?.search
  const rawCategory = resolvedSearchParams?.category
  const search = Array.isArray(rawSearch) ? rawSearch[0] ?? "" : rawSearch ?? ""
  const categoryId = Array.isArray(rawCategory) ? rawCategory[0] ?? "" : rawCategory ?? ""
  const normalizedSearch = search.trim()
  const normalizedCategoryId = categoryId.trim()

  const [catalog, categoryCatalog, brandsCatalog] = await Promise.all([
    getProducts({ search: normalizedSearch, categoryId: normalizedCategoryId }),
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

  if (catalog.products.length === 0 && !normalizedSearch) {
    return (
      <CatalogStatusPage
        badge="Catalog empty"
        title="Todavia no hay productos publicados"
        message="El dashboard esta bien conectado, pero aun no expone productos activos para mostrar en el storefront."
        actionLabel="Volver al inicio"
      />
    )
  }

  const products = catalog.products
  const fallbackCategories = buildFallbackCategories(products)
  const categories =
    categoryCatalog.ok && categoryCatalog.categories.length > 0
      ? categoryCatalog.categories
      : fallbackCategories
  const selectedCategory = normalizedCategoryId
    ? categories.find((category) => category.id === normalizedCategoryId) ?? null
    : null

  const topRow = products.slice(0, 4)
  const bestSellers = products.slice(4, 10)
  const recent = products.slice(2, 8)
  const editorialLeft = products.slice(0, 3)
  const editorialRight = products.slice(3, 6)
  const heroProduct = products[0]
  const centerShowcase = products[1]
  const heroCategoryName =
    selectedCategory?.name ?? heroProduct?.category ?? "Seguridad Electronica"
  const heroCategoryProductCount = selectedCategory
    ? products.length
    : products.filter((product) => product.category === heroCategoryName).length

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

            <HeroSection
              heroProduct={heroProduct}
              selectedCategory={selectedCategory}
              products={products}
              heroCategoryName={heroCategoryName}
              heroCategoryProductCount={heroCategoryProductCount}
            />
          </div>
        </section>

        <FeaturedShowcaseSection centerShowcase={centerShowcase} topRow={topRow} />

        <EditorialDealsSection
          centerShowcase={centerShowcase}
          editorialLeft={editorialLeft}
          editorialRight={editorialRight}
        />

        <ProductRailSection
          title="Bestsellers"
          subtitle="Una seleccion compacta con foco comercial para la tienda."
          badge="Top 20"
          products={bestSellers}
        />

        <section className="container mx-auto px-4 pt-8">
          <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,#eef4ff_0%,#fff7d6_100%)] p-8 shadow-sm">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Shop and save big</p>
                <h2 className="mt-3 text-3xl font-black text-slate-900 lg:text-4xl">Una home con lenguaje de retail pensada para Somme Technology.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">La portada mezcla jerarquia editorial, productos destacados y bloques comerciales para que el catalogo se vea mas serio, moderno y listo para vender.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"><Truck className="h-4 w-4 text-primary" /> Despacho coordinado</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"><ShieldCheck className="h-4 w-4 text-primary" /> Compra con confianza</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"><Zap className="h-4 w-4 text-primary" /> Decision mas rapida</span>
                </div>
              </div>
              <div className="rounded-[1.8rem] bg-white p-6 shadow-lg">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Limited price</p>
                <p className="mt-3 text-5xl font-black text-primary">$799</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Este bloque sirve para una promo fuerte, una categoria empujada o una oferta de temporada.</p>
              </div>
            </div>
          </div>
        </section>

        <ProductRailSection
          title="Selecciones del momento"
          badge="Updated from product feed"
          products={recent}
          iconMode="clock"
        />

        <section className="container mx-auto px-4 pt-8">
          <div className="grid gap-3 rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm md:grid-cols-5">
            {[
              "themeforest",
              "graphicriver",
              "codecanyon",
              "audiojungle",
              "activeden",
            ].map((brand) => (
              <div key={brand} className="flex items-center justify-center rounded-2xl border border-dashed border-border px-4 py-5 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                {brand}
              </div>
            ))}
          </div>
        </section>

        <CatalogSection
          products={products}
          normalizedSearch={normalizedSearch}
          selectedCategory={selectedCategory}
        />
      </main>

      <StoreFooter categories={categories} />
    </div>
  )
}
