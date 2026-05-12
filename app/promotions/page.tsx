import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Clock3,
  Flame,
  Package2,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import { PromotionProductCard } from "@/components/store/promotion-product-card"
import { getOnSaleProducts } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Ofertas y Promociones | Somme Technology",
  description:
    "Descubre descuentos activos, oportunidades por volumen y equipos destacados en promoción para proyectos de seguridad electrónica.",
}

type PromoLane = {
  id: string
  label: string
  title: string
  description: string
  accent: string
  icon: typeof TrendingUp
}

const promoLanes: PromoLane[] = [
  {
    id: "express",
    label: "Rotación rápida",
    title: "Ofertas que cambian con el stock",
    description:
      "Promociones activas sobre productos con mejor movimiento para aprovechar precios agresivos sin perder margen.",
    accent: "from-rose-500 to-orange-500",
    icon: Flame,
  },
  {
    id: "project",
    label: "Ventas por proyecto",
    title: "Arma paquetes y compras por volumen",
    description:
      "La página está pensada para que el cliente vea descuentos visibles y luego te contacte para una propuesta más amplia.",
    accent: "from-sky-500 to-cyan-500",
    icon: Package2,
  },
  {
    id: "b2b",
    label: "Canal profesional",
    title: "Cotización rápida para integradores y empresas",
    description:
      "Un CTA claro hacia cotización ayuda a convertir promociones sueltas en oportunidades B2B de mayor ticket.",
    accent: "from-emerald-500 to-lime-500",
    icon: Users,
  },
]

function getSaleDeadlineLabel(dateValue: string | null | undefined) {
  if (!dateValue) return "Oferta sin fecha límite visible"

  const target = new Date(dateValue)
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return "Termina hoy"
  if (diffDays === 1) return "Termina mañana"
  if (diffDays <= 6) return `${diffDays} días restantes`

  return `Vigente hasta ${target.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  })}`
}

function getSavings(product: Product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0
  return product.originalPrice - product.price
}

function getPrimaryImage(product: Product) {
  return [product.image_url, ...(product.images ?? [])].find(Boolean) ?? null
}

function buildQuoteGeneratorHref(products: Product[], source: string) {
  const searchParams = new URLSearchParams()
  const selectedIds = products.map((product) => product.id).filter(Boolean)

  if (selectedIds.length > 0) {
    searchParams.set("products", selectedIds.join(","))
  }

  searchParams.set("source", source)

  return `/quote-generator?${searchParams.toString()}`
}

