"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Clock3, ShoppingCart, Tag } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

function getSaleDeadlineLabel(dateValue: string | null | undefined) {
  if (!dateValue) return "Oferta sin fecha límite visible"

  const target = new Date(dateValue)
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return "Termina hoy"
  if (diffDays === 1) return "Termina mañana"
  if (diffDays <= 6) return `${diffDays} días restantes`

  return `Vigente hasta ${target.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  })}`
}

function getSavings(product: Product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0
  return product.originalPrice - product.price
}

function getPrimaryImage(product: Product) {
  return [product.image_url, ...(product.images ?? [])].find(Boolean) ?? null
}

export function PromotionProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [justAdded, setJustAdded] = useState(false)

  const image = getPrimaryImage(product)
  const savings = getSavings(product)
  const deadline = getSaleDeadlineLabel(product.saleEndDate)

  const handleAddToCart = () => {
    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
    toast({
      title: "Agregado al carrito",
      description: product.name,
    })
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_50px_-35px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_24px_60px_-30px_rgba(249,115,22,0.25)]">
      <Link
        href={`/product/${encodeURIComponent(product.id)}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#fff7ed_0%,#f8fafc_100%)]"
      >
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : null}
        <div className="absolute left-3 top-3 rounded-xl bg-red-500 px-2.5 py-1.5 text-white shadow-lg shadow-red-500/30">
          <p className="text-xs font-black">-{product.discountPercent ?? 0}%</p>
        </div>
        <div className="absolute right-3 top-3 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700 backdrop-blur">
          {product.category ?? "Oferta"}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {product.brand ?? "Selección Somme"}
            </p>
            <Link href={`/product/${encodeURIComponent(product.id)}`}>
              <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight text-slate-900 transition-colors group-hover:text-orange-600">
                {product.name}
              </h3>
            </Link>
          </div>
          {product.brandLogo ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-2 py-1.5">
              <Image
                src={product.brandLogo}
                alt={product.brand ?? "Marca"}
                width={58}
                height={22}
                className="h-5 w-auto object-contain"
                unoptimized
              />
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
            <Tag className="h-3.5 w-3.5" />
            Ahorras ${formatPrice(savings || 0)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            <Clock3 className="h-3.5 w-3.5" />
            {deadline}
          </span>
        </div>

        <div className="mt-6">
          {product.originalPrice ? (
            <p className="text-sm text-slate-400 line-through">${formatPrice(product.originalPrice)}</p>
          ) : null}
          <p className="text-2xl font-black text-slate-900">${formatPrice(product.price)}</p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold text-white transition ${
              justAdded
                ? "bg-emerald-500 shadow-md shadow-emerald-500/25"
                : "bg-slate-950 shadow-[0_16px_40px_-20px_rgba(15,23,42,0.8)] hover:bg-orange-500"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" />
                Agregado
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Agregar al carrito
              </>
            )}
          </button>

          <Link
            href={`/product/${encodeURIComponent(product.id)}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-800 transition hover:border-orange-300 hover:text-orange-600"
          >
            Ver detalle
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
