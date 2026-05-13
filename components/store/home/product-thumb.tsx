import Link from "next/link"
import Image from "next/image"
import { Camera } from "lucide-react"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return `BOB ${price.toLocaleString("es-CL")}`
}

export function ProductThumb({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      scroll
      className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Camera className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-tight text-foreground">
          {product.name}
        </p>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-1.5">
          {product.onSale && product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <p className={`text-lg font-black ${product.onSale ? "text-red-600 dark:text-red-400" : "text-primary"}`}>
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  )
}
