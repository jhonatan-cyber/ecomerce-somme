"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"

export function ProductCardActions({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [isWished, setIsWished] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
    toast({
      title: "Agregado al carrito",
      description: product.name,
    })
  }

  const handleWishToggle = () => {
    const next = !isWished
    setIsWished(next)
    toast({
      title: next ? "Guardado" : "Eliminado",
      description: next ? `${product.name} guardado para después.` : `${product.name} eliminado.`,
    })
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Wishlist */}
      <button
        type="button"
        onClick={handleWishToggle}
        aria-label={isWished ? `Quitar ${product.name} de guardados` : `Guardar ${product.name}`}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
          isWished
            ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400"
            : "border-border bg-background text-muted-foreground hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
        }`}
      >
        <Heart className={`h-3.5 w-3.5 ${isWished ? "fill-current" : ""}`} />
      </button>

      {/* Add to cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        aria-label={`Agregar ${product.name} al carrito`}
        className={`flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-bold text-white transition-all sm:px-3 ${
          justAdded
            ? "bg-emerald-500 shadow-md shadow-emerald-500/25"
            : "bg-gradient-to-r from-slate-900 to-blue-700 shadow-md shadow-primary/20 hover:opacity-90 dark:from-blue-700 dark:to-blue-600"
        }`}
      >
        {justAdded ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Listo
          </>
        ) : (
          <>
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Agregar</span>
          </>
        )}
      </button>
    </div>
  )
}
