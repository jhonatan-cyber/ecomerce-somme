"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Product } from "@/lib/types"

export function ProductCardActions({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [justAdded, setJustAdded] = useState(false)
  const outOfStock = product.stock <= 0

  const handleAddToCart = () => {
    if (outOfStock) {
      toast({
        title: "Producto agotado",
        description: "Este producto no tiene stock disponible por ahora.",
        variant: "destructive",
      })
      return
    }

    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
    toast({
      title: "Agregado al carrito",
      description: product.name,
    })
  }

  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          aria-label={`Agregar ${product.name} al carrito`}
          title={`Agregar ${product.name} al carrito`}
          className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white transition-all ${
            outOfStock
              ? "cursor-not-allowed bg-slate-400/80 text-white/90"
              : "hover:scale-105 hover:shadow-lg cursor-pointer"
          } ${
            outOfStock
              ? ""
              : justAdded
                ? "bg-emerald-500 shadow-md shadow-emerald-500/25"
                : "bg-gradient-to-r from-slate-900 to-blue-700 shadow-md shadow-primary/20 hover:opacity-90 dark:from-blue-700 dark:to-blue-600"
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Ok</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">{outOfStock ? "Agotado" : "Agregar"}</span>
            </>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {outOfStock ? "Agotado (sin stock)" : "Agregar al carrito"}
      </TooltipContent>
    </Tooltip>
  )
}
