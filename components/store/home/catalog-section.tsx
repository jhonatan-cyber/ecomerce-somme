import Link from "next/link"
import { ArrowRight, Headphones, Star, TicketPercent } from "lucide-react"
import { ProductListItem } from "@/components/store/home/product-list-item"
import type { Category, Product } from "@/lib/types"

type CatalogSectionProps = {
  products: Product[]
  normalizedSearch: string
  selectedCategory: Category | null
}

export function CatalogSection({
  products,
  normalizedSearch,
  selectedCategory,
}: CatalogSectionProps) {
  return (
    <section id="catalogo" className="container mx-auto px-4 pt-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-foreground">
              <span className="border-b-2 border-yellow-400 pb-2">Productos destacados</span>
              <span className="text-muted-foreground">Ofertas activas</span>
              <span className="text-muted-foreground">Mejor valorados</span>
            </div>
            <Link href="/#catalogo" className="text-sm font-semibold text-primary">
              Todos los productos
            </Link>
          </div>

          {normalizedSearch || selectedCategory ? (
            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-slate-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-50">
              {normalizedSearch ? (
                <>
                  <span className="font-semibold text-foreground">Buscando:</span>
                  <span className="rounded-full bg-background px-3 py-1 font-semibold text-primary">
                    {normalizedSearch}
                  </span>
                </>
              ) : null}
              {selectedCategory ? (
                <>
                  <span className="font-semibold text-foreground">Categoria:</span>
                  <span className="rounded-full bg-background px-3 py-1 font-semibold text-primary">
                    {selectedCategory.name}
                  </span>
                </>
              ) : null}
              <span className="text-muted-foreground">{products.length} resultados</span>
              <Link href="/#catalogo" className="ml-auto text-sm font-semibold text-primary">
                Limpiar filtros
              </Link>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 9).map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>

          {(normalizedSearch || selectedCategory) && products.length === 0 ? (
            <div className="mt-5 rounded-[1.5rem] border border-dashed border-border bg-muted/40 p-6 text-center">
              <p className="text-lg font-bold text-foreground">
                {selectedCategory
                  ? `No encontramos productos para ${selectedCategory.name}`
                  : `No encontramos productos para "${normalizedSearch}"`}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Prueba con otra palabra o vuelve al catalogo completo para explorar todas las categorias agrupadas.
              </p>
            </div>
          ) : null}
        </div>

        <aside className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(160deg,#f4f7ff_0%,#ffffff_100%)] p-6 shadow-sm dark:bg-[linear-gradient(160deg,rgba(17,24,39,1)_0%,rgba(9,9,11,1)_100%)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Asesoria comercial</p>
          <h3 className="mt-3 text-2xl font-black text-foreground">Necesitas ayuda para elegir tu sistema ideal?</h3>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Este lateral reemplaza el banner generico y lo adapta a tu negocio real: soporte, confianza y una llamada clara a conversion.
          </p>
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-background p-4 shadow-sm">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Headphones className="h-4 w-4 text-primary" /> Soporte tecnico
              </p>
            </div>
            <div className="rounded-2xl bg-background p-4 shadow-sm">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <TicketPercent className="h-4 w-4 text-primary" /> Promos semanales
              </p>
            </div>
            <div className="rounded-2xl bg-background p-4 shadow-sm">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Star className="h-4 w-4 text-primary" /> Seleccion curada
              </p>
            </div>
          </div>
          <Link
            href="#catalogo"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950"
          >
            Ir al catalogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </section>
  )
}
