import Link from "next/link"
import { StoreImage } from "@/components/store/store-image"
import { ProductThumb } from "@/components/store/home/product-thumb"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return `$${price.toLocaleString()}`
}

type FeaturedShowcaseSectionProps = {
  centerShowcase?: Product
  topRow: Product[]
}

export function FeaturedShowcaseSection({
  centerShowcase,
  topRow,
}: FeaturedShowcaseSectionProps) {
  return (
    <section className="container mx-auto px-4 pt-8">
      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[1.75rem] border border-yellow-400 bg-card shadow-sm">
          <div className="border-b border-yellow-400/60 px-5 py-4">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Oferta especial</p>
          </div>
          <div className="p-5">
            <div className="relative mx-auto aspect-square max-w-[180px] overflow-hidden rounded-2xl bg-muted">
              {centerShowcase?.image_url ? (
                <StoreImage
                  src={centerShowcase.image_url}
                  alt={centerShowcase.name}
                  fill
                  className="object-cover"
                  fallbackText="Sin imagen"
                  fallbackTextClassName="text-xs"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                  Publica mas productos desde el dashboard para activar esta vitrina.
                </div>
              )}
            </div>
            {centerShowcase ? (
              <>
                <p className="mt-4 line-clamp-2 text-sm font-semibold text-foreground">{centerShowcase.name}</p>
                <p className="mt-2 text-3xl font-black text-primary">{formatPrice(centerShowcase.price)}</p>
              </>
            ) : (
              <>
                <p className="mt-4 text-sm font-semibold text-foreground">Vitrina sin producto destacado</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  El dashboard todavia no expuso un segundo producto para esta seccion.
                </p>
              </>
            )}
            <div className="mt-5 rounded-2xl bg-muted/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Tiempo limitado</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold text-foreground">
                <div className="rounded-xl bg-background px-2 py-3">00<br />Días</div>
                <div className="rounded-xl bg-background px-2 py-3">00<br />Hrs</div>
                <div className="rounded-xl bg-background px-2 py-3">00<br />Min</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
          <div
            id="destacados"
            className="mb-5 flex flex-col gap-3 border-b border-border/70 pb-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-foreground">
              <span className="border-b-2 border-yellow-400 pb-2">Destacados</span>
              <span className="text-muted-foreground">En oferta</span>
              <span className="text-muted-foreground">Mejor valorados</span>
            </div>
            <Link href="#catalogo" className="text-sm font-semibold text-primary">
              Ver mas
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {topRow.map((product) => (
              <ProductThumb key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
