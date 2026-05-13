import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { StoreImage } from "@/components/store/store-image"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return `BOB ${price.toLocaleString()}`
}

export function ProductListItem({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      scroll
      className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
        {product.image_url ? <StoreImage src={product.image_url} alt={product.name} fill className="object-cover" fallbackText="No img" fallbackTextClassName="text-[10px]" showFallbackIcon={false} /> : <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">No img</div>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold text-foreground">{product.name}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
          {product.onSale && product.originalPrice && (
            <span className="text-[10px] text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <p className={`text-sm font-black ${product.onSale ? "text-red-600 dark:text-red-400" : "text-primary"}`}>
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  )
}
