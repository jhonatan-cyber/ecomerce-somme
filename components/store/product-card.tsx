import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Scale } from "lucide-react"
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
  brands = []
}: ProductCardProps) {
  const productImages = getProductImages(product)
  const inStock = product.stock > 0
  const lowStock = inStock && product.stock <= (product.minimumStock ?? 3)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20">
      {/* Image slider */}
      <Link
        href={`/product/${encodeURIComponent(product.id)}`}
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
        <Link href={`/product/${encodeURIComponent(product.id)}`}>
          <h3 className="line-clamp-2 text-[10px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="mt-auto pt-0.5">
          <p className="text-[9px] font-medium text-muted-foreground">Precio</p>
          {product.onSale && product.originalPrice && (
            <p className="text-[10px] text-muted-foreground line-through">
              ${formatPrice(product.originalPrice)}
            </p>
          )}
          <p className={`text-sm font-black tracking-tight sm:text-base ${product.onSale ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
            ${formatPrice(product.price)}
          </p>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-1 border-t border-border/50 px-2 py-1.5">
        <Link
          href={`/product/${encodeURIComponent(product.id)}`}
          className="flex h-6 items-center gap-1 rounded-md border border-border bg-background px-1.5 text-[10px] font-bold text-foreground transition-all hover:border-primary/60 hover:text-primary hover:shadow-md hover:shadow-primary/20 cursor-pointer"
        >
          Ver
        </Link>
        <ProductCardActions product={product} />
      </div>
    </article>
  )
}
