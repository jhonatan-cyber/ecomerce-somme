import { Loader2, PackageSearch } from "lucide-react"
import { ProductCard } from "./product-card"
import { ProductGridSkeleton } from "./product-card-skeleton"
import { LoadingSpinnerCentered } from "@/components/ui/loading-spinner"
import type { Product, Brand } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  error?: string
  brands?: Brand[]
}

export function ProductGrid({ products, loading, error, brands }: ProductGridProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSpinnerCentered size="md" />
        <ProductGridSkeleton count={8} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 py-20 text-center">
        <p className="text-base font-semibold text-destructive">Error al cargar productos</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 py-24 text-center">
        <PackageSearch className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-base font-semibold text-muted-foreground">Sin productos disponibles</p>
        <p className="text-sm text-muted-foreground/70">
          Contacta con nuestro equipo de ventas para más opciones
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} brands={brands} />
      ))}
    </div>
  )
}
