import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Camera } from "lucide-react"
import type { Category, Product } from "@/lib/types"

interface HeroSectionProps {
  heroProduct?: Product
  selectedCategory: Category | null
  products: Product[]
  heroCategoryName: string
  heroCategoryProductCount: number
}

function formatPrice(price: number) {
  return price.toLocaleString("es-CL")
}

// Deterministic shuffle using product id so it's stable per SSR render
function getRandomProducts(products: Product[], count: number): Product[] {
  const sorted = [...products].sort((a, b) => {
    const hashA = a.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const hashB = b.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return hashA - hashB
  })
  // Interleave from start and middle to get variety
  const result: Product[] = []
  const mid = Math.floor(sorted.length / 2)
  for (let i = 0; i < count && i < sorted.length; i++) {
    result.push(i % 2 === 0 ? sorted[i] : sorted[mid + Math.floor(i / 2)] ?? sorted[i])
  }
  return result.slice(0, count)
}

export function HeroSection({
  selectedCategory,
  products,
  heroCategoryName,
  heroCategoryProductCount,
}: HeroSectionProps) {
  const showcaseProducts = selectedCategory
    ? products.slice(0, 8)
    : getRandomProducts(products, 8)

  const title = selectedCategory?.name ?? "Catálogo"
  const subtitle = selectedCategory
    ? `${products.length} producto${products.length === 1 ? "" : "s"} en esta categoría`
    : `${heroCategoryProductCount} producto${heroCategoryProductCount === 1 ? "" : "s"} disponibles`

  return (
    <section className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:p-6">
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground sm:text-[11px] sm:tracking-[0.28em]">
            Explorar
          </p>
          <h2 className="mt-1 text-xl font-black text-foreground sm:mt-1.5 sm:text-2xl lg:text-3xl">
            {title}
          </h2>
        </div>
        <Link
          href={selectedCategory ? `/catalog?category=${encodeURIComponent(selectedCategory.id)}` : "/catalog"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-blue-700 px-4 py-2 text-xs font-bold text-white transition hover:opacity-90 sm:w-fit sm:px-5 sm:py-2.5 sm:text-sm"
        >
          Ver catálogo completo
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>

      {showcaseProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4 md:gap-4 lg:grid-rows-2">
          {showcaseProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${encodeURIComponent(product.id)}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-background transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {product.brandLogo && (
                  <div className="absolute right-1.5 top-1.5 z-10 overflow-hidden rounded-md bg-white/95 px-1.5 py-1 shadow backdrop-blur sm:px-2 sm:py-1">
                    <Image
                      src={product.brandLogo}
                      alt={product.brand || "Marca"}
                      width={50}
                      height={20}
                      className="h-4 w-auto object-contain sm:h-4"
                      unoptimized
                    />
                  </div>
                )}
                {product.onSale && product.discountPercent && (
                  <div className="absolute left-1.5 top-1.5 z-10 rounded-md bg-red-500 px-1.5 py-0.5">
                    <p className="text-[9px] font-black text-white sm:text-[10px]">-{product.discountPercent}%</p>
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
                    <Camera className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-1 p-2.5">
                <p className="line-clamp-1 text-[11px] font-semibold text-foreground sm:text-xs">
                  {product.name}
                </p>
                <p className={`mt-auto text-sm font-black ${product.onSale ? "text-red-600 dark:text-red-400" : "text-primary"}`}>
                  ${formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[280px] items-center justify-center p-6 text-center text-sm text-muted-foreground">
          No hay productos disponibles todavía.
        </div>
      )}
    </section>
  )
}
