"use client"

import Link from "next/link"
import { Shield, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface Brand {
  id: string
  name: string
  logo: string | null
}

export function BrandSidebarFilter({
  brands,
  selectedBrandId,
}: {
  brands: Brand[]
  selectedBrandId?: string | null
}) {
  const [isOpen, setIsOpen] = useState(!!selectedBrandId)

  if (brands.length === 0) return null

  return (
    <aside className="overflow-hidden rounded-[2rem] border border-slate-900/80 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-white shadow-[0_30px_90px_-50px_rgba(15,23,42,0.95)] dark:border-white/10">
      <div className="rounded-t-[2rem] border-b border-white/10 bg-[linear-gradient(90deg,#facc15_0%,#fde68a_100%)] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950">
        Marcas
      </div>
      
      <div className="border-t border-white/10">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-white/5"
        >
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Filtrar por Marca
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {isOpen && (
          <div className="bg-slate-900/50 max-h-[300px] overflow-y-auto pb-2">
            <Link
              href="/catalog"
              className={`block px-6 py-2 text-xs transition hover:bg-white/5 ${
                !selectedBrandId
                  ? "text-cyan-300 font-semibold"
                  : "text-slate-300 hover:text-cyan-300"
              }`}
            >
              Todas las marcas
            </Link>
            {brands.map((brand) => {
              const href = `/catalog?brand=${brand.id}`
              return (
                <Link
                  key={brand.id}
                  href={href}
                  className={`block px-6 py-2 text-xs transition hover:bg-white/5 ${
                    selectedBrandId === brand.id
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
    </aside>
  )
}
