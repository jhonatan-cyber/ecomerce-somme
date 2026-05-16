"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AdSlide {
  url: string
  alt: string
}

interface AdCarouselProps {
  ads: AdSlide[]
}

export function AdCarousel({ ads }: AdCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const goTo = useCallback((index: number) => {
    setCurrent((index + ads.length) % ads.length)
  }, [ads.length])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (ads.length <= 1 || isHovered) return
    const interval = setInterval(next, 4000)
    return () => clearInterval(interval)
  }, [ads.length, isHovered, next])

  if (ads.length === 0) return null

  return (
    <div
      className="group relative h-full w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {ads.map((ad, i) => (
        <Image
          key={`${ad.url}-${i}`}
          src={ad.url}
          alt={ad.alt}
          fill
          className={`object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          unoptimized
        />
      ))}

      {/* Navigation arrows */}
      {ads.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur transition hover:bg-black/60 group-hover:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur transition hover:bg-black/60 group-hover:opacity-100"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {ads.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {ads.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
