import { Clock3 } from "lucide-react"
import { ProductThumb } from "@/components/store/home/product-thumb"
import type { Product } from "@/lib/types"

type ProductRailSectionProps = {
  title: string
  subtitle?: string
  badge?: string
  products: Product[]
  iconMode?: "clock" | "none"
}

export function ProductRailSection({
  title,
  subtitle,
  badge,
  products,
  iconMode = "none",
}: ProductRailSectionProps) {
  return (
    <section className="container mx-auto px-4 pt-8">
      <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-black uppercase tracking-[0.18em] text-foreground sm:text-lg">
              {title}
            </p>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {badge && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300">
              {iconMode === "clock" && <Clock3 className="h-4 w-4" />}
              {badge}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {products.map((product) => (
            <ProductThumb key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
