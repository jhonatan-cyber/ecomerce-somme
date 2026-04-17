"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Slide {
  url: string
  alt: string
}

export function HeroBanner({ slides }: { slides: Slide[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % slides.length)
  }, [slides.length])

  const prev = () => {
    setActiveIndex((i) => (i - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (isPaused || slides.length <= 1) return
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [isPaused, next, slides.length])

  if (slides.length === 0) return null

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.url}
          className={`transition-opacity duration-700 ${
            i === activeIndex ? "opacity-100" : "absolute inset-0 opacity-0"
          }`}
        >
          <img
            src={slide.url}
            alt={slide.alt}
            className="h-[220px] w-full object-contain sm:h-[320px] md:h-[420px] lg:h-[520px]"
          />
        </div>
      ))}

      {/* Gradient overlay bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/40 to-transparent" />

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 sm:left-5 sm:h-11 sm:w-11"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 sm:right-5 sm:h-11 sm:w-11"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
