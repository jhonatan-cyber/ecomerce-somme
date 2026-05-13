import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Camera } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import type { Category, Product } from "@/lib/types"

interface HeroSectionProps {
  heroProduct?: Product
  selectedCategory: Category | null
  products: Product[]
  heroCategoryName: string
  heroCategoryProductCount: number
}

function formatPrice(price: number) {
  return `BOB ${price.toLocaleString("es-CL")}`
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
    <section data-tour="hero-product" className="overflow-hidden">
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
        <div className="grid grid-cols-2 gap-6 gap-x-6 gap-y-6 sm:gap-y-8 sm:gap-x-8 sm:grid-cols-4 md:gap-4 lg:grid-rows-2">
          {showcaseProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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
