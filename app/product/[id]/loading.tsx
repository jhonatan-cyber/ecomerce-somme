import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />
      <main className="container mx-auto overflow-x-hidden px-4 py-6 sm:py-10">
        {/* Back nav skeleton */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Gallery skeleton */}
          <Skeleton className="aspect-square w-full rounded-[2rem]" />

          {/* Info column skeleton */}
          <div className="flex flex-col gap-4 pt-2 lg:pt-0">
            <div className="rounded-[2rem] border border-border/70 bg-card p-6">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="mt-3 h-8 w-full rounded-lg" />
              <Skeleton className="mt-1 h-8 w-3/4 rounded-lg" />
              <Skeleton className="mt-4 h-4 w-full rounded" />
              <Skeleton className="mt-1 h-4 w-5/6 rounded" />
              <Skeleton className="mt-4 h-20 w-full rounded-2xl" />
              <Skeleton className="mt-4 h-12 w-full rounded-2xl" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-40 w-full rounded-[1.5rem]" />
              <Skeleton className="h-40 w-full rounded-[1.5rem]" />
            </div>
          </div>
        </div>

        {/* Suggested products skeleton */}
        <div className="mt-16">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-border/60">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="flex flex-col gap-1.5 p-2.5">
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-2/3 rounded" />
                  <Skeleton className="mt-1 h-5 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
