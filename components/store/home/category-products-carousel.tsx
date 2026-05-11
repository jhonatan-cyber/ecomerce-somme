"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import type { Category, Product } from "@/lib/types"

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

interface CategoryProductsCarouselProps {
  category: Category
  products: Product[]
}

export function CategoryProductsCarousel({ category, products }: CategoryProductsCarouselProps) {
  if (products.length === 0) return null

  const slides = chunk(products, 2)
  const href = `/catalog?category=${encodeURIComponent(category.id)}`

  return (
    <section className="container mx-auto px-4 pt-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {category.name}
          </p>
          <p className="mt-1 text-lg font-black text-foreground">
            {products.length} producto{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/60 hover:bg-primary/5"
        >
          Ver todos
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4 snap-x snap-mandatory scroll-smooth">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-none snap-start w-[min(90vw,520px)] sm:w-[min(46vw,520px)]"
            >
              <div className="grid grid-cols-2 gap-3">
                {slide.map((product) => (
                  <div key={product.id} className="min-w-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
