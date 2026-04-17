"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { Camera, ChevronLeft, ChevronRight } from "lucide-react"
import { StoreImage } from "@/components/store/store-image"

interface ProductGalleryProps {
  name: string
  imageUrl: string | null
  images?: string[]
}

export function ProductGallery({ name, imageUrl, images = [] }: ProductGalleryProps) {
  const [failedImages, setFailedImages] = useState<string[]>([])

  const galleryImages = useMemo(() => {
    const merged = [imageUrl, ...images].filter((v): v is string => Boolean(v))
    return Array.from(new Set(merged)).filter((img) => !failedImages.includes(img))
  }, [failedImages, imageUrl, images])

  const hasImages = galleryImages.length > 0
  const hasMultiple = galleryImages.length > 1
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = hasImages ? galleryImages[activeIndex] : null
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50
    if (diff > threshold) {
      goNext()
    } else if (diff < -threshold) {
      goPrev()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  useEffect(() => {
    console.log('[MOBILE DEBUG] Active index changed to:', activeIndex)
    console.log('[MOBILE DEBUG] Active image:', galleryImages[activeIndex])
    if (galleryImages.length && activeIndex > galleryImages.length - 1) {
      setActiveIndex(galleryImages.length - 1)
    }
  }, [activeIndex, galleryImages])

  const markFailed = (img: string) =>
    setFailedImages((prev) => (prev.includes(img) ? prev : [...prev, img]))

  const goPrev = () => {
    console.log('[MOBILE DEBUG] goPrev clicked, current index:', activeIndex)
    const newIndex = activeIndex === 0 ? galleryImages.length - 1 : activeIndex - 1
    console.log('[MOBILE DEBUG] Setting new index to:', newIndex)
    setActiveIndex(newIndex)
  }

  const goNext = () => {
    console.log('[MOBILE DEBUG] goNext clicked, current index:', activeIndex)
    const newIndex = activeIndex === galleryImages.length - 1 ? 0 : activeIndex + 1
    console.log('[MOBILE DEBUG] Setting new index to:', newIndex)
    setActiveIndex(newIndex)
  }

  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const scrollStartX = useRef(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    dragStartX.current = e.clientX
    scrollStartX.current = thumbnailsRef.current?.scrollLeft ?? 0
    if (thumbnailsRef.current) thumbnailsRef.current.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !thumbnailsRef.current) return
    const diff = e.clientX - dragStartX.current
    thumbnailsRef.current.scrollLeft = scrollStartX.current - diff
  }

  const handleMouseUp = () => {
    isDragging.current = false
    if (thumbnailsRef.current) thumbnailsRef.current.style.cursor = 'grab'
  }

  const handleThumbnailClick = (index: number) => {
    console.log('[MOBILE DEBUG] Thumbnail clicked, index:', index)
    console.log('[MOBILE DEBUG] Current active index:', activeIndex)
    setActiveIndex(index)
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main image */}
      <div
        className="relative w-full overflow-hidden rounded-xl bg-transparent sm:rounded-[1.75rem]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {activeImage ? (
          <img
            src={activeImage}
            alt={name}
            className="aspect-square w-full object-contain sm:aspect-[4/3]"
            onError={() => markFailed(activeImage)}
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 text-slate-300 sm:h-16 sm:w-16" />
              <p className="mt-2 text-sm font-semibold">Sin imagen</p>
            </div>
          </div>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow-xl transition active:scale-90 sm:left-4 sm:h-11 sm:w-11"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-6 w-6 text-slate-900" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow-xl transition active:scale-90 sm:right-4 sm:h-11 sm:w-11"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-6 w-6 text-slate-900" />
            </button>
            
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
              <span>{activeIndex + 1}</span>
              <span className="text-white/50">/</span>
              <span>{galleryImages.length}</span>
            </div>
          </>
        )}

      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div 
          ref={thumbnailsRef}
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            cursor: 'grab',
            userSelect: 'none',
          } as React.CSSProperties}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {galleryImages.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => {
                console.log('[MOBILE DEBUG] Thumbnail button clicked, index:', i)
                handleThumbnailClick(i)
              }}
              className={`relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                activeIndex === i
                  ? "border-primary shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"
                  : "border-border/70 active:border-primary/60"
              }`}
            >
              <StoreImage
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="pointer-events-none object-cover"
                fallbackText=""
                showFallbackIcon={false}
                fallbackClassName="bg-slate-100"
                onImageError={() => markFailed(img)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
