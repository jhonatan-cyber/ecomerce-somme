import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Camera, Sparkles } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return `BOB ${price.toLocaleString("es-CL")}`
}

export function NewArrivalsSection({ products }: { products: Product[] }) {
  // Last 6 products (already sorted by createdAt desc from API)
  const newProducts = products.slice(0, 6)

  if (newProducts.length === 0) return null

  return (
    <section data-tour="new-arrivals" className="container mx-auto px-4 pt-8">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/25">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-base font-black uppercase tracking-[0.18em] text-foreground">
              Novedades
            </p>
            <p className="text-xs text-muted-foreground">Últimos productos agregados al catálogo</p>
          </div>
        </div>
        <Link
          href="/new-arrivals"
          className="hidden items-center gap-2 rounded-full border border-cyan-200 bg-[linear-gradient(135deg,#ecfeff_0%,#f0f9ff_100%)] px-4 py-2 text-sm font-bold text-cyan-800 shadow-[0_12px_30px_-24px_rgba(6,182,212,0.8)] transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-[0_18px_34px_-22px_rgba(6,182,212,0.9)] sm:inline-flex"
        >
          Ver todas las novedades
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6 gap-x-6 gap-y-6 sm:gap-y-8 sm:gap-x-8 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {newProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} isNew={index < 2} />
        ))}
      </div>

      <Link
        href="/new-arrivals"
        className="mt-4 flex items-center justify-center gap-2 rounded-full border border-cyan-200 bg-[linear-gradient(135deg,#ecfeff_0%,#f0f9ff_100%)] px-4 py-3 text-sm font-bold text-cyan-800 shadow-[0_12px_30px_-24px_rgba(6,182,212,0.8)] transition hover:border-cyan-300 hover:shadow-[0_18px_34px_-22px_rgba(6,182,212,0.9)] sm:hidden"
      >
        Ver todas las novedades
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
