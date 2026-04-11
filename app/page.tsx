import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/product-card"
import { StoreHeader } from "@/components/store/header"
import type { Product } from "@/lib/types"
import { ShoppingBag, Truck, Shield, Zap } from "lucide-react"

export const dynamic = "force-dynamic"

async function getProducts(): Promise<Product[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }

  return data || []
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Tecnología de Última Generación
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              Descubre nuestra selección premium de productos tecnológicos con la mejor calidad y precios competitivos
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Envío Gratis</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Compra Segura</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Entrega Rápida</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Nuestros Productos</h2>
          </div>
          <p className="text-muted-foreground">Explora nuestra colección de productos tecnológicos</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No hay productos disponibles en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 TechStore. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
