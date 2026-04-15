"use client"

import Link from "next/link"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"

interface ProductDetailActionsProps {
  product: Product
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: "Producto anadido",
      description: `${product.name} fue agregado al carrito.`,
    })
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Button
        onClick={handleAddToCart}
        className="rounded-2xl px-6"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Anadir al carrito
      </Button>
      <Button asChild variant="outline" className="rounded-2xl px-6">
        <Link href="/cart">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ir al carrito
        </Link>
      </Button>
      <Button asChild variant="outline" className="rounded-2xl px-6">
        <Link href="/#catalogo">
          <ArrowRight className="mr-2 h-4 w-4" />
          Seguir explorando
        </Link>
      </Button>
    </div>
  )
}
