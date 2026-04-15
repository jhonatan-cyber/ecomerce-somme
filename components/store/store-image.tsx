"use client"

import { useState } from "react"
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
  ...props
}: StoreImageProps) {
  const [hasError, setHasError] = useState(false)

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
    <Image
      {...props}
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        setHasError(true)
        onImageError?.()
      }}
    />
  )
}
