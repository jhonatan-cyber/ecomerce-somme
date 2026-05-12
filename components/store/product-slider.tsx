"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/lib/types"

interface ProductSliderProps {
  products: Product[]
  category: string
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

function useItemsPerSlide() {
  const [itemsPerSlide, setItemsPerSlide] = useState(2)

  useEffect(() => {
    const update = () => setItemsPerSlide(window.innerWidth >= 1024 ? 3 : 2)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return itemsPerSlide
}

export function ProductSlider({ products }: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const itemsPerSlide = useItemsPerSlide()
  const slides = chunk(products, itemsPerSlide)
  const [currentSlide, setCurrentSlide] = useState(0)

  const scrollToSlide = useCallback((index: number) => {
    const container = sliderRef.current
    const target = slideRefs.current[index]
    if (!container || !target) return
    container.scrollTo({ left: target.offsetLeft, behavior: "smooth" })
    setCurrentSlide(index)
  }, [])

  const slideLeft = useCallback(() => {
    if (currentSlide > 0) scrollToSlide(currentSlide - 1)
  }, [currentSlide, scrollToSlide])

  const slideRight = useCallback(() => {
    if (currentSlide < slides.length - 1) scrollToSlide(currentSlide + 1)
  }, [currentSlide, scrollToSlide, slides.length])

  useEffect(() => {
    setCurrentSlide(0)
  }, [itemsPerSlide, products.length])

  useEffect(() => {
    const container = sliderRef.current
    if (!container) return

    const onScroll = () => {
      const offsets = slideRefs.current.map((slide) => slide?.offsetLeft ?? 0)
      const current = offsets.reduce((closestIndex, offset, index) => {
        const currentDistance = Math.abs(container.scrollLeft - offsets[closestIndex])
        const nextDistance = Math.abs(container.scrollLeft - offset)
        return nextDistance < currentDistance ? index : closestIndex
      }, 0)
      setCurrentSlide(current)
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  // Insert promo slides every N products
  const PROMO_INTERVAL = 4
  const allSlides: (Product[] | "promo")[] = []

  let promoIndex = 0
  for (let i = 0; i < slides.length; i++) {
    allSlides.push(slides[i])
    if ((i + 1) % 2 === 0 && i < slides.length - 1) {
      allSlides.push("promo")
      promoIndex++
    }
  }

  return (
    <div className="relative overflow-hidden w-full max-w-[100vw] min-w-0">
      <button
        type="button"
        onClick={slideLeft}
        disabled={currentSlide === 0}
        className="hidden lg:flex absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-md shadow-slate-900/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={slideRight}
        disabled={currentSlide >= allSlides.length - 1}
        className="hidden lg:flex absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-md shadow-slate-900/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={sliderRef}
        className="overflow-x-auto pb-4 scrollbar-hide min-w-0 max-w-[100vw]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex gap-1.5 snap-x snap-mandatory scroll-smooth min-w-0">
          {allSlides.map((slide, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) slideRefs.current[index] = el
              }}
              className="flex-none snap-start w-full max-w-full min-w-0"
            >
              {slide === "promo" ? (
                <div className="h-full min-h-[180px] rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 p-6 flex flex-col justify-center text-white text-center">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">Espacio publicitario</p>
                  <p className="mt-2 text-xl font-black">¡Tu marca aquí!</p>
                  <p className="mt-1 text-sm opacity-90">Llega a miles de clientes</p>
                  <div className="mt-3 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold backdrop-blur-sm">
                    Reservar espacio →
                  </div>
                </div>
              ) : (
                <div className={`min-w-0 grid gap-1.5 ${itemsPerSlide === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                  {slide.map((product) => (
                    <div key={product.id} className="min-w-0 w-full">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
