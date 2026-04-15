import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { StoreImage } from "@/components/store/store-image"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return `$${price.toLocaleString()}`
}

export function ProductThumb({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      className="group block rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-muted">
        {product.image_url ? (
          <StoreImage src={product.image_url} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" fallbackText="Sin imagen" fallbackTextClassName="text-xs" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Sin imagen</div>
        )}
      </div>
      <p className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-900">{product.name}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-base font-black text-primary">{formatPrice(product.price)}</span>
        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 transition group-hover:text-primary">
          Ver detalle
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
