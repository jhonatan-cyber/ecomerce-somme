import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Camera, Sparkles } from "lucide-react"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return price.toLocaleString("es-CL")
}

export function NewArrivalsSection({ products }: { products: Product[] }) {
  // Last 6 products (already sorted by createdAt desc from API)
  const newProducts = products.slice(0, 6)

  if (newProducts.length === 0) return null

  return (
    <section className="container mx-auto px-4 pt-8">
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
          href="/catalog"
          className="hidden items-center gap-1.5 text-sm font-semibold text-primary transition hover:underline sm:inline-flex"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {newProducts.map((product, i) => (
            <Link
              key={product.id}
              href={`/product/${encodeURIComponent(product.id)}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-background transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
            >
              {/* Badge "Nuevo" on first 2 */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
                {i < 2 && (
                  <div className="absolute left-2 top-2 z-10 rounded-md bg-cyan-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow">
                    Nuevo
                  </div>
                )}

                {/* Brand logo */}
                {product.brandLogo && (
                  <div className="absolute right-2 top-2 z-10 overflow-hidden rounded-md bg-white/95 px-2 py-0.5 shadow backdrop-blur">
                    <Image
                      src={product.brandLogo}
                      alt={product.brand || "Marca"}
                      width={48}
                      height={18}
                      className="h-3.5 w-auto object-contain"
                      unoptimized
                    />
                  </div>
                )}

                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-3">
                <p className="line-clamp-2 text-xs font-semibold leading-tight text-foreground sm:text-sm">
                  {product.name}
                </p>
                <p className="mt-auto text-base font-black text-primary sm:text-lg">
                  ${formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
      </div>

      <Link
        href="/catalog"
        className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-primary transition hover:underline sm:hidden"
      >
        Ver todos los productos
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
