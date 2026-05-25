"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, X } from "lucide-react"
import type { Category } from "@/lib/types"
import { Input } from "@/components/ui/input"

function getCategoryHref(categoryId: string, subcategoryId?: string) {
  if (subcategoryId) {
    return `/catalog?category=${encodeURIComponent(categoryId)}&subcategory=${encodeURIComponent(subcategoryId)}`
  }
  return `/catalog?category=${encodeURIComponent(categoryId)}`
}

export function CategorySidebar({
  categories,
  selectedCategoryId,
  selectedSubcategoryId,
}: {
  categories: Category[]
  selectedCategoryId?: string | null
  selectedSubcategoryId?: string | null
}) {
  const rootCategories = categories.filter((c) => !c.parentId)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedIds, setExpandedIds] = useState<string[]>(
    selectedCategoryId ? [selectedCategoryId] : [],
  )

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredCategories = normalizedSearch
    ? rootCategories.filter((category) => {
        const categoryMatches = category.name.toLowerCase().includes(normalizedSearch)
        const subcategoryMatches =
          category.children?.some((sub) => sub.name.toLowerCase().includes(normalizedSearch)) ?? false
        return categoryMatches || subcategoryMatches
      })
    : rootCategories

  const toggleCategory = (id: string) => {
    setExpandedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      return [...prev, id]
    })
  }

  return (
    <div
      data-tour="categories-sidebar"
      className="sticky top-[8.5rem] z-20"
    >
      <aside className="flex max-h-[calc(100vh-8.5rem)] flex-col rounded-[2rem] border border-slate-900/80 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-white shadow-[0_30px_90px_-50px_rgba(15,23,42,0.95)] dark:border-white/10">
      <div className="shrink-0 rounded-t-[2rem] border-b border-white/10 bg-[linear-gradient(90deg,#facc15_0%,#fde68a_100%)] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950">
        Shop Radar
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-b-[2rem] scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/95 px-4 py-3 backdrop-blur">
        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar categoria..."
            className="h-9 border-white/15 bg-white/10 pr-9 text-sm text-white placeholder:text-slate-300 focus-visible:ring-cyan-400"
            aria-label="Buscar categoria"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Limpiar busqueda de categorias"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <nav className="min-h-0 divide-y divide-white/10">
        {filteredCategories.map((category) => {
          const hasChildren = category.children && category.children.length > 0
          const isSelected = category.id === selectedCategoryId
          const hasSubcategoryMatch =
            normalizedSearch.length > 0 &&
            (category.children?.some((sub) => sub.name.toLowerCase().includes(normalizedSearch)) ?? false)
          const isExpanded = normalizedSearch
            ? hasSubcategoryMatch || expandedIds.includes(category.id)
            : expandedIds.includes(category.id)

          if (hasChildren) {
            return (
              <div key={category.id}>
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`flex w-full items-center justify-between px-5 py-3 text-sm font-medium transition hover:no-underline ${
                    isSelected
                      ? "bg-white/10 text-cyan-300"
                      : "text-slate-200 hover:bg-white/5 hover:text-cyan-300"
                  }`}
                >
                  <span>{category.name}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 opacity-50 transition-transform" />
                  )}
                </button>
                {isExpanded && (
                  <div className="bg-slate-900/50 pb-1">
                    <Link
                      href={getCategoryHref(category.id)}
                      className={`block px-8 py-2.5 text-xs transition hover:bg-white/5 ${
                        isSelected && !selectedSubcategoryId
                          ? "font-bold text-cyan-300"
                          : "font-semibold text-white/80 hover:text-cyan-300"
                      }`}
                    >
                      Ver todo
                    </Link>
                    {category.children!
                      .filter((sub) => {
                        if (!normalizedSearch) return true
                        return sub.name.toLowerCase().includes(normalizedSearch)
                      })
                      .map((sub) => {
                      const isSubSelected = sub.id === selectedSubcategoryId
                      return (
                        <Link
                          key={sub.id}
                          href={getCategoryHref(category.id, sub.id)}
                          className={`block px-8 py-2.5 text-xs transition hover:bg-white/5 ${
                            isSubSelected
                              ? "font-semibold text-cyan-300"
                              : "text-slate-300 hover:text-cyan-300"
                          }`}
                        >
                          {isSubSelected && (
                            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 align-middle" />
                          )}
                          {sub.name}
                        </Link>
                      )
                      })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={category.id}
              href={getCategoryHref(category.id)}
              className={`flex items-center justify-between px-5 py-3 text-sm font-medium transition ${
                isSelected
                  ? "bg-white/10 text-cyan-300"
                  : "text-slate-200 hover:bg-white/5 hover:text-cyan-300"
              }`}
            >
              <span>{category.name}</span>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Link>
          )
        })}
      </nav>
      {filteredCategories.length === 0 && (
        <p className="px-5 py-4 text-xs text-slate-300">
          No hay categorias que coincidan con la busqueda.
        </p>
      )}
      </div>
      </aside>
    </div>
  )
}
