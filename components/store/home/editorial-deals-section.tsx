import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductListItem } from "@/components/store/home/product-list-item"
import { StoreImage } from "@/components/store/store-image"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return `$${price.toLocaleString()}`
}

type EditorialDealsSectionProps = {
  centerShowcase?: Product
  editorialLeft: Product[]
  editorialRight: Product[]
}

export function EditorialDealsSection({
  centerShowcase,
  editorialLeft,
  editorialRight,
}: EditorialDealsSectionProps) {
  return (
    <section className="container mx-auto px-4 pt-8">
      <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-foreground">
            <span className="border-b-2 border-yellow-400 pb-2">Best Deals</span>
            <span className="text-muted-foreground">TV & Video</span>
            <span className="text-muted-foreground">Cameras</span>
            <span className="text-muted-foreground">Audio</span>
            <span className="text-muted-foreground">Accessories</span>
          </div>
          <Link href="#catalogo" className="text-sm font-semibold text-primary">
            Ver catalogo
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_220px]">
          <div className="space-y-4">
            {editorialLeft.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>

          <div className="rounded-[1.8rem] border border-yellow-400/60 bg-[linear-gradient(180deg,#ffffff_0%,#fffdf4_100%)] p-6 shadow-inner dark:bg-[linear-gradient(180deg,rgba(24,24,27,1)_0%,rgba(41,37,36,1)_100%)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Main pick</p>
                <h3 className="mt-2 text-2xl font-black text-foreground">
                  {centerShowcase?.name || "Somme featured device"}
                </h3>
              </div>
              <span className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-950">
                New
              </span>
            </div>
            <div className="relative mx-auto aspect-[4/3] max-w-[340px] overflow-hidden rounded-2xl bg-muted">
              {centerShowcase?.image_url ? (
                <StoreImage
                  src={centerShowcase.image_url}
                  alt={centerShowcase.name}
                  fill
                  className="object-contain p-6"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                  Destacado sin asignar
                </div>
              )}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Price</p>
                {centerShowcase ? (
                  <p className="mt-1 text-3xl font-black text-primary">{formatPrice(centerShowcase.price)}</p>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    Esperando publicacion del dashboard
                  </p>
                )}
              </div>
              <Link
                href="#catalogo"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950"
              >
                Ver detalle
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {editorialRight.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
