import Link from "next/link"
import { CheckCircle2, ShieldCheck, ShoppingBag, Truck } from "lucide-react"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getOrderById } from "@/lib/api"

function formatCurrency(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "A coordinar"
  }

  return `$${value.toLocaleString()}`
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Pendiente"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> | { orderId: string } }) {
  const resolvedParams = await params
  const lookup = await getOrderById(resolvedParams.orderId)
  const order = lookup.ok ? lookup.order : null
  const displayOrderId = order?.orderId || order?.id || resolvedParams.orderId
  const shortId = displayOrderId.slice(0, 8).toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border-border/70 shadow-xl shadow-slate-950/5">
          <CardContent className="p-0">
            <div className="bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] px-8 py-10 text-white">
              <CheckCircle2 className="h-16 w-16 text-cyan-300" />
              <h1 className="mt-5 text-4xl font-black tracking-tight">¡Pedido confirmado!</h1>
              <p className="mt-3 max-w-xl text-slate-300">Tu compra fue recibida correctamente y ya entró al flujo de coordinación comercial.</p>
            </div>
            <div className="grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Número de pedido</p>
                <p className="mt-2 font-mono text-3xl font-black tracking-tight">#{shortId}</p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">Vas a recibir un email con el detalle y el proximo paso. Si corresponde instalacion o coordinacion, el equipo de Somme Technology se contacta con vos.</p>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border bg-muted/60 p-4 text-sm"><p className="inline-flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Confirmación segura</p><p className="mt-2 text-muted-foreground">Pedido registrado y listo para seguimiento.</p></div>
                  <div className="rounded-2xl border bg-muted/60 p-4 text-sm"><p className="inline-flex items-center gap-2 font-semibold"><Truck className="h-4 w-4 text-primary" /> Próximo paso</p><p className="mt-2 text-muted-foreground">Coordinación de despacho y contacto postventa.</p></div>
                </div>

                {order && (
                  <div className="mt-8 rounded-[1.5rem] border bg-muted/40 p-5">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">Detalle consultado desde el backend</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-white p-4 text-sm shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Cliente</p>
                        <p className="mt-2 font-semibold text-slate-900">{order.customer?.name || "Sin nombre"}</p>
                        <p className="mt-1 text-muted-foreground">{order.customer?.email || "Sin email"}</p>
                        <p className="mt-1 text-muted-foreground">{order.customer?.phone || "Sin teléfono"}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 text-sm shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Estado</p>
                        <p className="mt-2 font-semibold text-slate-900">{order.status || "Pendiente"}</p>
                        <p className="mt-1 text-muted-foreground">Creado: {formatDate(order.createdAt)}</p>
                        <p className="mt-1 text-muted-foreground">Total: {formatCurrency(order.total)}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-white p-4 text-sm shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Items</p>
                      <div className="mt-3 space-y-3">
                        {order.items.length > 0 ? (
                          order.items.map((item) => (
                            <div key={`${item.productId}-${item.productName}`} className="flex items-start justify-between gap-4 border-b border-dashed border-border/70 pb-3 last:border-b-0 last:pb-0">
                              <div>
                                <p className="font-semibold text-slate-900">{item.productName}</p>
                                <p className="text-muted-foreground">Cantidad: {item.quantity}</p>
                              </div>
                              <div className="text-right font-semibold text-slate-900">
                                <p>{formatCurrency(item.productPrice)}</p>
                                <p className="text-muted-foreground">ID: {item.productId}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">El backend devolvió la orden, pero sin un listado de items normalizado.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {lookup.error && !order && (
                  <div className="mt-8 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                    <p className="font-semibold">Detalle limitado</p>
                    <p className="mt-2 leading-6">{lookup.error}</p>
                    <p className="mt-2 text-xs text-amber-700">Te mostramos la confirmación mínima mientras el backend público de órdenes no expone la lectura completa.</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild className="rounded-2xl px-6"><Link href="/#catalogo">Seguir comprando</Link></Button>
                <Button asChild variant="outline" className="rounded-2xl px-6"><Link href="/cart"><ShoppingBag className="mr-2 h-4 w-4" /> Ver carrito</Link></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <StoreFooter />
    </div>
  )
}
