"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Filter, Shield } from "lucide-react"
import { useEffect, useState } from "react"

interface Brand {
  id: string
  name: string
  logo: string | null
}

export function BrandFilter({ brands }: { brands: Brand[] }) {
  const searchParams = useSearchParams()
  const currentBrand = searchParams.get("brand")
  const [isOpen, setIsOpen] = useState(!!currentBrand)

  if (brands.length === 0) return null

  return (
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
        <Filter className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="bg-slate-900/50 pb-2">
          <Link
            href="/catalog"
            className={`block px-8 py-2 text-xs transition ${
              !currentBrand
                ? "text-cyan-300 font-semibold"
                : "text-slate-300 hover:text-cyan-300"
            }`}
          >
            Todas las marcas
          </Link>
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/catalog?brand=${brand.id}`}
              className={`block px-8 py-2 text-xs transition ${
                currentBrand === brand.id
                  ? "text-cyan-300 font-semibold"
                  : "text-slate-300 hover:text-cyan-300"
              }`}
            >
              {brand.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
