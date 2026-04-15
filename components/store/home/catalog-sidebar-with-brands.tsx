"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Filter, Shield, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface Brand {
  id: string
  name: string
  logo: string | null
}

export function CatalogSidebarWithBrands({
  categories,
  selectedCategoryId,
  brands,
}: {
  categories: { id: string; name: string; children?: { id: string; name: string }[] }[]
  selectedCategoryId?: string | null
  brands: Brand[]
}) {
  const searchParams = useSearchParams()
  const currentBrand = searchParams?.get("brand")
  const currentCategory = searchParams?.get("category")
  const [brandFilterOpen, setBrandFilterOpen] = useState(!!currentBrand)

  return (
    <aside className="overflow-hidden rounded-[2rem] border border-slate-900/80 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-white shadow-[0_30px_90px_-50px_rgba(15,23,42,0.95)]">
      <div className="rounded-t-[2rem] border-b border-white/10 bg-[linear-gradient(90deg,#facc15_0%,#fde68a_100%)] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950">
        Shop Radar
      </div>
      
      {brands.length > 0 && (
        <div className="border-t border-white/10">
          <button
            type="button"
            onClick={() => setBrandFilterOpen(!brandFilterOpen)}
            className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-white/5"
          >
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Filtrar por Marca
            </span>
            <Filter className={`h-4 w-4 transition-transform ${brandFilterOpen ? "rotate-180" : ""}`} />
          </button>
          
          {brandFilterOpen && (
            <div className="bg-slate-900/50 pb-2">
              <Link
                href={`/catalog${currentCategory ? "?category=" + currentCategory : ""}`}
                className={`block px-8 py-2 text-xs transition ${
                  !currentBrand
                    ? "text-cyan-300 font-semibold"
                    : "text-slate-300 hover:text-cyan-300"
                }`}
              >
                Todas las marcas
              </Link>
              {brands.map((brand) => {
                const href = `/catalog?${currentCategory ? "category=" + currentCategory + "&" : ""}brand=${brand.id}`
                return (
                  <Link
                    key={brand.id}
                    href={href}
                    className={`block px-8 py-2 text-xs transition ${
                      currentBrand === brand.id
                        ? "text-cyan-300 font-semibold"
                        : "text-slate-300 hover:text-cyan-300"
                    }`}
                  >
                    {brand.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}
    </aside>
  )
}