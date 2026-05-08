"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Category } from "@/lib/types"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

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
  // Show all categories but organize by hierarchy
  const rootCategories = categories.filter((c) => !c.parentId)

  // Keep the selected category open by default
  const defaultOpenValue = selectedCategoryId ?? undefined

  return (
    <aside className="flex flex-col rounded-[2rem] border border-slate-900/80 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-white shadow-[0_30px_90px_-50px_rgba(15,23,42,0.95)]" style={{ height: "calc(100vh - 88px - 1rem)" }}>
      <div className="rounded-t-[2rem] border-b border-white/10 bg-[linear-gradient(90deg,#facc15_0%,#fde68a_100%)] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 shrink-0">
        Shop Radar
      </div>

      <div
        className="flex-1 overflow-y-auto rounded-b-[2rem]"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(71,85,105,0.6) transparent",
        }}
      >
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultOpenValue}
          className="w-full"
        >
          <nav className="divide-y divide-white/10">
            {rootCategories.map((category) => {
              const hasChildren = category.children && category.children.length > 0
              const isSelected = category.id === selectedCategoryId

              if (hasChildren) {
                return (
                  <AccordionItem value={category.id} key={category.id} className="border-b-0">
                    <AccordionTrigger
                      className={`w-full px-5 py-3 text-sm font-medium transition hover:no-underline [&[data-state=open]]:bg-white/5 ${
                        isSelected
                          ? "bg-white/10 text-cyan-300"
                          : "text-slate-200 hover:bg-white/5 hover:text-cyan-300"
                      }`}
                    >
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent className="bg-slate-900/50 pb-0">
                      <div className="flex flex-col">
                        {/* "Ver todo" link for the parent category */}
                        <Link
                          href={getCategoryHref(category.id)}
                          className={`px-8 py-2.5 text-xs transition hover:bg-white/5 ${
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
                              className={`px-8 py-2.5 text-xs transition hover:bg-white/5 ${
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
                    </AccordionContent>
                  </AccordionItem>
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
        </Accordion>
      </div>
    </aside>
  )
}
