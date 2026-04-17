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
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={handleAddToCart}
        className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition sm:w-auto sm:rounded-2xl sm:px-6 ${
          justAdded
            ? "bg-emerald-500 shadow-md shadow-emerald-500/25"
            : "bg-gradient-to-r from-slate-900 to-blue-700 shadow-md shadow-primary/20 hover:opacity-90"
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
        href="/cart"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold text-foreground transition hover:bg-muted/60 sm:w-auto sm:rounded-2xl sm:px-6"
      >
        <ShoppingCart className="h-4 w-4" />
        Ir al carrito
      </Link>

      <Link
        href="/catalog"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold text-muted-foreground transition hover:text-primary sm:w-auto sm:rounded-2xl sm:px-6"
      >
        Seguir explorando
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
