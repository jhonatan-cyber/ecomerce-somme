"use client"

import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { StoreImage } from "@/components/store/store-image"
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed"

export function RecentlyViewed() {
  const items = useRecentlyViewedStore((state) => state.items)

  if (items.length === 0) return null

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-black tracking-tight">Vistos recientemente</h2>
        </div>
        <Link
          href="/catalog"
          className="flex items-center gap-1 text-xs font-bold text-primary transition hover:text-primary/80"
        >
          Ver todo <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/product/${encodeURIComponent(item.id)}`}
            className="flex min-w-[140px] max-w-[140px] shrink-0 flex-col gap-2 rounded-xl border border-border/60 bg-card p-2 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <StoreImage
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
                fallbackText=""
                showFallbackIcon={false}
                fallbackClassName="bg-muted"
              />
            </div>
            <p className="line-clamp-2 text-[11px] font-semibold leading-snug">{item.name}</p>
            <p className="text-xs font-black text-primary">BOB {item.price.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
