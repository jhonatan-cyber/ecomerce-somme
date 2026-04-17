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
      className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-lg transition hover:shadow-2xl"
    >
      <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[2/1]">
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
            <Camera className="h-20 w-20 text-slate-600" />
          </div>
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Discount badge */}
        <div className="absolute left-5 top-5 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 px-4 py-2 shadow-xl shadow-red-500/30">
          <p className="text-2xl font-black text-white">-{product.discountPercent}%</p>
        </div>

        {/* Brand logo */}
        {product.brandLogo && (
          <div className="absolute right-5 top-5 overflow-hidden rounded-xl bg-white/95 px-3 py-1.5 shadow-md backdrop-blur">
            <Image
              src={product.brandLogo}
              alt={product.brand || "Marca"}
              width={64}
              height={24}
              className="h-5 w-auto object-contain"
              unoptimized
            />
          </div>
        )}

        {/* Image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-5 left-5 flex gap-1">
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
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          {product.category && (
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">
              {product.category}
            </p>
          )}
          <h3 className="line-clamp-2 text-xl font-black text-white sm:text-2xl lg:text-3xl">
            {product.name}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-baseline gap-2">
              {product.originalPrice && (
                <span className="text-sm text-white/60 line-through">
                  ${formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-3xl font-black text-white">
                ${formatPrice(product.price)}
              </span>
            </div>

            {product.originalPrice && (
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur">
                Ahorras ${formatPrice(product.originalPrice - product.price)}
              </span>
            )}

            {expiry && (
              <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur ${
                expiry.urgent
                  ? "bg-red-500/30 text-red-200"
                  : "bg-white/10 text-white/80"
              }`}>
                <Clock className="h-3 w-3" />
                {expiry.label}
              </span>
            )}
          </div>

          <div className="mt-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition group-hover:bg-yellow-400">
              Ver oferta
              <ArrowRight className="h-4 w-4" />
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
    <section id="ofertas" className="container mx-auto px-4 pt-10">
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
          href="/catalog"
          className="hidden items-center gap-1.5 text-sm font-semibold text-primary transition hover:underline sm:flex"
        >
          Ver catálogo <ArrowRight className="h-4 w-4" />
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
                      <div className="absolute left-2 top-2 z-10 rounded-lg bg-red-500 px-2 py-1 shadow">
                        <p className="text-[10px] font-black text-white">-{product.discountPercent}%</p>
                      </div>
                    )}

                    {/* Brand logo */}
                    {product.brandLogo && (
                      <div className="absolute right-2 top-2 z-10 overflow-hidden rounded-md bg-white/95 px-2 py-0.5 shadow backdrop-blur">
                        <Image
                          src={product.brandLogo}
                          alt={product.brand || "Marca"}
                          width={48}
                          height={18}
                          className="h-3.5 w-auto object-contain"
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
          href="/catalog"
          className="flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-foreground transition hover:bg-muted/60"
        >
          Ver todas las ofertas <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
