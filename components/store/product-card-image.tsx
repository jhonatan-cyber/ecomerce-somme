"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { Camera, ChevronLeft, ChevronRight } from "lucide-react"

const BLUR_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

interface ProductCardImageProps {
  images: string[]
  name: string
  brandLogo?: string | null
  inStock?: boolean
  lowStock?: boolean
  discountPercent?: number | null
  onSale?: boolean
  isNew?: boolean
}

function SlideImage({ src, name, priority }: { src: string; name: string; priority: boolean }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
        <Camera className="h-14 w-14 text-slate-300 dark:text-slate-600" />
      </div>
    )
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
      )}
      <Image
        src={src}
        alt={name}
        fill
        sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 44vw"
        className={`object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        unoptimized
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  )
}

export function ProductCardImage({
  images,
  name,
  brandLogo,
  inStock,
  lowStock,
  discountPercent,
  onSale,
  isNew,
}: ProductCardImageProps) {
  const hasMultiple = images.length > 1
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false })
  const [activeIndex, setActiveIndex] = useState(0)
  const [showArrows, setShowArrows] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi, onSelect])

  const startAutoPlay = useCallback(() => {
    if (!hasMultiple || !emblaApi) return
    stopAutoPlay()
    intervalRef.current = setInterval(() => {
      if (emblaApi.canScrollNext()) emblaApi.scrollNext()
      else emblaApi.scrollTo(0)
    }, 3500)
  }, [hasMultiple, emblaApi])

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => () => stopAutoPlay(), [stopAutoPlay])

  const renderBadges = () => (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2 sm:p-2.5">
      {brandLogo && !logoError ? (
        <div className="pointer-events-auto overflow-hidden rounded-md bg-white px-1.5 py-1 sm:px-2 sm:py-1">
          <Image
            src={brandLogo}
            alt="Marca"
            width={56}
            height={20}
            className="h-4 w-auto object-contain"
            unoptimized
            onError={() => setLogoError(true)}
          />
        </div>
      ) : (
        <span />
      )}

      {isNew ? (
        <span className="rounded-lg bg-cyan-600 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
          Nuevo
        </span>
      ) : !inStock ? (
        <span className="rounded-lg bg-red-600 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
          Agotado
        </span>
      ) : onSale && discountPercent && inStock ? (
        <span className="rounded-lg bg-red-500 px-2 py-1 text-[10px] font-black text-white">
          -{discountPercent}%
        </span>
      ) : lowStock ? (
        <span className="rounded-lg bg-amber-500 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white sm:px-2 sm:text-[10px]">
          <span className="hidden sm:inline">Últimas unidades</span>
          <span className="sm:hidden">¡Últimas!</span>
        </span>
      ) : null}
    </div>
  )

  const renderDots = () => {
    if (!hasMultiple) return null
    return (
      <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
        {images.slice(0, 5).map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all ${
              i === activeIndex ? "h-1.5 w-3 bg-white" : "h-1.5 w-1.5 bg-white/50"
            }`}
          />
        ))}
        {images.length > 5 && (
          <span className="flex h-1.5 items-center justify-center px-0.5 text-[8px] font-bold text-white/70">
            +{images.length - 5}
          </span>
        )}
      </div>
    )
  }

  const renderArrows = () => {
    if (!hasMultiple || !showArrows) return null
    return (
      <>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); emblaApi?.scrollPrev() }}
          className="pointer-events-auto absolute left-1 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:bg-white sm:h-8 sm:w-8"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="h-4 w-4 text-slate-800" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); emblaApi?.scrollNext() }}
          className="pointer-events-auto absolute right-1 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:bg-white sm:h-8 sm:w-8"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="h-4 w-4 text-slate-800" />
        </button>
      </>
    )
  }

  // Multiple images: carousel
  if (hasMultiple) {
    return (
      <div
        className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900"
        onMouseEnter={() => { setShowArrows(true); startAutoPlay() }}
        onMouseLeave={() => { setShowArrows(false); stopAutoPlay() }}
      >
        <div ref={emblaRef} className="h-full w-full overflow-hidden">
          <div className="flex h-full touch-pan-y">
            {images.map((src, i) => (
              <div
                key={`${name}-${i}`}
                className="relative h-full w-full min-w-0 shrink-0 grow-0 basis-full"
              >
                <SlideImage src={src} name={name} priority={i === 0} />
              </div>
            ))}
          </div>
        </div>
        {renderBadges()}
        {renderArrows()}
        {renderDots()}
      </div>
    )
  }

  // Single image
  const primaryImage = images[0]
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
      {primaryImage ? (
        <SlideImage src={primaryImage} name={name} priority={false} />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Camera className="h-14 w-14 text-slate-300 dark:text-slate-600" />
        </div>
      )}
      {renderBadges()}
    </div>
  )
}
