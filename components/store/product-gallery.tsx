"use client"

import { useEffect, useMemo, useState } from "react"
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

  useEffect(() => {
    if (galleryImages.length && activeIndex > galleryImages.length - 1) {
      setActiveIndex(galleryImages.length - 1)
    }
  }, [activeIndex, galleryImages])

  const markFailed = (img: string) =>
    setFailedImages((prev) => (prev.includes(img) ? prev : [...prev, img]))

  const goPrev = () =>
    setActiveIndex((i) => (i === 0 ? galleryImages.length - 1 : i - 1))

  const goNext = () =>
    setActiveIndex((i) => (i === galleryImages.length - 1 ? 0 : i + 1))

  return (
    <div className="flex flex-col gap-2 p-2 sm:gap-4 sm:p-4">
      {/* Main image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem]">
        {activeImage ? (
          <StoreImage
            src={activeImage}
            alt={name}
            fill
            className="object-contain"
            onImageError={() => markFailed(activeImage)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 text-slate-300 sm:h-16 sm:w-16" />
              <p className="mt-2 text-sm font-semibold">Sin imagen</p>
            </div>
          </div>
        )}

        {hasMultiple && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(15,23,42,0.12)_100%)]" />
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-md backdrop-blur transition hover:bg-white sm:left-4 sm:h-11 sm:w-11"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-md backdrop-blur transition hover:bg-white sm:right-4 sm:h-11 sm:w-11"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <span>{activeIndex + 1}</span>
              <span className="text-white/50">/</span>
              <span>{galleryImages.length}</span>
            </div>
          </>
        )}
      </div>

      {/* Thumbnails — horizontal scroll on mobile, grid on sm+ */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
          {galleryImages.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition sm:h-auto sm:w-auto sm:rounded-[1.25rem] ${
                activeIndex === i
                  ? "border-primary shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"
                  : "border-border/70 hover:border-primary/40"
              }`}
            >
              <StoreImage
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
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
