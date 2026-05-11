"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Camera, Clock, Flame } from "lucide-react"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return price.toLocaleString("es-CL")
}

function formatExpiry(dateStr: string): { label: string; urgent: boolean } {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return { label: "Vence hoy", urgent: true }
  if (diffDays === 1) return { label: "Vence mañana", urgent: true }
  if (diffDays <= 3) return { label: `${diffDays} días restantes`, urgent: true }
  if (diffDays <= 7) return { label: `${diffDays} días`, urgent: false }
  return {
    label: date.toLocaleDateString("es-CL", { day: "numeric", month: "short" }),
    urgent: false,
  }
}

function HeroCard({ product }: { product: Product }) {
  const images = [product.image_url, ...(product.images ?? [])]
    .filter((img): img is string => Boolean(img))
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  const expiry = product.saleEndDate ? formatExpiry(product.saleEndDate) : null

  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg transition hover:shadow-2xl sm:rounded-[2rem]"
    >
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9] lg:aspect-[2/1]">
        {/* Images with crossfade */}
        {images.length > 0 ? (
          images.map((src, i) => (
            <Image
              key={`${product.id}-${i}`}
              src={src}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-700 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              unoptimized
            />
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <Camera className="h-12 w-12 text-slate-600 sm:h-20 sm:w-20" />
          </div>
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Discount badge */}
        <div className="absolute left-3 top-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 px-2.5 py-1.5 shadow-xl shadow-red-500/30 sm:left-5 sm:top-5 sm:rounded-2xl sm:px-4 sm:py-2">
          <p className="text-lg font-black text-white sm:text-2xl">-{product.discountPercent}%</p>
        </div>

        {/* Brand logo */}
        {product.brandLogo && (
          <div className="absolute right-3 top-3 overflow-hidden rounded-lg bg-white/95 px-2 py-1 shadow-md backdrop-blur sm:right-5 sm:top-5 sm:rounded-xl sm:px-3 sm:py-1.5">
            <Image
              src={product.brandLogo}
              alt={product.brand || "Marca"}
              width={64}
              height={24}
              className="h-4 w-auto object-contain sm:h-5"
              unoptimized
            />
          </div>
        )}

        {/* Image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1 sm:bottom-5 sm:left-5">
            {images.slice(0, 5).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 lg:p-6">
          {product.category && (
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/70 sm:text-xs">
              {product.category}
            </p>
          )}
          <h3 className="line-clamp-2 text-base font-black text-white sm:text-xl lg:text-2xl xl:text-3xl">
            {product.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-3 sm:gap-3">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              {product.originalPrice && (
                <span className="text-xs text-white/60 line-through sm:text-sm">
                  ${formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-xl font-black text-white sm:text-2xl lg:text-3xl">
                ${formatPrice(product.price)}
              </span>
            </div>

            {product.originalPrice && (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 backdrop-blur sm:px-3 sm:py-1 sm:text-xs">
                Ahorras ${formatPrice(product.originalPrice - product.price)}
              </span>
            )}

            {expiry && (
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs ${
                expiry.urgent
                  ? "bg-red-500/30 text-red-200"
                  : "bg-white/10 text-white/80"
              }`}>
                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {expiry.label}
              </span>
            )}
          </div>

          <div className="mt-3 flex justify-end sm:mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-lg transition group-hover:bg-yellow-400 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm">
              Ver oferta
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function OnSaleSection({ products }: { products: Product[] }) {
  const onSaleProducts = products.filter((p) => p.onSale).slice(0, 7)

  if (onSaleProducts.length === 0) return null

  const [hero, ...rest] = [...onSaleProducts].sort(
    (a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0)
  )

  return (
    <section data-tour="on-sale" id="ofertas" className="container mx-auto px-4 pt-10">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-md shadow-red-500/30">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-2xl font-black text-foreground sm:text-3xl">
              Ofertas especiales
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {onSaleProducts.length} producto{onSaleProducts.length !== 1 ? "s" : ""} con descuento por tiempo limitado
          </p>
        </div>
        <Link
          href="/promotions"
          className="hidden items-center gap-2 rounded-full border border-orange-200 bg-[linear-gradient(135deg,#fff7ed_0%,#fff1f2_100%)] px-4 py-2 text-sm font-bold text-orange-700 shadow-[0_12px_30px_-24px_rgba(249,115,22,0.8)] transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_18px_34px_-22px_rgba(249,115,22,0.9)] sm:flex"
        >
          Ver todas las ofertas <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <HeroCard product={hero} />

        {/* Side grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {rest.slice(0, 4).map((product) => {
              const expiry = product.saleEndDate ? formatExpiry(product.saleEndDate) : null
              return (
                <Link
                  key={product.id}
                  href={`/product/${encodeURIComponent(product.id)}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {/* Discount badge */}
                    {product.discountPercent && (
                      <div className="absolute left-1.5 top-1.5 z-10 rounded-lg bg-red-500 px-2 py-1 shadow sm:left-2 sm:top-2">
                        <p className="text-[10px] font-black text-white">-{product.discountPercent}%</p>
                      </div>
                    )}

                    {/* Brand logo */}
                    {product.brandLogo && (
                      <div className="absolute right-1.5 top-1.5 z-10 overflow-hidden rounded-md bg-white/95 px-1.5 py-1 shadow backdrop-blur sm:right-2 sm:top-2 sm:px-2 sm:py-1">
                        <Image
                          src={product.brandLogo}
                          alt={product.brand || "Marca"}
                          width={50}
                          height={20}
                          className="h-4 w-auto object-contain sm:h-4"
                          unoptimized
                        />
                      </div>
                    )}

                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1.5 p-3">
                    <p className="line-clamp-2 text-xs font-semibold leading-tight text-foreground">
                      {product.name}
                    </p>
                    <div className="mt-auto space-y-0.5">
                      {product.originalPrice && (
                        <p className="text-[10px] text-muted-foreground line-through">
                          ${formatPrice(product.originalPrice)}
                        </p>
                      )}
                      <p className="text-sm font-black text-red-600 dark:text-red-400">
                        ${formatPrice(product.price)}
                      </p>
                    </div>

                    {/* Savings badge */}
                    {product.originalPrice && (
                      <div className="rounded-md bg-emerald-50 px-2 py-1 dark:bg-emerald-500/10">
                        <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                          Ahorras ${formatPrice(product.originalPrice - product.price)}
                        </p>
                      </div>
                    )}

                    {/* Expiry */}
                    {product.saleEndDate ? (
                      <div className={`flex items-center gap-1 rounded-md px-2 py-1 ${
                        expiry?.urgent ? "bg-red-50 dark:bg-red-500/10" : "bg-muted/60"
                      }`}>
                        <Clock className={`h-2.5 w-2.5 shrink-0 ${expiry?.urgent ? "text-red-500" : "text-amber-500"}`} />
                        <p className={`text-[9px] font-bold ${expiry?.urgent ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
                          Válido hasta: {new Date(product.saleEndDate).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
                        <Clock className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                        <p className="text-[9px] font-bold text-muted-foreground">
                          Promoción sin fecha límite
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Mobile CTA */}
      <div className="mt-4 sm:hidden">
        <Link
          href="/promotions"
          className="flex items-center justify-center gap-2 rounded-full border border-orange-200 bg-[linear-gradient(135deg,#fff7ed_0%,#fff1f2_100%)] py-3 text-sm font-bold text-orange-700 shadow-[0_12px_30px_-24px_rgba(249,115,22,0.8)] transition hover:border-orange-300 hover:shadow-[0_18px_34px_-22px_rgba(249,115,22,0.9)]"
        >
          Ver todas las ofertas <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
