import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { StoreImage } from "@/components/store/store-image"
import type { Category, Product } from "@/lib/types"

interface HeroSectionProps {
  heroProduct?: Product
  selectedCategory: Category | null
  products: Product[]
  heroCategoryName: string
  heroCategoryProductCount: number
}

export function HeroSection({
  heroProduct,
  selectedCategory,
  products,
  heroCategoryName,
  heroCategoryProductCount,
}: HeroSectionProps) {
  const analogProducts = products.filter((product) =>
    /camaras?\s+analog/i.test(product.category ?? ""),
  )
  const showcaseProducts = (selectedCategory ? products : analogProducts).slice(0, 6)
  const fallbackShowcaseProducts =
    showcaseProducts.length > 0 ? showcaseProducts : products.slice(0, 6)
  const showcaseTitle =
    selectedCategory?.name ??
    (analogProducts.length > 0 ? "Camaras Analogicas" : heroCategoryName)
  const hasVisibleProducts = fallbackShowcaseProducts.length > 0 || Boolean(heroProduct)

  return (
    <section className="overflow-hidden rounded-[2.2rem] border border-white/60 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_28%),linear-gradient(135deg,#f8fbff_0%,#ffffff_40%,#eef4ff_100%)] shadow-[0_30px_100px_-60px_rgba(37,99,235,0.65)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),linear-gradient(135deg,rgba(10,15,25,1)_0%,rgba(17,24,39,1)_40%,rgba(10,15,25,1)_100%)]">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-muted-foreground">
              Categoria activa
            </p>
            <h2 className="mt-2 text-2xl font-black text-foreground lg:text-3xl">
              {showcaseTitle}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedCategory
                ? `${products.length} producto${products.length === 1 ? "" : "s"} visibles en esta categoria.`
                : `${heroCategoryProductCount} producto${heroCategoryProductCount === 1 ? "" : "s"} visibles ahora mismo.`}
            </p>
          </div>
          <Link
            href={selectedCategory ? `/catalog?category=${encodeURIComponent(selectedCategory.id)}` : "/catalog"}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Ver catalogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {hasVisibleProducts ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {fallbackShowcaseProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-background transition hover:border-primary/40"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  <StoreImage
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain p-5"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <p className="line-clamp-2 text-base font-bold text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category ?? showcaseTitle}
                  </p>
                  <p className="text-xl font-black text-primary">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          ) : (
            <div className="mt-6 flex min-h-[280px] items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-muted/30 text-center text-sm text-muted-foreground">
              No hay productos disponibles todavia para esta categoria.
            </div>
          )}
      </div>
    </section>
  )
}
