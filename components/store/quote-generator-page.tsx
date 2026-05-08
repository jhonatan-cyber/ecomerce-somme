"use client"

import { ArrowRight, Calculator, ClipboardCheck, Layers3, MessageCircle, Package2, ShieldCheck, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

import { QuoteGenerator } from "@/components/store/quote-generator"
import { useToast } from "@/hooks/use-toast"
import { createQuoteRequest } from "@/lib/api"
import type { Product, QuoteRequest } from "@/lib/types"

function formatSource(source: string) {
  return source
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ")
}

export function QuoteGeneratorPage({
  products,
  selectedProductIds,
  source,
}: {
  products: Product[]
  selectedProductIds: string[]
  source: string
}) {
  const { toast } = useToast()
  const selectedProducts = selectedProductIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product): product is Product => product !== undefined)
    .map((product) => ({ product, quantity: 1 }))

  const handleQuoteSubmit = async (quote: QuoteRequest) => {
    const result = await createQuoteRequest({
      ...quote,
      source,
    })

    toast({
      title: "Solicitud registrada",
      description: `Tu solicitud ${result.request.code} ya esta disponible para el equipo comercial.`,
    })

    return result
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-slate-900 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.24),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_24%),linear-gradient(135deg,#0f172a_0%,#111827_48%,#1f2937_100%)] px-6 py-6 text-white shadow-[0_34px_120px_-62px_rgba(15,23,42,0.95)] sm:px-8 lg:px-10 lg:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0%,transparent_26%,transparent_74%,rgba(255,255,255,0.03)_100%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-orange-100">
              <Sparkles className="h-3.5 w-3.5" />
              Cotizacion por volumen
            </div>
            <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
              Construye una propuesta comercial lista para cerrar negocio.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Selecciona productos, define cantidades y registra una solicitud clara para que ventas responda con precio especial, reserva de stock o propuesta integral.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Ir al catalogo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/promotions"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-20px_rgba(249,115,22,0.8)] transition hover:bg-orange-400"
              >
                Ver promociones
                <Zap className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-orange-200">
                <Package2 className="h-4 w-4" />
                <p className="text-[11px] font-black uppercase tracking-[0.22em]">Precargados</p>
              </div>
              <p className="mt-1.5 text-2xl font-black text-white">{selectedProducts.length}</p>
              <p className="mt-1 text-xs text-slate-300">items listos desde tu flujo actual</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-cyan-200">
                <Layers3 className="h-4 w-4" />
                <p className="text-[11px] font-black uppercase tracking-[0.22em]">Catalogo</p>
              </div>
              <p className="mt-1.5 text-2xl font-black text-white">{products.length}</p>
              <p className="mt-1 text-xs text-slate-300">productos disponibles para cotizar</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-200">
                <ClipboardCheck className="h-4 w-4" />
                <p className="text-[11px] font-black uppercase tracking-[0.22em]">Origen</p>
              </div>
              <p className="mt-1.5 text-base font-black text-white">{formatSource(source)}</p>
              <p className="mt-1 text-xs text-slate-300">la solicitud queda etiquetada para ventas</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="relative overflow-hidden rounded-[1.6rem] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_70%)] p-4 pr-18 shadow-[0_20px_70px_-56px_rgba(15,23,42,0.4)]">
          <Calculator className="pointer-events-none absolute right-3 top-3 h-16 w-16 text-orange-100" />
          <h2 className="mt-2 text-base font-black text-slate-950">1. Arma la mezcla</h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            Selecciona referencias, suma cantidades y deja notas por item para evitar ida y vuelta innecesaria.
          </p>
        </article>

        <article className="relative overflow-hidden rounded-[1.6rem] border border-cyan-100 bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_70%)] p-4 pr-18 shadow-[0_20px_70px_-56px_rgba(15,23,42,0.4)]">
          <MessageCircle className="pointer-events-none absolute right-3 top-3 h-16 w-16 text-cyan-100" />
          <h2 className="mt-2 text-base font-black text-slate-950">2. Contexto comercial</h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            Completa cliente, empresa, direccion y tipo de proyecto para que la respuesta ya salga mejor encaminada.
          </p>
        </article>

        <article className="relative overflow-hidden rounded-[1.6rem] border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_70%)] p-4 pr-18 shadow-[0_20px_70px_-56px_rgba(15,23,42,0.4)]">
          <ShieldCheck className="pointer-events-none absolute right-3 top-3 h-16 w-16 text-emerald-100" />
          <h2 className="mt-2 text-base font-black text-slate-950">3. Salida lista</h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            La solicitud queda guardada en dashboard con subtotal referencial, unidades, notas y detalle del proyecto.
          </p>
        </article>
      </section>

      <section>
        <QuoteGenerator
          products={products}
          selectedProducts={selectedProducts}
          onQuoteSubmit={handleQuoteSubmit}
        />
      </section>
    </div>
  )
}
