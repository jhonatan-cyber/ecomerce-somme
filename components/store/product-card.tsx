import Link from "next/link"
import { Eye, AlertCircle } from "lucide-react"
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
  /** Ocultar el botón "Ver producto" (útil en cards compactas o con espacio limitado) */
  showViewButton?: boolean
  /** Ocultar la marca / categoría en la card */
  showBrand?: boolean
  /** Versión compacta para contenedores angostos (ej. RecentlyViewed) */
  compact?: boolean
}

function getProductImages(product: Product) {
  const values = [product.image_url, ...(product.images ?? [])]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim())
    .filter(Boolean)
  return Array.from(new Set(values))
}

function formatStockLabel(product: Product): string {
  if (product.stock <= 0) {
    if (product.nextArrivalDate) {
      try {
        return `Próximo ingreso: ${new Date(product.nextArrivalDate).toLocaleDateString("es-BO")}`
      } catch {
        return "Sin stock"
      }
    }
    return "Sin stock"
  }
  return `${product.stock} en stock`
}

export function ProductCard({ 
  product, 
  onComparisonToggle, 
  isComparisonEnabled = false,
  brands = [],
  isNew = false,
  showViewButton = true,
  showBrand = true,
  compact = false,
}: ProductCardProps) {
  const productImages = getProductImages(product)
  const inStock = product.stock > 0
  const lowStock = inStock && product.stock <= (product.minimumStock ?? 3)

  // Resolve brand logo: prefer product-level brandLogo, fallback to brands array lookup
  const resolvedBrandLogo = product.brandLogo
    ?? (brands && product.brandId
      ? brands.find((b) => b.id === product.brandId)?.logo ?? null
      : null)

  return (
    <article
      className={`
        group relative flex min-w-0 max-w-full w-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card
        ${compact
          ? "shadow-none"
          : "shadow-none md:shadow-sm transition-all duration-300 md:hover:-translate-y-1 md:hover:border-primary/40 md:hover:shadow-lg md:hover:shadow-primary/20"
        }
      `}
    >
      {/* Image */}
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
          brandLogo={resolvedBrandLogo}
          inStock={inStock}
          lowStock={lowStock}
          discountPercent={product.discountPercent}
          onSale={product.onSale}
          isNew={isNew}
        />
      </Link>

      {/* Content */}
      <div className={`flex min-w-0 flex-1 flex-col gap-1 ${compact ? "p-1.5" : "p-2 sm:p-2.5"}`}>
        {/* Brand / category row */}
        {showBrand && (
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
            {!resolvedBrandLogo && brands && product.brandId && (
              <span className="truncate text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                {getBrandNameById(brands, product.brandId)}
              </span>
            )}
            {product.category && (
              <span className="truncate text-[10px] font-medium text-muted-foreground/60">
                {(!resolvedBrandLogo && brands && product.brandId) ? `· ${product.category}` : product.category}
              </span>
            )}
          </div>
        )}

        {/* Name */}
        <Link href={`/product/${encodeURIComponent(product.id)}`} scroll className="block min-w-0">
          <h3
            className="line-clamp-2 break-words text-[10px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary"
          >
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="mt-auto pt-0.5">
          {product.onSale && product.originalPrice && (
            <p className="text-[10px] font-semibold text-red-500 line-through">
              Antes {formatPrice(product.originalPrice)}
            </p>
          )}
          <p className={`break-words font-black tracking-tight ${compact ? "text-xs" : "text-sm sm:text-base"} ${product.onSale ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
            {product.onSale ? "Ahora " : ""}{formatPrice(product.price)}
          </p>

          {inStock ? (
            <p className="mt-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              {formatStockLabel(product)}
            </p>
          ) : (
            <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {formatStockLabel(product)}
            </p>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className={`flex flex-nowrap items-center justify-between gap-2 border-t border-border/50 ${compact ? "px-1.5 py-1.5" : "px-2 py-2"}`}>
        {showViewButton ? (
          <>
            <Link
              href={`/product/${encodeURIComponent(product.id)}`}
              scroll
              className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground transition-all hover:border-primary/60 hover:text-primary hover:shadow-md hover:shadow-primary/20 sm:gap-2"
              title="Ver producto"
            >
              <Eye className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Ver</span>
            </Link>
            <div className="min-w-0 flex-1">
              <ProductCardActions product={product} />
            </div>
          </>
        ) : (
          <ProductCardActions product={product} />
        )}
      </div>
    </article>
  )
}

