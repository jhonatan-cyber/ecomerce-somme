"use client"

import Link from "next/link"
import { ArrowRight, Clock, History } from "lucide-react"
import { ProductSlider } from "@/components/store/product-slider"
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed"
import type { Product } from "@/lib/types"

type RecentItem = ReturnType<typeof useRecentlyViewedStore.getState>["items"][number]

// Reescribe URLs con localhost/127.0.0.1/IP privada a la IP configurada (client-side)
function rewriteClientImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const uploadsBase = process.env.NEXT_PUBLIC_UPLOADS_URL?.trim()
  if (!uploadsBase) return url
  const PRIVATE_RE = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?\//
  return url.replace(PRIVATE_RE, `${uploadsBase.replace(/\/+$/, "")}/`)
}

function toProduct(item: RecentItem): Product {
  return {
    id: item.id,
    name: item.name,
    price: item.price,
    image_url: rewriteClientImageUrl(item.image_url),
    stock: item.stock ?? 0,
    category: item.category ?? null,
    description: null,
    images: [],
    originalPrice: null,
    discountPercent: null,
    onSale: false,
    saleEndDate: null,
    minimumStock: 999,
    brand: null,
    brandId: null,
    brandLogo: null,
    createdAt: null,
  }
}

export function RecentlyViewed() {
  const items = useRecentlyViewedStore((state) => state.items)

  const products = items.map(toProduct)

  if (items.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 dark:border-white/10 dark:bg-slate-900">
          <History className="h-5 w-5 shrink-0 text-slate-400" />
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              Aún no has visto productos
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Explora el catálogo y los productos que visites aparecerán aquí.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-400"
          >
            Explorar <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400">
            <Clock className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
              Vistos recientemente
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {items.length} {items.length === 1 ? "producto visitado" : "productos visitados"}
            </p>
          </div>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-white"
        >
          Ver todo <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <ProductSlider products={products} category="Vistos recientemente" showDots showViewButton={false} />
    </section>
  )
}
