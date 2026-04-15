"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react"
import type { Category } from "@/lib/types"
import { defaultStoreNavigationCategories, getStoreCategoryHref } from "@/lib/store-navigation"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const INITIAL_VISIBLE_CATEGORIES = 10

export function CategorySidebar({
  categories,
  selectedCategoryId,
}: {
  categories: Category[]
  selectedCategoryId?: string | null
}) {
  const [expanded, setExpanded] = useState(false)
  
  // Combine default categories (which have subcategories) with any extra DB categories
  // Also include categories that have children from the database
  const orderedCategories = useMemo(() => {
    const defaultIds = new Set(defaultStoreNavigationCategories.map(c => c.id))
    
    // Categories from DB that have children
    const dbCategoriesWithChildren = categories
      .filter(c => !defaultIds.has(c.id) && c.children && c.children.length > 0)
      .map(c => ({
        id: c.id,
        name: c.name,
        subcategories: c.children?.map(child => ({ id: child.id, name: child.name })) || []
      }))
    
    // Categories from DB without children
    const extraCategories = categories
      .filter(c => !defaultIds.has(c.id) && (!c.children || c.children.length === 0))
      .map(c => ({ id: c.id, name: c.name }))
      
    return [...defaultStoreNavigationCategories, ...dbCategoriesWithChildren, ...extraCategories]
  }, [categories])

  const visibleCategories = expanded
    ? orderedCategories
    : orderedCategories.slice(0, INITIAL_VISIBLE_CATEGORIES)
  const hiddenCount = Math.max(orderedCategories.length - INITIAL_VISIBLE_CATEGORIES, 0)

  return (
    <aside className="overflow-hidden rounded-[2rem] border border-slate-900/80 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-white shadow-[0_30px_90px_-50px_rgba(15,23,42,0.95)]">
      <div className="rounded-t-[2rem] border-b border-white/10 bg-[linear-gradient(90deg,#facc15_0%,#fde68a_100%)] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950">
        Shop Radar
      </div>
      <Accordion type="single" collapsible className="w-full">
        <nav className="divide-y divide-white/10">
          {visibleCategories.map((category) => {
            const hasSubcategories = "subcategories" in category && category.subcategories && category.subcategories.length > 0;
            const isSelected = category.id === selectedCategoryId;

            if (hasSubcategories) {
              return (
                <AccordionItem value={category.id} key={category.id} className="border-b-0">
                  <AccordionTrigger 
                    className={`px-5 py-3 text-sm font-medium transition hover:no-underline [&[data-state=open]]:bg-white/5 ${
                      isSelected ? "bg-white/10 text-cyan-300" : "text-cyan-300 hover:bg-white/5"
                    }`}
                  >
                    {category.name}
                  </AccordionTrigger>
                  <AccordionContent className="bg-slate-900/50 pb-0">
                    <div className="flex flex-col">
                      <Link 
                        href={getStoreCategoryHref(category.id)}
                        className="px-8 py-2.5 text-xs text-white/90 hover:text-cyan-300 hover:bg-white/5 transition"
                      >
                        <strong>Ver todo</strong>
                      </Link>
                      {(("subcategories" in category && category.subcategories) || ("children" in category && category.children)) ? 
                        (category.subcategories || category.children || []).map(sub => (
                          <Link
                            key={sub.id}
                            href={getStoreCategoryHref(category.id, sub.id)}
                            className="px-8 py-2.5 text-xs text-slate-300 hover:text-cyan-300 hover:bg-white/5 transition"
                          >
                            {sub.name}
                          </Link>
                        )) : null}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            }

            return (
              <Link
                key={category.id}
                href={getStoreCategoryHref(category.id)}
                className={`flex items-center justify-between px-5 py-3 text-sm font-medium transition ${
                  isSelected
                    ? "bg-white/10 text-cyan-300"
                    : "text-slate-200 hover:bg-white/5 hover:text-cyan-300"
                }`}
              >
                <span>{category.name}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            )
          })}
        </nav>
      </Accordion>
      {hiddenCount > 0 ? (
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {expanded ? (
              <>
                Ver menos
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Ver mas categorias
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      ) : null}
    </aside>
  )
}
