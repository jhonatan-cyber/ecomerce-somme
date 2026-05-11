"use client"

import { useMemo, useState, useEffect, useRef, useCallback } from "react"
import { ArrowDownUp, Check } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/lib/types"

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc"

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Más recientes" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre A-Z" },
]

interface CatalogGridProps {
  products: Product[]
  grouped?: boolean
  search?: string
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
    const haystack = [
      p.name,
      p.category,
      p.brand,
      p.description,
    ].filter(Boolean).join(" ").toLowerCase()
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

export function CatalogGrid({ products, grouped = false, search = "" }: CatalogGridProps) {
  const [sort, setSort] = useState<SortOption>("default")
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelect = useCallback((option: SortOption) => {
    setSort(option)
    setOpen(false)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return

    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [open])

  const filtered = useMemo(() => filterBySearch(products, search), [products, search])
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort])
  const groups = useMemo(() => (grouped ? groupByCategory(sorted) : null), [sorted, grouped])

  return (
    <div className="space-y-6">
      {/* Sort toolbar */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{sorted.length}</span>{" "}
          producto{sorted.length !== 1 ? "s" : ""}
          {search && sorted.length !== products.length && (
            <span className="ml-1 text-muted-foreground">
              de {products.length} totales
            </span>
          )}
        </p>

        {/* Sort selector */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="listbox"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/40"
          >
            <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
            {SORT_OPTIONS.find((o) => o.value === sort)?.label}
          </button>

          {open && (
            <div
              role="listbox"
              className="absolute right-0 top-full z-[100] mt-1 min-w-[220px] overflow-hidden rounded-xl border border-border/70 bg-popover p-1 shadow-xl"
            >
              {SORT_OPTIONS.map((option) => {
                const isActive = sort === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(option.value)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-popover-foreground hover:bg-accent/50"
                    }`}
                  >
                    {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
                    <span className={isActive ? "ml-0" : "ml-5"}>{option.label}</span>
                  </button>
                )
              })}
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
              <div data-tour="catalog-grid" className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {items.map((p) => <div key={p.id} data-tour="product-card"><ProductCard product={p} /></div>)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Flat grid */
        <div data-tour="catalog-grid" className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
