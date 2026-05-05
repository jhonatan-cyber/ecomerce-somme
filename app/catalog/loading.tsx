import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function CatalogLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />
      <main className="pb-14">
        <section className="container mx-auto px-4 pt-6">
          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)] xl:items-start">
            {/* Sidebar skeleton */}
            <div className="hidden xl:flex xl:flex-col xl:gap-4">
              <Skeleton className="h-[480px] w-full rounded-[2rem]" />
              <Skeleton className="h-[200px] w-full rounded-[2rem]" />
            </div>

            <div>
              {/* Header skeleton */}
              <div className="mb-4 border-b border-border/60 pb-4">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="mt-2 h-8 w-48 rounded-lg" />
              </div>

              {/* Grid skeleton */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card"
                  >
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="flex flex-col gap-2 p-3 sm:p-4">
                      <Skeleton className="h-3 w-16 rounded" />
                      <Skeleton className="h-4 w-full rounded" />
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="mt-2 h-6 w-24 rounded" />
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-border/50 px-3 py-2 sm:px-4 sm:py-3">
                      <Skeleton className="h-8 w-16 rounded-lg" />
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  )
}
