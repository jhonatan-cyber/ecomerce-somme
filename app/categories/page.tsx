import Link from "next/link"
import type { Metadata } from "next"
import { getBrands, getCategories } from "@/lib/api"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import type { Category } from "@/lib/types"

export const metadata: Metadata = {
  title: "Categorias",
  description: "Explora todas las categorias del ecommerce de Somme Technology.",
}

type CategoryEntry = {
  id: string
  name: string
  href: string
}

function compareCategoryNames(a: CategoryEntry, b: CategoryEntry) {
  return a.name.localeCompare(b.name, "es", { sensitivity: "base" })
}

function toCategoryEntries(categories: Category[]): CategoryEntry[] {
  const roots = categories.filter((category) => !category.parentId)
  return roots
    .map((category) => ({
      id: category.id,
      name: category.name,
      href: `/catalog?category=${encodeURIComponent(category.id)}`,
    }))
    .sort(compareCategoryNames)
}

export default async function CategoriesPage() {
  const [categoriesCatalog, brandsCatalog] = await Promise.all([getCategories(), getBrands()])

  const categories = categoriesCatalog.ok ? categoriesCatalog.categories : []
  const brands = brandsCatalog.ok ? brandsCatalog.brands : []
  const allEntries = toCategoryEntries(categories)

  return (
    <div className="store-surface min-h-screen bg-background text-foreground">
      <StoreHeader categories={categories} brands={brands} />

      <main className="pb-14">
        <section className="container mx-auto px-4 pt-6">
          <div className="mb-6 border-b border-border/60 pb-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Categorias</p>
            <h1 className="mt-1 text-xl font-black text-foreground sm:text-3xl">Todas las categorias</h1>
            <p className="mt-2 text-sm text-muted-foreground">Ordenadas alfabeticamente para encontrar mas rapido lo que buscas.</p>
          </div>

          {allEntries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center text-sm text-muted-foreground">
              No hay categorias disponibles en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={entry.href}
                  className="rounded-2xl border border-border/70 bg-card/80 px-4 py-3 transition hover:border-primary/40 hover:bg-card"
                >
                  <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Categoria</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <StoreFooter />
    </div>
  )
}
