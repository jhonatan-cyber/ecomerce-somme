import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, PackageSearch } from "lucide-react"
import type { Metadata } from "next"
import { getCategories, getProducts } from "@/lib/api"
import { CatalogGrid } from "@/components/store/catalog-grid"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import { Breadcrumbs } from "@/components/store/home/breadcrumbs"
import type { Category, Product } from "@/lib/types"

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-")
}

function findCategoryBySlug(categories: Category[], slug: string): Category | undefined {
  return categories.find((c) => c.id === slug || toSlug(c.name) === slug)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const catalog = await getCategories()
  const categories = catalog.ok ? catalog.categories : []
  const category = findCategoryBySlug(categories, slug)
  if (!category) return { title: "Categoría no encontrada" }
  const name = category.name
  return {
    title: `${name} | Somme Technology`,
    description: `Productos de ${name} — cámaras IP, grabadores NVR, kits de seguridad y accesorios.`,
    alternates: { canonical: `/category/${slug}` },
    openGraph: { title: `${name} | Somme Technology`, description: `Productos de ${name} en Somme Technology.`, url: `/category/${slug}`, type: "website" },
  }
}

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [catalog, categoryCatalog] = await Promise.all([getProducts({ limit: 1000 }), getCategories()])
  const categories = categoryCatalog.ok ? categoryCatalog.categories : []
  const category = findCategoryBySlug(categories, slug)
  if (!category) {
    const redirected = redirect(`/catalog?category=${encodeURIComponent(slug)}`)
    return redirected
  }

  const allProducts = catalog.ok ? catalog.products : []
  const categoryIds = new Set([category.id, ...(category.children?.map((c) => c.id) ?? [])])
  const products = allProducts.filter((p) => p.categoryId && categoryIds.has(p.categoryId))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader categories={categories} />
      <main className="container mx-auto px-4 py-6 sm:py-10">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: "Catálogo", href: "/catalog" }, { label: category.name }]} />
        </div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
              Categoría
            </p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">{category.name}</h1>
            {category.description && (
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            )}
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition hover:bg-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Ver todo
          </Link>
        </div>
        {products.length > 0 ? (
          <CatalogGrid products={products} basePath={`/category/${slug}`} />
        ) : (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed bg-muted/30 text-center text-sm text-muted-foreground">
            <div>
              <PackageSearch className="mx-auto h-10 w-10 opacity-40" />
              <p className="mt-3">No hay productos en esta categoría todavía.</p>
            </div>
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  )
}
