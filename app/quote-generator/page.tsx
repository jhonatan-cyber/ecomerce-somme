import type { Metadata } from "next"

import { QuoteGeneratorPage } from "@/components/store/quote-generator-page"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import { getQuoteProducts } from "@/lib/api"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Cotizacion por Volumen | Somme Technology",
  description:
    "Solicita una cotizacion por volumen con productos seleccionados, cantidades y contexto comercial listo para ventas.",
}

function normalizeSelectedProductIds(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] ?? "" : value ?? ""

  return rawValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeSource(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] ?? "" : value ?? ""
  return rawValue.trim() || "catalogo web"
}

export default async function QuoteGeneratorRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const selectedProductIds = normalizeSelectedProductIds(resolvedSearchParams?.products)
  const source = normalizeSource(resolvedSearchParams?.source)
  const catalog = await getQuoteProducts()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <QuoteGeneratorPage
          products={catalog.ok ? catalog.products : []}
          selectedProductIds={selectedProductIds}
          source={source}
        />
      </main>

      <StoreFooter />
    </div>
  )
}
