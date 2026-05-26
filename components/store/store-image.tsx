"use client"

import { useState, useCallback } from "react"
import Image, { type ImageProps } from "next/image"
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"

type StoreImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined
  alt: string
  fallbackText?: string
  fallbackClassName?: string
  fallbackTextClassName?: string
  showFallbackIcon?: boolean
  onImageError?: () => void
}

export function StoreImage({
  src,
  alt,
  fallbackText = "Sin imagen",
  fallbackClassName,
  fallbackTextClassName,
  showFallbackIcon = true,
  onImageError,
  className,
  priority = false,
  ...props
}: StoreImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleError = useCallback(() => {
    setHasError(true)
    setIsLoading(false)
    onImageError?.()
  }, [onImageError])

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-muted-foreground",
          fallbackClassName,
        )}
      >
        <div className="text-center">
          {showFallbackIcon ? <Camera className="mx-auto h-10 w-10 text-slate-400" /> : null}
          <p className={cn("mt-2 text-sm font-medium", fallbackTextClassName)}>{fallbackText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-muted">
          <div
            className="absolute inset-0 animate-[shimmer_1.5s_ease-in-out_infinite]"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
            }}
          />
        </div>
      )}
      <Image
        {...props}
        src={src}
        alt={alt}
        priority={priority}
        unoptimized
        className={cn(className, isLoading && "opacity-0")}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
