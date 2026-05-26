"use client"

import Link from "next/link"
import { Camera, Check, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return `BOB ${price.toLocaleString("es-BO")}`
}

function getPrimaryImage(product: Product) {
  const values = [product.image_url, ...(product.images ?? [])]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim())
    .filter(Boolean)

  return Array.from(new Set(values))[0] ?? null
}

export function SuggestedProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [added, setAdded] = useState(false)
  const outOfStock = product.stock <= 0
  const image = getPrimaryImage(product)

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
    <article className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card">
      <Link
        href={`/product/${encodeURIComponent(product.id)}`}
        scroll
        className="block bg-muted"
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="block aspect-[4/3] h-auto w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center">
            <Camera className="h-6 w-6 text-muted-foreground/30" />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2.5">
        <div className="flex flex-wrap items-center gap-1">
          {product.brand && (
            <span className="max-w-full truncate text-[10px] font-semibold text-muted-foreground">
              {product.brand}
            </span>
          )}
          {outOfStock ? (
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-black uppercase text-white">
              Agotado
            </span>
          ) : product.onSale && product.discountPercent ? (
            <span className="rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-black text-white">
              -{product.discountPercent}%
            </span>
          ) : null}
        </div>

        <Link
          href={`/product/${encodeURIComponent(product.id)}`}
          scroll
          className="block min-h-[2.5rem] overflow-hidden text-[11px] font-semibold leading-5 text-foreground sm:text-xs"
        >
          {product.name}
        </Link>

        {product.onSale && product.originalPrice ? (
          <div className="flex min-w-0 flex-col">
            <span className="text-[10px] font-medium text-red-500 line-through">
              Antes {formatPrice(product.originalPrice)}
            </span>
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              Ahora {formatPrice(product.price)}
            </p>
          </div>
        ) : (
          <p className="text-sm font-black text-primary">{formatPrice(product.price)}</p>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className={`mt-auto inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-bold text-white transition ${
            outOfStock
              ? "cursor-not-allowed bg-slate-400/80 text-white/90"
              : added
                ? "bg-emerald-500"
                : "bg-primary active:opacity-90"
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
    </article>
  )
}
