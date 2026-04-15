import { Loader2 } from "lucide-react"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  error?: string
}

export function ProductGrid({ products, loading, error }: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando productos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card py-20 text-center">
        <div className="mb-2 text-lg text-destructive">Error al cargar productos</div>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card py-20 text-center">
        <div className="mb-4 text-lg text-muted-foreground">No hay productos disponibles</div>
        <p className="text-sm text-muted-foreground">
          Contacta con nuestro equipo de ventas para mas opciones
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
