import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Camera, LayoutGrid } from "lucide-react"
import type { Product, Category } from "@/lib/types"

function formatPrice(price: number) {
  return price.toLocaleString("es-CL")
}

interface ByCategorySectionProps {
  products: Product[]
  categories: Category[]
}

export function ByCategorySection({ products, categories }: ByCategorySectionProps) {
  // Root categories only, max 6
  const rootCategories = categories.filter((c) => !c.parentId).slice(0, 6)

  if (rootCategories.length === 0) return null

  // For each category, find the best product (with image, highest price)
  const categoryItems = rootCategories
    .map((cat) => {
      const catProducts = products.filter(
        (p) => p.categoryId === cat.id || p.category?.toLowerCase() === cat.name.toLowerCase()
      )
      const best = catProducts
        .filter((p) => p.image_url)
        .sort((a, b) => b.price - a.price)[0] ?? catProducts[0] ?? null

      return { category: cat, product: best, count: catProducts.length }
    })
    .filter((item) => item.count > 0)

  if (categoryItems.length === 0) return null

  return (
    <section className="container mx-auto px-4 pt-8">
      <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm sm:p-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-md shadow-yellow-400/25">
              <LayoutGrid className="h-4 w-4 text-slate-900" />
            </div>
            <div>
              <p className="text-base font-black uppercase tracking-[0.18em] text-foreground">
                Por categoría
              </p>
              <p className="text-xs text-muted-foreground">Explora por tipo de producto</p>
            </div>
          </div>
          <Link
            href="/catalog"
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary transition hover:underline sm:inline-flex"
          >
            Ver catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {categoryItems.map(({ category, product, count }) => (
            <Link
              key={category.id}
              href={`/catalog?category=${encodeURIComponent(category.id)}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-background transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
            >
              {/* Product image as category visual */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
                {product?.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
                {/* Dark overlay with category name */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2.5">
                  <p className="line-clamp-2 text-xs font-bold leading-tight text-white drop-shadow">
                    {category.name}
                  </p>
                </div>
              </div>

              {/* Count + CTA */}
              <div className="flex items-center justify-between gap-1 px-3 py-2.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  {count} producto{count !== 1 ? "s" : ""}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
