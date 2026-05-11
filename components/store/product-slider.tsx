"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/store/product-card"
import type { Product } from "@/lib/types"

interface ProductSliderProps {
  products: Product[]
  category: string
}

export function ProductSlider({ products, category }: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const itemsPerView = 3
  const totalSlides = Math.ceil(products.length / itemsPerView)
  const canSlideLeft = currentIndex > 0
  const canSlideRight = currentIndex < totalSlides - 1

  const slideLeft = useCallback(() => {
    if (canSlideLeft) setCurrentIndex(prev => prev - 1)
  }, [canSlideLeft])

  const slideRight = useCallback(() => {
    if (canSlideRight) setCurrentIndex(prev => prev + 1)
  }, [canSlideRight])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50
    
    if (diff > threshold && canSlideRight) slideRight()
    else if (diff < -threshold && canSlideLeft) slideLeft()
  }

  // Keyboard navigation
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && canSlideLeft) slideLeft()
      else if (e.key === "ArrowRight" && canSlideRight) slideRight()
    }

    slider.addEventListener("keydown", handleKeyDown)
    return () => slider.removeEventListener("keydown", handleKeyDown)
  }, [canSlideLeft, canSlideRight, slideLeft, slideRight])

  // Reset on resize
  useEffect(() => {
    const handleResize = () => setCurrentIndex(0)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (products.length <= itemsPerView) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} data-tour="product-card">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative" ref={sliderRef} tabIndex={0}>
      {/* Navigation buttons */}
      <button
        type="button"
        onClick={slideLeft}
        disabled={!canSlideLeft}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/95 shadow-lg border border-border/70 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110"
        aria-label="Productos anteriores"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <button
        type="button"
        onClick={slideRight}
        disabled={!canSlideRight}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/95 shadow-lg border border-border/70 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110"
        aria-label="Siguientes productos"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Products viewport */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / totalSlides)}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div 
              key={slideIndex}
              className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4 px-2"
            >
              {products
                .slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView)
                .map((p) => (
                  <div key={p.id} data-tour="product-card" className="min-w-0">
                    <ProductCard product={p} />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:hidden">
          <span>Desliza para navegar</span>
          <ChevronLeft className="h-3 w-3" />
          <ChevronRight className="h-3 w-3" />
        </div>
        
        <div className="flex justify-center gap-1">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
