import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, Tag, TrendingUp, Users, Zap, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { getProducts } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Promociones y Ofertas Especiales | Somme Technology",
  description: "Aprovecha nuestras ofertas exclusivas en cámaras de seguridad. Descuentos por volumen, promociones especiales y paquetes B2B.",
}

// Mock data para promociones - en producción vendría de una API
const promotions = [
  {
    id: "bulk-discount-2024",
    title: "Descuento por Volumen",
    description: "Hasta 20% de descuento en compras mayores a 25 unidades",
    type: "bulk" as const,
    discount: 20,
    minQuantity: 25,
    validUntil: "2024-12-31",
    categories: ["CCTV", "IP Cameras"],
    icon: TrendingUp,
    color: "bg-blue-500"
  },
  {
    id: "security-package",
    title: "Paquete de Seguridad Completo",
    description: "4 cámaras + DVR + instalación con 15% de descuento",
    type: "package" as const,
    discount: 15,
    products: ["camera-1", "camera-2", "dvr-1"],
    validUntil: "2024-11-30",
    categories: ["Packages"],
    icon: ShieldCheck,
    color: "bg-green-500"
  },
  {
    id: "flash-sale",
    title: "Flash Sale 48Hrs",
    description: "25% de descuento en cámaras 4K seleccionadas",
    type: "flash" as const,
    discount: 25,
    validUntil: "2024-10-20",
    categories: ["4K Cameras"],
    icon: Zap,
    color: "bg-red-500"
  },
  {
    id: "b2b-special",
    title: "Oferta Especial B2B",
    description: "Descuentos exclusivos para empresas y proyectos",
    type: "b2b" as const,
    discount: 10,
    minOrder: 5000,
    validUntil: "2024-12-15",
    categories: ["All"],
    icon: Users,
    color: "bg-purple-500"
  }
]

export default async function PromotionsPage() {
  // Obtener productos para mostrar en promociones
  const productsLookup = await getProducts()
  const products = productsLookup.ok ? productsLookup.products : []

  const getTimeRemaining = (validUntil: string) => {
    const now = new Date()
    const end = new Date(validUntil)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return "Expirada"
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} días restantes`
    return `${hours} horas restantes`
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="container mx-auto px-4 py-6 sm:py-10">
        {/* Hero Section */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-camera-accent/10 to-blue-500/10 p-8 text-center sm:mb-12 sm:p-12">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-4 text-3xl font-black tracking-tight text-camera-charcoal sm:text-4xl md:text-5xl">
              Promociones Exclusivas
            </h1>
            <p className="mb-6 text-lg text-muted-foreground sm:text-xl">
              Aprovecha nuestras ofertas especiales en equipos de seguridad profesional
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-camera-accent hover:bg-camera-accent/90">
                <Tag className="mr-2 h-4 w-4" />
                Ver Todas las Ofertas
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/quote-generator">
                  Solicitar Cotización Personalizada
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Active Promotions Grid */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-camera-charcoal sm:text-3xl">
            Ofertas Activas
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo) => {
              const Icon = promo.icon
              const timeRemaining = getTimeRemaining(promo.validUntil)
              const isExpired = timeRemaining === "Expirada"
              
              return (
                <Card key={promo.id} className={`relative overflow-hidden ${isExpired ? 'opacity-60' : ''}`}>
                  {/* Header */}
                  <div className={`${promo.color} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8" />
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {promo.type === 'bulk' && 'Volumen'}
                        {promo.type === 'package' && 'Paquete'}
                        {promo.type === 'flash' && 'Flash'}
                        {promo.type === 'b2b' && 'B2B'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{promo.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Discount */}
                    <div className="text-center">
                      <div className="text-3xl font-black text-camera-accent">
                        -{promo.discount}%
                      </div>
                      <p className="text-sm text-muted-foreground">Descuento</p>
                    </div>
                    
                    {/* Conditions */}
                    <div className="space-y-2 text-sm">
                      {promo.minQuantity && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mínimo:</span>
                          <span className="font-medium">{promo.minQuantity} unidades</span>
                        </div>
                      )}
                      {promo.minOrder && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pedido mínimo:</span>
                          <span className="font-medium">${formatPrice(promo.minOrder)}</span>
                        </div>
                      )}
                      {promo.categories && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Categorías:</span>
                          <span className="font-medium">{promo.categories.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Time Remaining */}
                    <div className={`rounded-lg p-2 text-center text-sm ${
                      isExpired ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <Clock className="mr-1 inline h-3 w-3" />
                      {timeRemaining}
                    </div>
                    
                    {/* CTA */}
                    <Button 
                      className="w-full" 
                      disabled={isExpired}
                      asChild={!isExpired}
                    >
                      {isExpired ? (
                        "Oferta Expirada"
                      ) : (
                        <Link href={`/catalog?promotion=${promo.id}`}>
                          Aprovechar Oferta
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Featured Products on Sale */}
        {products.length > 0 && (
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-camera-charcoal sm:text-3xl">
                  Productos en Oferta
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Equipos seleccionados con descuentos especiales
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/catalog?onSale=true">
                  Ver Todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products
                .filter(product => product.onSale)
                .slice(0, 8)
                .map((product) => (
                  <Card key={product.id} className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        {product.image_url && (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                      </div>
                      
                      {/* Discount Badge */}
                      {product.discountPercent && (
                        <div className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1">
                          <p className="text-xs font-black text-white">
                            -{product.discountPercent}%
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-2">
                        {product.brand && (
                          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                            {product.brand}
                          </p>
                        )}
                        <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
                          {product.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          {product.originalPrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              ${formatPrice(product.originalPrice)}
                            </p>
                          )}
                          <p className="text-lg font-black text-red-600">
                            ${formatPrice(product.price)}
                          </p>
                        </div>
                        
                        <Button size="sm" asChild>
                          <Link href={`/product/${encodeURIComponent(product.id)}`}>
                            Ver
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* B2B Special Section */}
        <Card className="border-camera-accent/30 bg-gradient-to-r from-camera-accent/5 to-blue-500/5">
          <CardContent className="p-8 text-center">
            <div className="mx-auto max-w-2xl">
              <Users className="mx-auto mb-4 h-12 w-12 text-camera-accent" />
              <h3 className="mb-4 text-2xl font-bold text-camera-charcoal">
                ¿Eres un cliente B2B?
              </h3>
              <p className="mb-6 text-lg text-muted-foreground">
                Solicita una cotización personalizada y obtén descuentos exclusivos, 
                instalación profesional y soporte prioritario para tu proyecto.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-camera-accent hover:bg-camera-accent/90" asChild>
                  <Link href="/quote-generator">
                    Solicitar Cotización B2B
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    Contactar Asesor
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <StoreFooter />
    </div>
  )
}
