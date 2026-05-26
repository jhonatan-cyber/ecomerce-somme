import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/lib/types"

function sortByNewest(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    if (dateA && dateB) return dateB - dateA
    if (dateA) return -1
    if (dateB) return 1
    return 0
  })
}

export function NewArrivalsSection({ products }: { products: Product[] }) {
  const sorted = sortByNewest(products)
  const newProducts = sorted.slice(0, 6)

  if (newProducts.length === 0) return null

  return (
    <section data-tour="new-arrivals" className="pt-8">
      {/* Header dentro del container */}
      <div className="container mx-auto px-4">
        <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/25">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-base font-black uppercase tracking-[0.18em] text-foreground">Novedades</p>
              <p className="text-xs text-muted-foreground">Últimos productos agregados al catálogo</p>
            </div>
          </div>
          <Link
            href="/new-arrivals"
            className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary sm:inline-flex"
          >
            Ver todas las novedades
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Grid en desktop, scroll horizontal en móvil usando ancho completo */}
      <div className="hidden sm:container sm:mx-auto sm:px-4 sm:grid sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {newProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showViewButton={false}
            showBrand={true}
          />
        ))}
      </div>

      {/* Solo visible en móvil: scroll horizontal que sale del container */}
      <div className="sm:hidden">
        <div
          className="flex gap-3 overflow-x-scroll pb-3 pl-4"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {newProducts.map((product) => (
            <div key={product.id} className="w-[42vw] shrink-0">
              <ProductCard
                product={product}
                showViewButton={false}
                showBrand={true}
              />
            </div>
          ))}
          {/* Padding derecho al final del scroll */}
          <div className="w-4 shrink-0" aria-hidden="true" />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Link
          href="/new-arrivals"
          className="mt-4 flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary sm:hidden"
        >
          Ver todas las novedades
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

