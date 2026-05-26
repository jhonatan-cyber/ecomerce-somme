import Link from "next/link"
import { ArrowRight, Camera, Eye } from "lucide-react"
import { ProductCardActions } from "@/components/store/product-card-actions"
import type { Category, Product } from "@/lib/types"

interface HeroSectionProps {
  heroProduct?: Product
  selectedCategory: Category | null
  products: Product[]
  heroCategoryName: string
  heroCategoryProductCount: number
}

function formatPrice(price: number) {
  return `BOB ${price.toLocaleString("es-BO")}`
}

function getPrimaryImage(product: Product) {
  const values = [product.image_url, ...(product.images ?? [])]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim())
    .filter(Boolean)

  return Array.from(new Set(values))[0] ?? null
}

function getRandomProducts(products: Product[], count: number): Product[] {
  const sorted = [...products].sort((a, b) => {
    const hashA = a.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const hashB = b.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return hashA - hashB
  })

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
      <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pb-5">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Explorar
          </p>
          <h1 className="mt-1 text-xl font-black text-foreground sm:text-2xl lg:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
            {subtitle}
          </p>
        </div>
        <Link
          href={selectedCategory ? `/catalog?category=${encodeURIComponent(selectedCategory.id)}` : "/catalog"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition hover:opacity-90 sm:w-fit sm:text-sm"
        >
          Ver catálogo completo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {showcaseProducts.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          {showcaseProducts.map((product) => {
            const image = getPrimaryImage(product)
            const inStock = product.stock > 0

            return (
              <article
                key={product.id}
                className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card"
              >
                <Link href={`/product/${encodeURIComponent(product.id)}`} scroll className="block bg-muted">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      loading="lazy"
                      className="block aspect-square h-auto w-full object-contain"
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center">
                      <Camera className="h-10 w-10 text-muted-foreground/35" />
                    </div>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2.5">
                  {product.category && (
                    <p className="truncate text-[10px] font-semibold text-muted-foreground">
                      {product.category}
                    </p>
                  )}

                  <Link
                    href={`/product/${encodeURIComponent(product.id)}`}
                    scroll
                    className="block min-h-[2.5rem] overflow-hidden text-[11px] font-semibold leading-5 text-foreground sm:text-xs"
                  >
                    {product.name}
                  </Link>

                  <div className="mt-auto">
                    <p className="text-sm font-black text-foreground sm:text-base">
                      {formatPrice(product.price)}
                    </p>
                    <p className={`text-[10px] font-semibold ${inStock ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                      Stock disponible: {inStock ? product.stock : 0}
                    </p>
                  </div>

                  <div className="mt-1 flex gap-2">
                    <Link
                      href={`/product/${encodeURIComponent(product.id)}`}
                      scroll
                      className="hidden min-w-0 flex-1 items-center justify-center rounded-lg border border-border bg-background px-2 py-2 text-xs font-bold text-foreground sm:flex"
                      title="Ver producto"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <ProductCardActions product={product} />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="flex min-h-[280px] items-center justify-center p-6 text-center text-sm text-muted-foreground">
          No hay productos disponibles todavía.
        </div>
      )}
    </section>
  )
}
