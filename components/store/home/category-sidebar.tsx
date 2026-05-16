"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { Category } from "@/lib/types"

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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    selectedCategoryId ? new Set([selectedCategoryId]) : new Set(),
  )

  const toggleCategory = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
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

      <div className="flex-1 overflow-hidden rounded-b-[2rem]">
      <nav className="h-full overflow-y-auto scrollbar-hide divide-y divide-white/10">
        {rootCategories.map((category) => {
          const hasChildren = category.children && category.children.length > 0
          const isSelected = category.id === selectedCategoryId
          const isExpanded = expandedIds.has(category.id)

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
                    {category.children!.map((sub) => {
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
      </div>
      </aside>
    </div>
  )
}
