"use client"

import Link from "next/link"
import { X } from "lucide-react"

interface ActiveFilter {
  key: string
  label: string
  value: string
  removeHref: string
}

interface ActiveFiltersProps {
  filters: ActiveFilter[]
  clearAllHref: string
}

export function ActiveFilters({ filters, clearAllHref }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
        Filtros:
      </span>

      {filters.map((filter) => (
        <Link
          key={filter.key}
          href={filter.removeHref}
          className="group inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 py-1 pl-3 pr-2 text-xs font-semibold text-primary transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-primary/30 dark:bg-primary/10 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          aria-label={`Quitar filtro ${filter.label}: ${filter.value}`}
        >
          <span className="text-muted-foreground/60 group-hover:text-rose-400">{filter.label}:</span>
          <span>{filter.value}</span>
          <X className="h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100" />
        </Link>
      ))}

      {filters.length > 1 && (
        <Link
          href={clearAllHref}
          className="ml-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-rose-500"
        >
          Limpiar todo
        </Link>
      )}
    </div>
  )
}
