import { getBrands, getCategories, getOnSaleProducts, getProducts, getSlides } from "@/lib/api"
import { buildFallbackCategories } from "@/lib/utils"
import { BrandsCarousel } from "@/components/store/home/brands-carousel"
import { CatalogStatusPage } from "@/components/store/home/catalog-status-page"
import { CategorySidebar } from "@/components/store/home/category-sidebar"
import { HeroBanner } from "@/components/store/home/hero-banner"
import { HeroSection } from "@/components/store/home/hero-section"
import { NewArrivalsSection } from "@/components/store/home/new-arrivals-section"
import { OnSaleSection } from "@/components/store/home/on-sale-section"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Cámaras IP, kits de seguridad, grabadores NVR, video porteros y accesorios de videovigilancia. Asesoramiento técnico y envíos a todo el país.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Somme Technology — Seguridad Electrónica",
    description:
      "Cámaras IP, kits de seguridad, grabadores NVR, video porteros y accesorios de videovigilancia.",
    url: "/",
    type: "website",
  },
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

  const [catalog, categoryCatalog, brandsCatalog, onSaleCatalog, slidesCatalog] = await Promise.all([
    getProducts({ search: normalizedSearch, categoryId: normalizedCategoryId }),
    getCategories(),
    getBrands(),
    getOnSaleProducts(),
    getSlides(),
  ])

  const brands = brandsCatalog.ok ? brandsCatalog.brands : []
  const onSaleProducts = onSaleCatalog.ok ? onSaleCatalog.products : []
  const slides = slidesCatalog.slides

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

  const heroProduct = products[0]
  const heroCategoryName =
    selectedCategory?.name ?? heroProduct?.category ?? "Seguridad Electronica"
  const heroCategoryProductCount = selectedCategory
    ? products.length
    : products.filter((product) => product.category === heroCategoryName).length

  return (
    <div className="store-surface min-h-screen bg-background text-foreground">
      <StoreHeader currentSearch={normalizedSearch} categories={categories} brands={brands} />

      {slides.length > 0 && <HeroBanner slides={slides} />}

      <main className="pb-14">
        <section className="container mx-auto px-4 pt-6">
          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
            <div className="hidden xl:block">
              <CategorySidebar
                categories={categories}
                selectedCategoryId={selectedCategory?.id ?? null}
              />
            </div>

            <HeroSection
              heroProduct={heroProduct}
              selectedCategory={selectedCategory}
              products={products}
              heroCategoryName={heroCategoryName}
              heroCategoryProductCount={heroCategoryProductCount}
            />
          </div>
        </section>

        <NewArrivalsSection products={products} />

        <OnSaleSection products={onSaleProducts} />

        <BrandsCarousel brands={brands} products={products} />
      </main>

      <StoreFooter />
    </div>
  )
}
