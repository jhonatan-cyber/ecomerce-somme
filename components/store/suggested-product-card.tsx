"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { Camera, Check, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return `BOB ${price.toLocaleString("es-CL")}`
}

function getProductImages(product: Product) {
  const values = [product.image_url, ...(product.images ?? [])]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim())
    .filter(Boolean)
  return Array.from(new Set(values))
}

export function SuggestedProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [added, setAdded] = useState(false)
  const outOfStock = product.stock <= 0

  const images = getProductImages(product)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasMultiple = images.length > 1

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

  function startSlide() {
    if (!hasMultiple || !emblaApi) return
    stopSlide()
    intervalRef.current = setInterval(() => {
      emblaApi.scrollNext()
    }, 2500)
  }

  function stopSlide() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    emblaApi?.scrollTo(0)
  }

  useEffect(() => () => stopSlide(), [])

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) {
      toast({
        title: "Producto agotado",
        description: "Este producto no tiene stock disponible por ahora.",
        variant: "destructive",
      })
      return
    }
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    toast({
      title: "Agregado al carrito",
      description: product.name,
    })
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      {/* Image */}
      <Link
        href={`/product/${encodeURIComponent(product.id)}`}
        scroll
        className="relative aspect-[4/3] overflow-hidden bg-muted"
        onMouseEnter={startSlide}
        onMouseLeave={stopSlide}
      >
        {product.brandLogo && (
          <div className="absolute right-1.5 top-1.5 z-10 overflow-hidden rounded-md bg-white/95 px-1.5 py-1 shadow backdrop-blur sm:px-2 sm:py-1">
            <Image
              src={product.brandLogo}
              alt={product.brand || "Marca"}
              width={50}
              height={20}
              className="h-4 w-auto object-contain"
              unoptimized
            />
          </div>
        )}
        {product.onSale && product.discountPercent && (
          <div className="absolute left-1.5 top-1.5 z-10 rounded-md bg-red-500 px-1.5 py-0.5">
            <p className="text-[9px] font-black text-white sm:text-[10px]">-{product.discountPercent}%</p>
          </div>
        )}
        {outOfStock && (
          <div className="absolute left-1.5 bottom-1.5 z-10 rounded-md bg-red-600 px-2 py-0.5">
            <p className="text-[9px] font-black uppercase tracking-wide text-white sm:text-[10px]">Agotado</p>
          </div>
        )}
        {images.length > 0 ? (
          <div ref={emblaRef} className="h-full w-full">
            <div className="flex h-full touch-pan-y">
              {images.map((src, i) => (
                <div
                  key={src}
                  className="relative h-full w-full min-w-0 shrink-0 grow-0 basis-full"
                >
                  <Image
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Camera className="h-6 w-6 text-muted-foreground/30" />
          </div>
        )}
        {hasMultiple && (
          <div className="absolute bottom-1.5 right-1.5 flex gap-1 z-10">
            {images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  emblaApi?.scrollTo(i)
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-2 bg-white" : "w-1 bg-white/50"
                }`}
                aria-label={`Ver imagen ${i + 1} de ${images.length}`}
              />
            ))}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <Link
          href={`/product/${encodeURIComponent(product.id)}`}
          scroll
          className="line-clamp-2 text-[11px] font-semibold leading-snug text-foreground transition hover:text-primary sm:text-xs"
        >
          {product.name}
        </Link>

        {product.onSale && product.originalPrice ? (
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-red-500 line-through">
              Antes {formatPrice(product.originalPrice)}
            </span>
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              Ahora {formatPrice(product.price)}
            </p>
          </div>
        ) : (
          <p className="text-sm font-black text-primary">
            {formatPrice(product.price)}
          </p>
        )}

        {/* Add to cart button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className={`mt-0.5 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-bold text-white transition ${
            outOfStock
              ? "cursor-not-allowed bg-slate-400/80 text-white/90"
              : added
              ? "bg-emerald-500 shadow-sm shadow-emerald-500/25"
              : "bg-gradient-to-r from-slate-800 to-blue-700 hover:from-slate-700 hover:to-blue-600 active:scale-[0.97]"
          }`}
        >
          {added ? (
            <>
              <Check className="h-3 w-3" />
              Agregado
            </>
          ) : (
            <>
              <ShoppingCart className="h-3 w-3" />
              {outOfStock ? "Agotado" : "Agregar"}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
