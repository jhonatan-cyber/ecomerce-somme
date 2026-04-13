"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"
import { ArrowRight, Camera, Eye, Shield, ShoppingCart, Wifi, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
  onCompareToggle?: (productId: string) => void
  isComparing?: boolean
}

export function ProductCard({ product, onCompareToggle, isComparing = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast({
        title: "Sin stock",
        description: "Este producto no está disponible en este momento.",
        variant: "destructive",
      })
      return
    }

    addItem(product)
    toast({
      title: "Producto añadido",
      description: `${product.name} fue agregado al carrito.`,
    })
  }

  const handleCompareToggle = () => {
    onCompareToggle?.(product.id)
  }

  const hasConnectivity = Array.isArray(product.connectivity) && product.connectivity.length > 0

  return (
    <Card className="group overflow-hidden rounded-3xl border-border/70 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <Camera className="h-14 w-14 text-muted-foreground" />
            </div>
          )}

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <span className="rounded-full border border-white/20 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {product.category || "Videovigilancia"}
            </span>
            <button
              type="button"
              onClick={handleCompareToggle}
              className={`rounded-2xl border p-2.5 backdrop-blur transition ${
                isComparing
                  ? "border-primary bg-primary text-primary-foreground shadow-lg"
                  : "border-white/20 bg-white/85 text-slate-700 hover:border-primary/40 hover:text-primary"
              }`}
              aria-label="Comparar producto"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <Link href={`/product/${encodeURIComponent(product.id)}`} className="block">
              <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-slate-900">{product.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {product.description || "Solución de videovigilancia pensada para instalaciones seguras y escalables."}
              </p>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {product.resolution && (
              <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
                <Camera className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Resolución:</span>
                <span className="font-semibold text-slate-900">{product.resolution}</span>
              </div>
            )}

            {product.night_vision && (
              <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
                <Eye className="h-4 w-4 text-primary" />
                <span className="font-semibold text-slate-900">Visión nocturna</span>
              </div>
            )}

            {product.weather_resistance && (
              <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Resistencia:</span>
                <span className="font-semibold text-slate-900">{product.weather_resistance}</span>
              </div>
            )}

            {hasConnectivity && (
              <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
                <Wifi className="h-4 w-4 text-primary" />
                <span className="font-semibold text-slate-900">{product.connectivity?.join(", ")}</span>
              </div>
            )}
          </div>

          <Link
            href={`/product/${encodeURIComponent(product.id)}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary/80"
          >
            Ver detalle
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex items-end justify-between gap-4 border-t border-border/60 pt-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Precio</p>
              <p className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                ${product.price.toLocaleString()}
              </p>
            </div>
            <p className={`text-sm font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-destructive"}`}>
              {product.stock > 0 ? "Listo para comprar" : "Sin stock"}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="h-12 w-full rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock > 0 ? "Añadir al carrito" : "No disponible"}
        </Button>
      </CardFooter>
    </Card>
  )
}
