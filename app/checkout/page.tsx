"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Loader2, ShieldCheck, Store, Truck } from "lucide-react"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCartStore } from "@/lib/store/cart-store"
import { createOrder } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup")
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" })

  useEffect(() => {
    if (items.length === 0) router.push("/cart")
  }, [items.length, router])

  if (items.length === 0) return null

  const subtotal = getTotal()
  const shippingFee = deliveryMethod === "delivery" ? Math.round(subtotal * 0.1 * 100) / 100 : 0
  const finalTotal = subtotal + shippingFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (deliveryMethod === "delivery" && !formData.address.trim()) {
      toast({
        title: "Direccion requerida",
        description: "Debes ingresar una direccion si eliges envio.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await createOrder({
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          address: deliveryMethod === "delivery" ? formData.address.trim() : null,
        },
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
        })),
        total: finalTotal,
        tax: shippingFee,
        deliveryMethod,
        paymentMethod: "qr",
        notes: deliveryMethod === "delivery"
          ? "Metodo de entrega: envio"
          : "Metodo de entrega: recoger en tienda",
      })

      if (!result.success || !result.orderId) {
        throw new Error(result.message || "Error al crear el pedido")
      }

      clearCart()
      toast({ title: "Pedido realizado", description: `Tu pedido #${result.orderId.slice(0, 8)} fue creado exitosamente.` })
      router.push(`/order-confirmation/${result.orderId}`)
    } catch (error) {
      console.error("[checkout] Error creating order:", error)
      toast({ title: "Error", description: "No se pudo procesar tu pedido. Intentá nuevamente.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8"><p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Checkout</p><h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Finalizar compra</h1><p className="mt-2 text-muted-foreground">Completá tus datos y cerrá la operación con una experiencia más premium.</p></div>
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[2rem] border-border/70 shadow-sm">
            <CardHeader><CardTitle className="text-2xl font-black tracking-tight">Informacion del pedido</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-5">
                <div className="space-y-3">
                  <Label>Metodo de entrega</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`rounded-[1.5rem] border p-4 text-left transition ${
                        deliveryMethod === "pickup"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/70 bg-background hover:border-primary/30"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Store className="h-4 w-4 text-primary" />
                        Recoger en tienda
                      </span>
                      <p className="mt-2 text-sm text-muted-foreground">El cliente pasa a recoger sus productos.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`rounded-[1.5rem] border p-4 text-left transition ${
                        deliveryMethod === "delivery"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/70 bg-background hover:border-primary/30"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Truck className="h-4 w-4 text-primary" />
                        Envio
                      </span>
                      <p className="mt-2 text-sm text-muted-foreground">Se agrega automaticamente el 10% sobre el subtotal.</p>
                    </button>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="name">Nombre completo *</Label><Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Juan Pérez" className="h-12 rounded-2xl" /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="juan@ejemplo.com" className="h-12 rounded-2xl" /></div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="phone">Teléfono</Label><Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+54 11 5555 0000" className="h-12 rounded-2xl" /></div>
                  <div className="space-y-2">
                    <Label htmlFor="address">{deliveryMethod === "delivery" ? "Direccion de envio *" : "Direccion o referencia"}</Label>
                    <Textarea
                      id="address"
                      required={deliveryMethod === "delivery"}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder={deliveryMethod === "delivery" ? "Calle Principal 123, ciudad, provincia" : "Sucursal o referencia opcional"}
                      rows={4}
                      className="rounded-2xl"
                    />
                  </div>
                </div>
                <div className="rounded-[1.6rem] border bg-slate-950 p-5 text-sm text-slate-200">
                  <p className="inline-flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-cyan-300" /> Tus datos se usan solo para procesar el pedido.</p>
                  <p className="mt-2 inline-flex items-center gap-2 font-semibold"><Truck className="h-4 w-4 text-cyan-300" /> Te contactamos para coordinar envio o entrega.</p>
                </div>
                <Button type="submit" className="h-12 rounded-2xl" disabled={loading}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando pedido...</> : <><CreditCard className="mr-2 h-4 w-4" /> Confirmar pedido</>}</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="h-fit rounded-[2rem] border-border/70 shadow-xl shadow-slate-950/5 xl:sticky xl:top-32">
            <CardHeader><CardTitle className="text-2xl font-black tracking-tight">Resumen del pedido</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">{items.map((item) => <div key={item.id} className="flex items-start justify-between gap-4 rounded-2xl bg-muted/60 px-4 py-3 text-sm"><div><p className="font-semibold text-foreground">{item.name}</p><p className="text-muted-foreground">Cantidad: {item.quantity}</p></div><span className="font-bold">${(item.price * item.quantity).toLocaleString()}</span></div>)}</div>
              <div className="rounded-2xl border bg-background px-4 py-4">
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">${subtotal.toLocaleString()}</span></div>
                <div className="mt-2 flex items-center justify-between text-sm"><span className="text-muted-foreground">Entrega</span><span className="font-semibold">{deliveryMethod === "delivery" ? "Con envio" : "Recoge el cliente"}</span></div>
                <div className="mt-2 flex items-center justify-between text-sm"><span className="text-muted-foreground">Cargo por envio</span><span className={`font-semibold ${shippingFee > 0 ? "text-amber-600" : "text-emerald-600"}`}>{shippingFee > 0 ? `+$${shippingFee.toLocaleString()}` : "Sin recargo"}</span></div>
                <div className="mt-4 flex items-center justify-between border-t pt-4"><span className="text-base font-semibold">Total</span><span className="text-2xl font-black">${finalTotal.toLocaleString()}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
