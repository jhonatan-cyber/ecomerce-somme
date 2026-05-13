import Link from "next/link"
import { Eye } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { Product, Brand } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { ProductCardActions } from "@/components/store/product-card-actions"
import { ProductCardImage } from "@/components/store/product-card-image"
import { getBrandNameById } from "@/lib/api"

interface ProductCardProps {
  product: Product
  onComparisonToggle?: (productId: string, checked: boolean) => void
  isComparisonEnabled?: boolean
  brands?: Brand[]
  isNew?: boolean
}

function getProductImages(product: Product) {
  const values = [product.image_url, ...(product.images ?? [])]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim())
    .filter(Boolean)
  return Array.from(new Set(values))
}

export function ProductCard({ 
  product, 
  onComparisonToggle, 
  isComparisonEnabled = false,
  brands = [],
  isNew = false
}: ProductCardProps) {
  const productImages = getProductImages(product)
  const inStock = product.stock > 0
  const lowStock = inStock && product.stock <= (product.minimumStock ?? 3)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20">
      {/* Image slider */}
      <Link
        href={`/product/${encodeURIComponent(product.id)}`}
        scroll
        tabIndex={-1}
        aria-hidden="true"
        className="cursor-pointer"
      >
        <ProductCardImage
          images={productImages}
          name={product.name}
          brandLogo={product.brandLogo ?? null}
          inStock={inStock}
          lowStock={lowStock}
          discountPercent={product.discountPercent}
          onSale={product.onSale}
          isNew={isNew}
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-2 sm:p-2.5">
        {/* Brand name fallback + category */}
        <div className="flex items-center gap-1.5">
          {isComparisonEnabled && onComparisonToggle && (
          <div className="rounded-md bg-white/95 p-1.5 shadow-sm backdrop-blur-sm">
            <Checkbox
              checked={false}
              onCheckedChange={(checked) => onComparisonToggle(product.id, checked as boolean)}
              className="data-[state=checked]:bg-camera-accent data-[state=checked]:border-camera-accent"
            />
          </div>
        )}
          {!product.brandLogo && brands && product.brandId && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              {getBrandNameById(brands, product.brandId)}
            </span>
          )}
          {product.category && (
            <span className="text-[10px] font-medium text-muted-foreground/60">
              {(!product.brandLogo && brands && product.brandId) ? `· ${product.category}` : product.category}
            </span>
          )}
        </div>

        {/* Name */}
        <Link href={`/product/${encodeURIComponent(product.id)}`} scroll>
          <h3 className="line-clamp-2 text-[10px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="mt-auto pt-0.5">
          <p className="text-[9px] font-medium text-muted-foreground">Precio</p>
          {product.onSale && product.originalPrice && (
            <p className="text-[10px] text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
          <p className={`text-sm font-black tracking-tight sm:text-base ${product.onSale ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
            {formatPrice(product.price)}
          </p>
          <p className={`mt-0.5 text-[10px] font-semibold ${inStock ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
            Stock disponible: {inStock ? product.stock : 0}
          </p>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex flex-nowrap items-center justify-between gap-2 border-t border-border/50 px-2 py-2">
        <Link
          href={`/product/${encodeURIComponent(product.id)}`}
          scroll
          className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground transition-all hover:border-primary/60 hover:text-primary hover:shadow-md hover:shadow-primary/20 sm:gap-2"
          title="Ver producto"
        >
          <Eye className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline">Ver</span>
        </Link>
        <ProductCardActions product={product} />
      </div>
    </article>
  )
}
