"use client"

import { useMemo, useState } from "react"
import { ArrowDownUp } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/lib/types"

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc"

const SORT_LABELS: Record<SortOption, string> = {
  default: "Más recientes",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  "name-asc": "Nombre A-Z",
}

interface CatalogGridProps {
  products: Product[]
  grouped?: boolean // group by category when no filter active
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

export function CatalogGrid({ products, grouped = false }: CatalogGridProps) {
  const [sort, setSort] = useState<SortOption>("default")
  const [open, setOpen] = useState(false)

  const sorted = useMemo(() => sortProducts(products, sort), [products, sort])
  const groups = useMemo(() => grouped ? groupByCategory(sorted) : null, [sorted, grouped])

  return (
    <div className="space-y-6">
      {/* Sort toolbar */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{products.length}</span>{" "}
          producto{products.length !== 1 ? "s" : ""}
        </p>

        {/* Sort selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40"
          >
            <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
            {SORT_LABELS[sort]}
          </button>

          {open && (
            <div className="absolute right-0 top-full z-20 mt-1 min-w-[200px] overflow-hidden rounded-xl border border-border/70 bg-card shadow-lg">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { setSort(opt); setOpen(false) }}
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
                {items.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Flat grid */
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
