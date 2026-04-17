import Link from "next/link"
import { Package } from "lucide-react"
import type { Product } from "@/lib/types"
import { ProductCardActions } from "@/components/store/product-card-actions"
import { ProductCardImage } from "@/components/store/product-card-image"

interface ProductCardProps {
  product: Product
}

function getProductImages(product: Product) {
  const values = [product.image_url, ...(product.images ?? [])]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim())
    .filter(Boolean)
  return Array.from(new Set(values))
}

function formatPrice(price: number) {
  return price.toLocaleString("es-CL")
}

export function ProductCard({ product }: ProductCardProps) {
  const productImages = getProductImages(product)
  const inStock = product.stock > 0
  const lowStock = inStock && product.stock <= (product.minimumStock ?? 3)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_20px_60px_-20px_rgba(29,78,216,0.22)]">
      {/* Image slider */}
      <Link
        href={`/product/${encodeURIComponent(product.id)}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductCardImage
          images={productImages}
          name={product.name}
          brandLogo={product.brandLogo ?? null}
          brand={product.brand ?? null}
          inStock={inStock}
          lowStock={lowStock}
          discountPercent={product.discountPercent}
          onSale={product.onSale}
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
        {/* Brand name fallback + category */}
        <div className="flex items-center gap-1.5">
          {!product.brandLogo && product.brand && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              {product.brand}
            </span>
          )}
          {product.category && (
            <span className="text-[10px] font-medium text-muted-foreground/60">
              {(!product.brandLogo && product.brand) ? `· ${product.category}` : product.category}
            </span>
          )}
        </div>

        {/* Name */}
        <Link href={`/product/${encodeURIComponent(product.id)}`}>
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="mt-auto pt-1">
          <p className="text-[10px] font-medium text-muted-foreground">Precio</p>
          {product.onSale && product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              ${formatPrice(product.originalPrice)}
            </p>
          )}
          <p className={`text-base font-black tracking-tight sm:text-xl ${product.onSale ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
            ${formatPrice(product.price)}
          </p>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-2 border-t border-border/50 px-3 py-2 sm:px-4 sm:py-3">
        <Link
          href={`/product/${encodeURIComponent(product.id)}`}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2 text-xs font-bold text-foreground transition hover:border-primary/40 hover:text-primary sm:px-3"
        >
          Ver detalle
        </Link>
        <ProductCardActions product={product} />
      </div>
    </article>
  )
}
