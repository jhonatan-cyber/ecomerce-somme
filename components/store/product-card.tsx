"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast({
        title: "Sin stock",
        description: "Este producto no está disponible",
        variant: "destructive",
      })
      return
    }

    addItem(product)
    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito`,
    })
  }

  return (
    <Card className="group overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/50">
      <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.svg?height=400&width=400&query=product"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-lg bg-destructive px-4 py-2 rounded-lg">Sin Stock</span>
          </div>
        )}
        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="inline-block text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-lg">
              {product.category}
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-xl leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{product.description}</p>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">MXN</span>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="w-full h-11 font-semibold bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-accent transition-all"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  )
}
