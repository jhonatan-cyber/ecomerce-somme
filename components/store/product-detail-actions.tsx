"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Check, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed"
import type { Product } from "@/lib/types"

export function ProductDetailActions({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addItem)
  const { toast } = useToast()
  const [justAdded, setJustAdded] = useState(false)
  const outOfStock = product.stock <= 0

  useEffect(() => {
    addRecentlyViewed({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
      category: product.category,
    })
  }, [product.id, product.name, product.price, product.image_url, product.stock, product.category, addRecentlyViewed])

  const handleAddToCart = () => {
    if (outOfStock) {
      toast({
        title: "Producto agotado",
        description: "Este producto no tiene stock disponible por ahora.",
        variant: "destructive",
      })
      return
    }

    const added = addItem(product)
    if (!added) {
      toast({
        title: "Stock máximo alcanzado",
        description: `Ya agregaste todo el stock disponible de ${product.name}.`,
        variant: "destructive",
      })
      return
    }

    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
    toast({
      title: "Agregado al carrito",
      description: product.name,
    })
  }

  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
      <button
        data-tour="add-to-cart"
        type="button"
        onClick={handleAddToCart}
        disabled={outOfStock}
        className={`col-span-2 inline-flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-bold text-white transition sm:col-span-1 sm:h-12 sm:gap-2 sm:rounded-2xl sm:px-5 sm:text-sm ${
          outOfStock
            ? "cursor-not-allowed bg-slate-400/80 text-white/90"
            : justAdded
            ? "bg-emerald-500"
            : "bg-primary hover:opacity-90"
        }`}
      >
        {justAdded ? (
          <>
            <Check className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            Agregado
          </>
        ) : (
          <>
            <ShoppingCart className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            {outOfStock ? "Agotado" : "Agregar"}
          </>
        )}
      </button>

      <Link
        href="/cart"
        className="inline-flex h-10 min-w-0 items-center justify-center gap-1 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-foreground transition hover:bg-muted/60 sm:h-12 sm:gap-2 sm:rounded-2xl sm:px-5 sm:text-sm"
      >
        <ShoppingCart className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        Carrito
      </Link>

      <Link
        href="/catalog"
        className="inline-flex h-10 min-w-0 items-center justify-center gap-1 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-muted-foreground transition hover:text-primary sm:h-12 sm:gap-2 sm:rounded-2xl sm:px-5 sm:text-sm"
      >
        Explorar
        <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
      </Link>
    </div>
  )
}
