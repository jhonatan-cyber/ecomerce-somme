"use client"

import { useMemo, useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowDownUp, Check } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import { ProductSlider } from "@/components/store/product-slider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
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

function groupByFirstLetter(products: Product[]): { letter: string; items: Product[] }[] {
  const map = new Map<string, Product[]>()
  for (const p of products) {
    const firstLetter = p.name.charAt(0).toUpperCase()
    const key = /^[A-Z]$/.test(firstLetter) ? firstLetter : "#"
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(p)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => {
      // Sort letters A-Z, then # at the end
      if (a === "#") return 1
      if (b === "#") return -1
      return a.localeCompare(b, "es")
    })
    .map(([letter, items]) => ({ letter, items }))
}

function CatalogGridContent({ products, grouped = false, search }: CatalogGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get initial sort from URL params or default to "default"
  const [sort, setSort] = useState<SortOption>(() => {
    const sortParam = searchParams.get("sort")
    return (sortParam as SortOption) || "default"
  })

  const handleSelect = useCallback((option: SortOption) => {
    setSort(option)
    setOpen(false)
    
    // Update URL with new sort parameter
    const newParams = new URLSearchParams(searchParams.toString())
    if (option === "default") {
      newParams.delete("sort")
    } else {
      newParams.set("sort", option)
    }
    
    const newUrl = newParams.toString()
      ? `/catalog?${newParams.toString()}`
      : "/catalog"
    
    router.push(newUrl, { scroll: false })
  }, [router, searchParams])

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

  // Sync sort state with URL params
  useEffect(() => {
    const sortParam = searchParams.get("sort")
    const newSort = (sortParam as SortOption) || "default"
    setSort(newSort)
  }, [searchParams])

  const filtered = useMemo(() => filterBySearch(products, search || ""), [products, search])
  
  // Determine grouping behavior based on sort type
  const shouldIgnoreGrouping = sort !== "default"
  const isAlphabeticalSort = sort === "name-asc"
  
  // Group by categories when no sorting, by letters when alphabetical, or no grouping
  const groups = useMemo(() => {
    if (!shouldIgnoreGrouping && grouped) {
      // Default: group by categories
      return groupByCategory(filtered)
    }
    if (isAlphabeticalSort && grouped) {
      // Alphabetical: group by first letter
      return groupByFirstLetter(sortProducts(filtered, sort)).map(group => ({
        category: group.letter,
        items: group.items
      }))
    }
    return null
  }, [filtered, sort, shouldIgnoreGrouping, grouped, isAlphabeticalSort])
  
  // Apply global sorting when not grouping or when using price sorting
  const sorted = useMemo(() => {
    if (!groups) {
      return sortProducts(filtered, sort)
    }
    return []
  }, [filtered, sort, groups])

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Sort toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">
              {groups ? filtered.length : sorted.length}
            </span>{" "}
            producto{(groups ? filtered.length : sorted.length) !== 1 ? "s" : ""}
          </p>
          {search && filtered.length !== products.length && (
            <span className="text-xs text-muted-foreground">
              de {products.length} totales
            </span>
          )}
          {shouldIgnoreGrouping && grouped && (
            <span className="text-xs text-primary font-medium">
              {isAlphabeticalSort ? "Agrupado por letra" : "Vista ordenada"}
            </span>
          )}
        </div>

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
              className="absolute right-0 top-full z-[100] mt-1 min-w-[200px] sm:min-w-[220px] overflow-hidden rounded-xl border border-border/70 bg-popover p-1 shadow-xl"
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
        <div className="space-y-8 sm:space-y-10">
          {groups.map((group) => (
            <div key={group.category}>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <h2 className={`font-semibold uppercase tracking-[0.14em] text-foreground ${
                  /^[A-Z#]$/.test(group.category) ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'
                }`}>
                  {group.category}
                </h2>
                <span className="rounded-full bg-muted px-2 sm:px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {group.items.length}
                </span>
                {sort !== "default" && !/^[A-Z#]$/.test(group.category) && (
                  <span className="rounded-full bg-primary/10 px-2 sm:px-2.5 py-0.5 text-xs font-medium text-primary">
                    {SORT_OPTIONS.find(o => o.value === sort)?.label}
                  </span>
                )}
                <div className="hidden sm:block h-px flex-1 bg-border/60" />
              </div>
              <div data-tour="catalog-grid">
                <ProductSlider 
                  products={group.items} 
                  category={group.category}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Flat grid */
        <div data-tour="catalog-grid" className="grid grid-cols-2 gap-y-6 gap-x-6 sm:gap-y-8 sm:gap-x-8 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

export function CatalogGrid(props: CatalogGridProps) {
  return (
    <Suspense fallback={
      <div className="flex min-h-[200px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <CatalogGridContent {...props} />
    </Suspense>
  )
}
