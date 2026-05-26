"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/lib/types"

interface ProductSliderProps {
  products: Product[]
  category: string
  compact?: boolean
  showDots?: boolean
  showViewButton?: boolean
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

export function ProductSlider({ products, compact = false, showDots = false, showViewButton = true }: ProductSliderProps) {
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

  return (
    <div className="relative w-full">
      {/* Desktop nav buttons */}
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
        disabled={currentSlide >= slides.length - 1}
        className="hidden lg:flex absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-md shadow-slate-900/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Scrollable track */}
      <div
        ref={sliderRef}
        className="overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex gap-1.5 snap-x snap-mandatory scroll-smooth">
          {slides.map((slide, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) slideRefs.current[index] = el
              }}
              className="flex-none snap-start w-full"
            >
              <div className={`grid gap-1.5 ${itemsPerSlide === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                {slide.map((product) => (
                  <div key={product.id} className="min-w-0">
                    <ProductCard product={product} compact={compact} showViewButton={showViewButton} />
                  </div>
                ))}
                {/* Relleno para mantener el grid cuando el último slide tiene menos items */}
                {slide.length < itemsPerSlide &&
                  Array.from({ length: itemsPerSlide - slide.length }).map((_, i) => (
                    <div key={`empty-${i}`} aria-hidden="true" />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicator dots */}
      {showDots && slides.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label="Slides">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={currentSlide === index}
              aria-label={`Ir al slide ${index + 1}`}
              onClick={() => scrollToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-6 bg-foreground"
                  : "w-2 bg-foreground/20 hover:bg-foreground/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
