"use client"

import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  error?: string
}

export function ProductGrid({ products, loading, error }: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-camera-accent" />
        <span className="ml-2 text-muted-foreground">Cargando productos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-card rounded-2xl border border-camera-border">
        <div className="text-destructive text-lg mb-2">Error al cargar productos</div>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-card rounded-2xl border border-camera-border">
        <div className="text-muted-foreground text-lg mb-4">No hay productos disponibles</div>
        <p className="text-muted-foreground text-sm">
          Contacta con nuestro equipo de ventas para más opciones
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
