import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card">
      {/* Image skeleton */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <Skeleton className="absolute inset-0 h-full w-full" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
        {/* Brand and category skeleton */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Name skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Price skeleton */}
        <div className="mt-auto pt-1 space-y-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      {/* Footer actions skeleton */}
      <div className="flex items-center justify-between gap-2 border-t border-border/50 px-3 py-2 sm:px-4 sm:py-3">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </article>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
