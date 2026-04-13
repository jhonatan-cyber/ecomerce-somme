"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCartStore } from "@/lib/store/cart-store"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl rounded-[2rem] border bg-card p-10 text-center shadow-sm">
            <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground" />
            <h1 className="mt-6 text-3xl font-black tracking-tight">Tu carrito está vacío</h1>
            <p className="mt-3 text-muted-foreground">Todavía no agregaste productos. Volvé al catálogo y empecemos a vender mejor.</p>
            <Button asChild className="mt-8 rounded-2xl px-6"><Link href="/#catalogo">Explorar productos</Link></Button>
          </div>
        </main>
        <StoreFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Tu compra</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Carrito de Somme Thechnologhy</h1>
            <p className="mt-2 text-muted-foreground">Revisá cantidades, disponibilidad y avanzá al checkout con una experiencia más clara.</p>
          </div>
          <Link href="/#catalogo" className="font-semibold text-primary">Seguir comprando</Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden rounded-[1.8rem] border-border/70 shadow-sm">
                <CardContent className="p-0">
                  <div className="grid gap-4 p-5 md:grid-cols-[140px_1fr_auto] md:items-center md:p-6">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                      <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Producto</p>
                      <h2 className="mt-2 text-xl font-bold tracking-tight">{item.name}</h2>
                      <p className="mt-2 text-sm text-muted-foreground">${item.price.toLocaleString()} por unidad</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center rounded-2xl border bg-background px-2 py-1">
                          <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                          <span className="w-12 text-center text-sm font-semibold">{item.quantity}</span>
                          <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}><Plus className="h-4 w-4" /></Button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="inline-flex items-center gap-2 text-sm font-semibold text-destructive"><Trash2 className="h-4 w-4" /> Quitar</button>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Subtotal</p>
                      <p className="mt-2 text-2xl font-black tracking-tight">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="sticky top-32 rounded-[2rem] border-border/70 shadow-xl shadow-slate-950/5">
              <CardContent className="p-6">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Resumen</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">Tu pedido</h2>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">${getTotal().toLocaleString()}</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Envío</span><span className="font-semibold text-emerald-600">Gratis</span></div>
                  <div className="flex items-center justify-between rounded-2xl bg-muted/70 px-4 py-3"><span className="font-semibold">Total estimado</span><span className="text-xl font-black">${getTotal().toLocaleString()}</span></div>
                </div>
                <div className="mt-6 space-y-3 rounded-2xl border bg-slate-950 p-4 text-sm text-slate-200">
                  <p className="inline-flex items-center gap-2 font-semibold"><Truck className="h-4 w-4 text-cyan-300" /> Envío coordinado y seguimiento.</p>
                  <p className="inline-flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-cyan-300" /> Compra segura y soporte de postventa.</p>
                </div>
                <Button asChild className="mt-6 h-12 w-full rounded-2xl"><Link href="/checkout">Ir al checkout</Link></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}