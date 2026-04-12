"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"
import { ShoppingCart, Camera, Eye, Wifi, Shield } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface ProductCardProps {
  product: Product
  onCompareToggle?: (productId: string) => void
  isComparing?: boolean
}

export function ProductCard({ product, onCompareToggle, isComparing = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast({
        title: "Sin stock",
        description: "Este producto no está disponible",
        variant: "destructive",
      })
    } else {
      addItem(product)
      toast({
        title: "Producto añadido",
        description: `${product.name} ha sido añadido al carrito`,
      })
    }
  }

  const handleCompareToggle = () => {
    onCompareToggle?.(product.id)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-camera-border hover:border-camera-accent/30">
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 text-camera-charcoal">{product.name}</h3>
            <button
              onClick={handleCompareToggle}
              className={`p-2 rounded-lg border transition-colors ${
                isComparing 
                  ? 'bg-camera-accent text-white border-camera-accent' 
                  : 'bg-card text-muted-foreground border-camera-border hover:border-camera-accent/50'
              }`}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          
          {/* Technical Specifications */}
          <div className="space-y-1 mb-3">
            {product.resolution && (
              <div className="flex items-center gap-2 text-sm">
                <Camera className="h-3 w-3 text-camera-accent" />
                <span className="text-muted-foreground">Resolución:</span>
                <span className="font-medium text-camera-charcoal">{product.resolution}</span>
              </div>
            )}
            {product.night_vision && (
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-3 w-3 text-camera-accent" />
                <span className="text-muted-foreground">Visión nocturna</span>
                <Shield className="h-3 w-3 text-green-600" />
              </div>
            )}
            {product.weather_resistance && (
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-3 w-3 text-camera-accent" />
                <span className="text-muted-foreground">Resistencia:</span>
                <span className="font-medium text-camera-charcoal">{product.weather_resistance}</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-camera-accent">
            ${product.price.toLocaleString()}
          </span>
          <span className={`text-sm font-medium ${
            product.stock > 0 ? 'text-green-600' : 'text-destructive'
          }`}>
            {product.stock > 0 ? `${product.stock} unidades` : "Agotado"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="w-full bg-camera-accent hover:bg-camera-accent/90 text-white"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Añadir al carrito
        </Button>
      </CardFooter>
    </Card>
  )
}
