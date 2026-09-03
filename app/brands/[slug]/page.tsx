import Link from "next/link"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, PackageSearch, Shield } from "lucide-react"
import type { Metadata } from "next"
import { getBrands, getProducts } from "@/lib/api"
import { CatalogGrid } from "@/components/store/catalog-grid"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import { Breadcrumbs } from "@/components/store/home/breadcrumbs"
import type { Brand, Product } from "@/lib/types"

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-")
}

function findBrandBySlug(brands: Brand[], slug: string): Brand | undefined {
  return brands.find((b) => b.id === slug || toSlug(b.name) === slug)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const catalog = await getBrands()
  const brands = catalog.ok ? catalog.brands : []
  const brand = findBrandBySlug(brands, slug)
  if (!brand) return { title: "Marca no encontrada" }
  return {
    title: `${brand.name} | Somme Technology`,
    description: `Todos los productos de ${brand.name} disponibles en Somme Technology. Cámaras, grabadores y accesorios.`,
    alternates: { canonical: `/brands/${slug}` },
    openGraph: {
      title: `${brand.name} | Somme Technology`,
      description: `Productos de ${brand.name} en Somme Technology.`,
      url: `/brands/${slug}`,
      type: "website",
      ...(brand.logo ? { images: [{ url: brand.logo, alt: brand.name }] } : {}),
    },
  }
}

export default async function BrandSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [catalog, brandsCatalog] = await Promise.all([getProducts({ limit: 1000 }), getBrands()])
  const brands = brandsCatalog.ok ? brandsCatalog.brands : []
  const brand = findBrandBySlug(brands, slug)
  if (!brand) {
    const redirected = redirect(`/brands?brandId=${encodeURIComponent(slug)}`)
    return redirected
  }

  const allProducts = catalog.ok ? catalog.products : []
  const products = allProducts.filter((p) => p.brandId === brand.id || p.brand === brand.name)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader brands={brands} />
      <main className="container mx-auto px-4 py-6 sm:py-10">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: "Marcas", href: "/brands" }, { label: brand.name }]} />
        </div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {brand.logo ? (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border bg-white p-2 dark:bg-slate-900 sm:h-16 sm:w-16">
                <Image src={brand.logo} alt={brand.name} fill className="object-contain" unoptimized />
              </div>
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-muted sm:h-16 sm:w-16">
                <Shield className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Marca</p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">{brand.name}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{products.length} producto{products.length === 1 ? "" : "s"}</p>
            </div>
          </div>
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition hover:bg-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Todas las marcas
          </Link>
        </div>
        {products.length > 0 ? (
          <CatalogGrid products={products} basePath={`/brands/${slug}`} />
        ) : (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed bg-muted/30 text-center text-sm text-muted-foreground">
            <div>
              <PackageSearch className="mx-auto h-10 w-10 opacity-40" />
              <p className="mt-3">No hay productos de esta marca disponibles todavía.</p>
            </div>
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  )
}
