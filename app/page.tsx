import { getProducts } from "@/lib/api"
import { ProductCard } from "@/components/store/product-card"
import { StoreHeader } from "@/components/store/header"
import type { Product } from "@/lib/types"
import { ShoppingBag, Truck, Shield, Zap } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <section className="relative bg-gradient-to-br from-camera-gradient-start via-background to-camera-gradient-end border-b">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-camera-accent/10 px-4 py-2 rounded-full mb-6">
                <div className="w-2 h-2 bg-camera-accent rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-camera-accent">Profesional & B2B</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance text-camera-charcoal leading-tight">
                Cámaras de Seguridad
                <br />
                <span className="text-camera-accent">Profesionales</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty leading-relaxed max-w-2xl mx-auto">
                Soluciones de vigilancia de alta definición para empresas y proyectos comerciales. 
                Especialistas en sistemas CCTV e IP con instalación profesional.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-camera-border hover:border-camera-accent/50 transition-colors">
                <div className="bg-camera-accent/10 p-3 rounded-xl mb-4">
                  <Truck className="h-6 w-6 text-camera-accent" />
                </div>
                <h3 className="font-semibold text-camera-charcoal mb-2">Envío Rápido</h3>
                <p className="text-sm text-muted-foreground">Entrega en 24-48h para stock disponible</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-camera-border hover:border-camera-accent/50 transition-colors">
                <div className="bg-camera-accent/10 p-3 rounded-xl mb-4">
                  <Shield className="h-6 w-6 text-camera-accent" />
                </div>
                <h3 className="font-semibold text-camera-charcoal mb-2">Garantía Profesional</h3>
                <p className="text-sm text-muted-foreground">Hasta 3 años de garantía extendida</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-camera-border hover:border-camera-accent/50 transition-colors">
                <div className="bg-camera-accent/10 p-3 rounded-xl mb-4">
                  <Zap className="h-6 w-6 text-camera-accent" />
                </div>
                <h3 className="font-semibold text-camera-charcoal mb-2">Soporte Técnico</h3>
                <p className="text-sm text-muted-foreground">Asistencia especializada 24/7</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-camera-accent text-white rounded-xl font-semibold hover:bg-camera-accent/90 transition-colors">
                Cotizar Proyecto
              </button>
              <button className="px-8 py-4 bg-card text-camera-charcoal rounded-xl font-semibold border border-camera-border hover:bg-camera-slate/10 transition-colors">
                Ver Catálogo
              </button>
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
