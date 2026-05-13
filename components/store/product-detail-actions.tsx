"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"

export function ProductDetailActions({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [justAdded, setJustAdded] = useState(false)

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
    <div className="mt-5 flex gap-1.5 sm:gap-2">
      <button
        data-tour="add-to-cart"
        type="button"
        onClick={handleAddToCart}
        className={`inline-flex h-10 flex-1 items-center justify-center gap-1 rounded-lg px-2 text-xs font-bold text-white transition sm:h-12 sm:gap-2 sm:rounded-2xl sm:px-5 sm:text-sm ${
          justAdded
            ? "bg-emerald-500 shadow-md shadow-emerald-500/25"
            : "bg-gradient-to-r from-slate-900 to-blue-700 shadow-md shadow-primary/20 hover:opacity-90"
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
            Agregar
          </>
        )}
      </button>

      <Link
        href="/cart"
        className="inline-flex h-10 flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-foreground transition hover:bg-muted/60 sm:h-12 sm:gap-2 sm:rounded-2xl sm:px-5 sm:text-sm"
      >
        <ShoppingCart className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        Carrito
      </Link>

      <Link
        href="/catalog"
        className="inline-flex h-10 flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-muted-foreground transition hover:text-primary sm:h-12 sm:gap-2 sm:rounded-2xl sm:px-5 sm:text-sm"
      >
        Explorar
        <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
      </Link>
    </div>
  )
}
