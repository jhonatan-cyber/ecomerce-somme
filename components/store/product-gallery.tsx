"use client"

import { useEffect, useMemo, useState } from "react"
import { Camera, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StoreImage } from "@/components/store/store-image"

interface ProductGalleryProps {
  name: string
  imageUrl: string | null
  images?: string[]
}

export function ProductGallery({ name, imageUrl, images = [] }: ProductGalleryProps) {
  const [failedImages, setFailedImages] = useState<string[]>([])

  const galleryImages = useMemo(() => {
    const merged = [imageUrl, ...images].filter((value): value is string => Boolean(value))
    return Array.from(new Set(merged)).filter((image) => !failedImages.includes(image))
  }, [failedImages, imageUrl, images])

  const hasImages = galleryImages.length > 0
  const hasMultipleImages = galleryImages.length > 1
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = hasImages ? galleryImages[activeIndex] : null

  useEffect(() => {
    if (!galleryImages.length) {
      if (activeIndex !== 0) {
        setActiveIndex(0)
      }
      return
    }

    if (activeIndex > galleryImages.length - 1) {
      setActiveIndex(galleryImages.length - 1)
    }
  }, [activeIndex, galleryImages])

  const markImageAsFailed = (image: string) => {
    setFailedImages((current) => (current.includes(image) ? current : [...current, image]))
  }

  const goPrevious = () => {
    setActiveIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1))
  }

  const goNext = () => {
    setActiveIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1))
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_100%)]">
        {activeImage ? (
          <StoreImage
            src={activeImage}
            alt={name}
            fill
            className="object-contain p-6"
            priority
            onImageError={() => markImageAsFailed(activeImage)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-muted-foreground">
            <div className="text-center">
              <Camera className="mx-auto h-16 w-16 text-slate-400" />
              <p className="mt-3 text-sm font-semibold">Sin imagen disponible</p>
            </div>
          </div>
        )}

        {hasMultipleImages ? (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0)_40%,rgba(15,23,42,0.16)_100%)]" />
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={goPrevious}
              className="absolute left-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border border-white/70 bg-white/90 shadow-lg backdrop-blur"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={goNext}
              className="absolute right-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full border border-white/70 bg-white/90 shadow-lg backdrop-blur"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <span>{activeIndex + 1}</span>
              <span className="text-white/60">/</span>
              <span>{galleryImages.length}</span>
            </div>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-[1.25rem] border transition ${
                activeIndex === index
                  ? "border-primary shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                  : "border-border/70 hover:border-primary/40"
              }`}
            >
              <StoreImage
                src={image}
                alt={`${name} ${index + 1}`}
                fill
                className="object-cover"
                fallbackText=""
                showFallbackIcon={false}
                fallbackClassName="bg-slate-100"
                onImageError={() => markImageAsFailed(image)}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
