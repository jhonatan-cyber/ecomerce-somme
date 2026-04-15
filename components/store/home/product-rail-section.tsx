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
      <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-foreground">{title}</p>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {badge ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300">
              {iconMode === "clock" ? <Clock3 className="h-4 w-4" /> : null}
              {badge}
            </span>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {products.map((product) => (
            <ProductThumb key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
