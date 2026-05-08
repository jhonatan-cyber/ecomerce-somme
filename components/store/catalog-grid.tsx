"use client"

import { useMemo, useState } from "react"
import { ArrowDownUp, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import type { Product, Brand } from "@/lib/types"

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc"

const SORT_LABELS: Record<SortOption, string> = {
  default: "Más recientes",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  "name-asc": "Nombre A-Z",
}

const PAGE_SIZE = 24

interface CatalogGridProps {
  products: Product[]
  search?: string
  grouped?: boolean
  brands?: Brand[]
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const arr = [...products]
  switch (sort) {
    case "price-asc":  return arr.sort((a, b) => a.price - b.price)
    case "price-desc": return arr.sort((a, b) => b.price - a.price)
    case "name-asc":   return arr.sort((a, b) => a.name.localeCompare(b.name, "es"))
    default:           return arr
  }
}

function filterBySearch(products: Product[], search: string): Product[] {
  if (!search.trim()) return products
  const terms = search.toLowerCase().trim().split(/\s+/)
  return products.filter((p) => {
    const haystack = [p.name, p.category, p.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
}

function groupByCategory(products: Product[]): { category: string; items: Product[] }[] {
  const map = new Map<string, Product[]>()
  for (const p of products) {
    const key = p.category ?? "Sin categoría"
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(p)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, "es"))
    .map(([category, items]) => ({ category, items }))
}

export function CatalogGrid({ products, grouped = false, search = "", brands }: CatalogGridProps) {
  const [sort, setSort] = useState<SortOption>("default")
  const [sortOpen, setSortOpen] = useState(false)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => filterBySearch(products, search), [products, search])
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort])

  // Reset to page 1 when sort or search changes
  const totalPages = grouped ? 1 : Math.ceil(sorted.length / PAGE_SIZE)
  const safePage = Math.min(page, Math.max(1, totalPages))

  const paginated = useMemo(() => {
    if (grouped) return sorted
    const start = (safePage - 1) * PAGE_SIZE
    return sorted.slice(start, start + PAGE_SIZE)
  }, [sorted, grouped, safePage])

  const groups = useMemo(
    () => (grouped ? groupByCategory(paginated) : null),
    [paginated, grouped],
  )

  function handleSortChange(opt: SortOption) {
    setSort(opt)
    setPage(1)
    setSortOpen(false)
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{sorted.length}</span>{" "}
          producto{sorted.length !== 1 ? "s" : ""}
          {search && sorted.length !== products.length && (
            <span className="ml-1 text-muted-foreground">de {products.length} totales</span>
          )}
        </p>

        {/* Sort selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40"
          >
            <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
            {SORT_LABELS[sort]}
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 min-w-[200px] overflow-hidden rounded-xl border border-border/70 bg-card shadow-lg">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSortChange(opt)}
                  className={`flex w-full items-center px-4 py-2.5 text-xs font-semibold transition hover:bg-muted/60 ${
                    sort === opt ? "text-primary" : "text-foreground"
                  }`}
                >
                  {sort === opt && <span className="mr-2 text-primary">✓</span>}
                  {SORT_LABELS[opt]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grouped by category */}
      {groups ? (
        <div className="space-y-10">
          {groups.map(({ category, items }) => (
            <div key={category}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-base font-black uppercase tracking-[0.14em] text-foreground">
                  {category}
                </h2>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {items.length}
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} brands={brands} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Flat grid */
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {paginated.map((p) => (
            <ProductCard key={p.id} product={p} brands={brands} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!grouped && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => { setPage((p) => p - 1); scrollToTop() }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background text-sm font-semibold transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
            .reduce<(number | "…")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…")
              acc.push(p)
              return acc
            }, [])
            .map((item, idx) =>
              item === "…" ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-sm text-muted-foreground">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => { setPage(item as number); scrollToTop() }}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition ${
                    safePage === item
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/70 bg-background hover:border-primary/40"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => { setPage((p) => p + 1); scrollToTop() }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background text-sm font-semibold transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
