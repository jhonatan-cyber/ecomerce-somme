"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Loader2, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { StoreImage } from "@/components/store/store-image"
import { useDebounce } from "@/hooks/use-debounce"
import { getProducts } from "@/lib/api"
import type { Product } from "@/lib/types"

export function SearchPopover({ variant = "default" }: { variant?: "default" | "compact" }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([])
      return
    }

    let cancelled = false
    setIsLoading(true)

    getProducts({ search: debouncedQuery, limit: 6 }).then((res) => {
      if (cancelled) return
      setResults(res.products ?? [])
      setIsLoading(false)
    })

    return () => { cancelled = true }
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const submitSearch = (searchQuery: string) => {
    setIsOpen(false)
    setQuery("")
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitSearch(query)
  }

  return (
    <div ref={containerRef} className="relative flex-1">
      <form onSubmit={handleSubmit} className={variant === "compact" ? "flex" : "flex overflow-hidden rounded-[1.15rem] border border-border bg-background/80 shadow-inner"}>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (!isOpen) setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            className={variant === "compact" ? "h-9 border-0 bg-transparent pl-10 pr-3 text-sm shadow-none focus-visible:ring-0" : "h-11 border-0 bg-transparent pl-10 pr-4 text-sm shadow-none focus-visible:ring-0"}
            placeholder="Buscar productos..."
          />
        </div>
        {variant !== "compact" && (
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Buscar
          </button>
        )}
      </form>

      {isOpen && (query.length >= 2 || isLoading) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-8">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Buscando...</span>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="max-h-80 divide-y divide-border/50 overflow-y-auto">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${encodeURIComponent(product.id)}`}
                    onClick={() => { setIsOpen(false); setQuery("") }}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-muted/50"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <StoreImage
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        fallbackText=""
                        showFallbackIcon={false}
                        fallbackClassName="bg-muted"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">BOB {product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href={`/catalog?search=${encodeURIComponent(query)}`}
                onClick={() => { setIsOpen(false); setQuery("") }}
                className="flex items-center justify-center gap-2 border-t border-border/60 px-4 py-3 text-xs font-bold text-primary transition hover:bg-muted/50"
              >
                Ver todos los resultados
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          ) : query.length >= 2 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">Sin resultados para &quot;{query}&quot;</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
