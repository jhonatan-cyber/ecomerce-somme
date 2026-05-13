"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Camera, Check, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return `BOB ${price.toLocaleString("es-CL")}`
}

export function SuggestedProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
      <Link href={`/product/${encodeURIComponent(product.id)}`} scroll className="relative aspect-[4/3] overflow-hidden bg-muted">
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
            <Camera className="h-6 w-6 text-muted-foreground/30" />
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
          className={`mt-0.5 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-bold text-white transition ${
            added
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
              Agregar
            </>
          )}
        </button>
      </div>
    </div>
  )
}
