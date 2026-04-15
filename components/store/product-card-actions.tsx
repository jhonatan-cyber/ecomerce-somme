"use client"

import { useState } from "react"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"

export function ProductCardActions({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [isWished, setIsWished] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: "Producto anadido",
      description: `${product.name} fue agregado al carrito.`,
    })
  }

  const handleWishToggle = () => {
    const nextValue = !isWished
    setIsWished(nextValue)
    toast({
      title: nextValue ? "Guardado en deseo" : "Eliminado de deseo",
      description: nextValue
        ? `${product.name} fue marcado para revisar despues.`
        : `${product.name} se quito de tus productos guardados.`,
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleWishToggle}
        className={`h-9 w-9 rounded-lg ${
          isWished
            ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            : ""
        }`}
        aria-label={isWished ? `Quitar ${product.name} de deseo` : `Agregar ${product.name} a deseo`}
        title={isWished ? "Quitar de deseo" : "Agregar a deseo"}
      >
        <Heart className={`h-4 w-4 ${isWished ? "fill-current" : ""}`} />
      </Button>

      <Button
        type="button"
        size="icon"
        onClick={handleAddToCart}
        className="h-9 w-9 rounded-lg bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] text-white shadow-lg shadow-primary/20 transition hover:opacity-95"
        aria-label={`Agregar ${product.name} al carrito`}
        title="Agregar al carrito"
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    </div>
  )
}
