import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Package2, Sparkles, Zap } from "lucide-react"

import { CatalogGrid } from "@/components/store/catalog-grid"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import { getBrands, getProducts } from "@/lib/api"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Novedades | Somme Technology",
  description:
    "Explora los productos recien ingresados al sistema y descubre las ultimas incorporaciones del catalogo de Somme Technology.",
}

export default async function NewArrivalsPage() {
  const [catalog, brandsCatalog] = await Promise.all([getProducts(), getBrands()])
  const products = catalog.ok ? catalog.products : []
  const brands = brandsCatalog.ok ? brandsCatalog.brands : []

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_18%,#ffffff_100%)] text-foreground">
      <StoreHeader categories={[]} brands={brands} />

      <main className="pb-16">
        <section className="container mx-auto px-4 pt-6 sm:pt-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(135deg,#ffffff_0%,#f8fafc_45%,#eef6ff_100%)] px-6 py-8 shadow-[0_28px_90px_-55px_rgba(15,23,42,0.35)] sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-cyan-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Recien ingresados
                </div>
                <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                  Todas las novedades del catalogo en un solo lugar.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Esta pagina reune los productos mas recientes cargados al sistema para que el cliente vea rapido
                  nuevas referencias, nuevas marcas y equipos que acaban de entrar al portafolio.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-cyan-300 hover:text-cyan-700 hover:shadow-md"
                  >
                    Explorar catalogo completo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/promotions"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.8)] transition hover:bg-cyan-600"
                  >
                    Ver ofertas activas
                    <Zap className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-cyan-100 bg-white/90 p-5">
                <div className="flex items-center gap-2 text-cyan-700">
                  <Package2 className="h-4 w-4" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em]">Novedades</p>
                </div>
                <p className="mt-3 text-4xl font-black text-slate-950">{products.length}</p>
                <p className="mt-1 text-sm text-slate-600">productos ordenados por ingreso mas reciente</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pt-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white px-5 py-6 shadow-[0_20px_80px_-60px_rgba(15,23,42,0.35)] sm:px-7">
            <div className="mb-5 border-b border-border/60 pb-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-600">Listado actualizado</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Productos recien ingresados al sistema</h2>
            </div>

            <CatalogGrid products={products} grouped={false} brands={brands} />
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  )
}
