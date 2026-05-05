"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Camera } from "lucide-react"

interface ProductCardImageProps {
  images: string[]
  name: string
  brandLogo: string | null
  brand: string | null
  inStock: boolean
  lowStock: boolean
  discountPercent?: number | null
  onSale?: boolean
}

export function ProductCardImage({
  images,
  name,
  brandLogo,
  brand,
  inStock,
  lowStock,
  discountPercent,
  onSale,
}: ProductCardImageProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasMultiple = images.length > 1

  function startSlide() {
    if (!hasMultiple) return
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length)
    }, 900)
  }

  function stopSlide() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setActiveIndex(0)
  }

  // cleanup on unmount
  useEffect(() => () => stopSlide(), [])

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800"
      onMouseEnter={startSlide}
      onMouseLeave={stopSlide}
    >
      {images.length > 0 ? (
        <>
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`${name} ${i + 1}`}
              fill
              sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
              className={`object-cover transition-opacity duration-300 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              unoptimized
              priority={i === 0}
            />
          ))}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Camera className="h-14 w-14 text-slate-300 dark:text-slate-600" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Top badges */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2 sm:p-2.5">
        {brandLogo ? (
          <div className="overflow-hidden rounded-md bg-white/95 px-1.5 py-1 shadow-sm backdrop-blur-sm sm:px-2 sm:py-1">
            <Image
              src={brandLogo}
              alt={brand || "Marca"}
              width={56}
              height={20}
              className="h-4 w-auto object-contain sm:h-4"
              unoptimized
            />
          </div>
        ) : (
          <span />
        )}

        {onSale && discountPercent && inStock ? (
          <span className="rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-2 py-1 text-[10px] font-black text-white shadow-md">
            -{discountPercent}%
          </span>
        ) : lowStock ? (
          <span className="rounded-lg bg-amber-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            Últimas unidades
          </span>
        ) : null}
      </div>

      {/* Slide dots */}
      {hasMultiple && (
        <div className="absolute bottom-2 right-2 flex gap-1">
          {images.slice(0, 5).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-3 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