function PromoHero({
  product,
  totalOnSale,
  quoteHref,
}: {
  product: Product
  totalOnSale: number
  quoteHref: string
}) {
  const image = getPrimaryImage(product)
  const savings = getSavings(product)
  const deadline = getSaleDeadlineLabel(product.saleEndDate)

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.22),_transparent_32%),linear-gradient(135deg,#111827_0%,#0f172a_44%,#1f2937_100%)] text-white shadow-[0_30px_120px_-40px_rgba(15,23,42,0.95)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0%,transparent_22%,transparent_78%,rgba(255,255,255,0.04)_100%)]" />
      <div className="pointer-events-none absolute right-[-8%] top-[-12%] h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12%] left-[-4%] h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.26em] text-orange-100">
                <Sparkles className="h-3.5 w-3.5" />
                Semana de ofertas
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white shadow-lg shadow-orange-500/30">
                <Flame className="h-3.5 w-3.5" />
                {totalOnSale} promociones activas
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Precios calientes para cerrar compras más rápido.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Reunimos las mejores oportunidades visibles del catálogo en una sola página, con énfasis en stock real,
              ahorro inmediato y salidas rápidas hacia producto o cotización.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-200">Mayor descuento</p>
              <p className="mt-2 text-3xl font-black text-white">-{product.discountPercent ?? 0}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">Ahorro destacado</p>
              <p className="mt-2 text-3xl font-black text-white">${formatPrice(savings || product.price)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200">Ventana activa</p>
              <p className="mt-2 text-sm font-bold text-white">{deadline}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-orange-500 px-7 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(249,115,22,0.8)] hover:bg-orange-400"
            >
              <Link href={`/product/${encodeURIComponent(product.id)}`} scroll>
                Ver oferta principal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-white/5 px-7 text-sm font-bold text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={quoteHref}>
                Solicitar propuesta B2B
                <Users className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%)]" />
          <div className="relative flex h-full flex-col">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-200">Oferta protagonista</p>
                <h2 className="mt-2 text-2xl font-black leading-tight text-white">{product.name}</h2>
              </div>
              {product.brandLogo ? (
                <div className="rounded-2xl bg-white px-3 py-2 shadow-lg">
                  <Image
                    src={product.brandLogo}
                    alt={product.brand ?? "Marca"}
                    width={80}
                    height={28}
                    className="h-6 w-auto object-contain"
                    unoptimized
                  />
                </div>
              ) : null}
            </div>

            <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-[1.5rem] bg-slate-950/70">
              {image ? (
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
                  Sin imagen destacada
                </div>
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.68)_100%)]" />
              <div className="absolute left-4 top-4 rounded-2xl bg-red-500 px-3 py-2 text-white shadow-xl shadow-red-500/30">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]">Flash price</p>
                <p className="text-2xl font-black">-{product.discountPercent ?? 0}%</p>
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 backdrop-blur-md">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    {product.originalPrice ? (
                      <p className="text-sm text-slate-400 line-through">${formatPrice(product.originalPrice)}</p>
                    ) : null}
                    <p className="text-3xl font-black text-white">${formatPrice(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">Vigencia</p>
                    <p className="mt-1 text-sm font-semibold text-orange-200">{deadline}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PromoLaneCard({ lane }: { lane: PromoLane }) {
  const Icon = lane.icon

  return (
    <article className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${lane.accent}`} />
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${lane.accent} text-white shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">{lane.label}</p>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">{lane.title}</h3>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">{lane.description}</p>
    </article>
  )
}

export default async function PromotionsPage() {
  const saleCatalog = await getOnSaleProducts()
  const saleProducts = saleCatalog.ok
    ? saleCatalog.products.filter((product) => product.onSale)
    : []

  const sortedProducts = [...saleProducts].sort(
    (left, right) => (right.discountPercent ?? 0) - (left.discountPercent ?? 0),
  )
  const heroProduct = sortedProducts[0] ?? null
  const gridProducts = heroProduct ? sortedProducts.slice(1, 9) : sortedProducts.slice(0, 8)
  const averageDiscount = sortedProducts.length
    ? Math.round(
        sortedProducts.reduce((acc, product) => acc + (product.discountPercent ?? 0), 0) /
          sortedProducts.length,
      )
    : 0
  const heroQuoteHref = buildQuoteGeneratorHref(heroProduct ? [heroProduct] : [], "promociones-hero")
  const featuredQuoteHref = buildQuoteGeneratorHref(gridProducts.slice(0, 4), "promociones-seleccion")
  const campaignQuoteHref = buildQuoteGeneratorHref(sortedProducts.slice(0, 4), "promociones-campana")

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#fff 16%,#fff 100%)] text-foreground dark:bg-[linear-gradient(180deg,#0f172a_0%,#020617_16%,#020617_100%)]">
      <StoreHeader />

      <main className="pb-16">
        <section className="container mx-auto px-4 pt-6 sm:pt-8">
          {heroProduct ? (
            <PromoHero product={heroProduct} totalOnSale={sortedProducts.length} quoteHref={heroQuoteHref} />
          ) : (
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_20px_80px_-50px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-900 sm:px-10">
              <div className="mx-auto max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-orange-500">Promociones</p>
                <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
                  Estamos preparando la próxima ola de ofertas.
                </h1>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                  Cuando activemos descuentos visibles en el catálogo, esta página se convertirá en el centro de campañas,
                  bundles y oportunidades para clientes finales y B2B.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="rounded-full bg-orange-500 px-7 hover:bg-orange-400">
                    <Link href="/catalog">
                      Explorar catálogo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                    <Link href="/quote-generator">Solicitar cotización</Link>
                  </Button>
                </div>
              </div>
            </section>
          )}
        </section>

        <section className="container mx-auto px-4 pt-8 sm:pt-10">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr_0.9fr]">
            {promoLanes.map((lane) => (
              <PromoLaneCard key={lane.id} lane={lane} />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pt-10">
          <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_20px_80px_-55px_rgba(15,23,42,0.5)] dark:border-white/10 dark:bg-slate-900 sm:grid-cols-3 sm:px-7">
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_100%)] p-5 dark:bg-[linear-gradient(135deg,#1c1917_0%,#292524_100%)]">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <Flame className="h-4 w-4" />
                <p className="text-[11px] font-bold uppercase tracking-[0.24em]">Activas</p>
              </div>
              <p className="mt-3 text-4xl font-black text-slate-950 dark:text-white">{sortedProducts.length}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">productos con precio promocional visible</p>
            </div>
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#eff6ff_0%,#e0f2fe_100%)] p-5 dark:bg-[linear-gradient(135deg,#0c1929_0%,#162032_100%)]">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                <TrendingUp className="h-4 w-4" />
                <p className="text-[11px] font-bold uppercase tracking-[0.24em]">Promedio</p>
              </div>
              <p className="mt-3 text-4xl font-black text-slate-950 dark:text-white">{averageDiscount}%</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">descuento medio de las ofertas activas</p>
            </div>
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#ecfdf5_0%,#d1fae5_100%)] p-5 dark:bg-[linear-gradient(135deg,#052e16_0%,#064e3b_100%)]">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-[11px] font-bold uppercase tracking-[0.24em]">Apoyo comercial</p>
              </div>
              <p className="mt-3 text-lg font-black text-slate-950 dark:text-white">Ventas B2B listas</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">usa las ofertas como entrada y empuja la cotización de proyecto</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pt-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-500">Selección destacada</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950 dark:text-white sm:text-4xl">
                Todo lo que hoy vale la pena mirar.
              </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Una grilla diseñada para que el visitante compare rápido, vea ahorro real y encuentre una salida directa
                al producto o a una propuesta comercial más amplia.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/catalog">
                  Ver catálogo completo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-slate-950 text-white shadow-[0_16px_36px_-20px_rgba(15,23,42,0.85)] hover:bg-orange-500 dark:bg-orange-500 dark:text-slate-950 dark:hover:bg-orange-400"
              >
                <Link href={featuredQuoteHref}>
                  Solicitar precio por volumen
                  <Zap className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {gridProducts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {gridProducts.map((product) => (
                <PromotionProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : heroProduct ? (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm font-medium text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
              La oferta principal está activa y pronto sumaremos más productos destacados aquí.
            </div>
          ) : null}
        </section>

        <section className="container mx-auto px-4 pt-10">
          <div className="overflow-hidden rounded-[2rem] border border-slate-900 bg-[linear-gradient(135deg,#111827_0%,#0f172a_55%,#1d4ed8_160%)] px-6 py-8 text-white shadow-[0_30px_100px_-45px_rgba(15,23,42,0.95)] dark:border-white/10 sm:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200">Canal empresas</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                  Convierte la página de ofertas en una puerta de entrada a proyectos más grandes.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Si un cliente encuentra una promoción atractiva, el siguiente paso ideal no siempre es “comprar una unidad”:
                  muchas veces es pedir una propuesta integral, stock reservado o precio por volumen.
                </p>
              </div>
              <div className="grid gap-3">
                <Button asChild size="lg" className="rounded-full bg-orange-500 text-white hover:bg-orange-400">
                  <Link href={campaignQuoteHref}>
                    Solicitar cotización personalizada
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/catalog">Explorar todo el catálogo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  )
}
