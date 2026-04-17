import Link from "next/link"
import { CheckCircle2, ShieldCheck, ShoppingBag, Truck } from "lucide-react"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { Button } from "@/components/ui/button"
import { getOrderById } from "@/lib/api"

function formatCurrency(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "A coordinar"
  return `$${value.toLocaleString()}`
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Pendiente"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" })
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }> | { orderId: string }
}) {
  const resolvedParams = await params
  const lookup = await getOrderById(resolvedParams.orderId)
  const order = lookup.ok ? lookup.order : null
  const displayOrderId = order?.orderId || order?.id || resolvedParams.orderId
  const shortId = displayOrderId.slice(0, 8).toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="container mx-auto px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lg sm:rounded-[2rem]">
          {/* Hero header */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-8 text-white sm:px-8 sm:py-10">
            <CheckCircle2 className="h-12 w-12 text-cyan-300 sm:h-16 sm:w-16" />
            <h1 className="mt-4 text-2xl font-black tracking-tight sm:mt-5 sm:text-4xl">
              ¡Pedido confirmado!
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300 sm:mt-3 sm:text-base">
              Tu compra fue recibida correctamente y ya entró al flujo de coordinación comercial.
            </p>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-8">
            {/* Order number */}
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Número de pedido
            </p>
            <p className="mt-1.5 font-mono text-2xl font-black tracking-tight sm:text-3xl">
              #{shortId}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Recibirás un email con el detalle. El equipo de Somme Technology se contactará para coordinar.
            </p>

            {/* Info cards */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border bg-muted/50 p-4 text-sm">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Confirmación segura
                </p>
                <p className="mt-1.5 text-muted-foreground">Pedido registrado y listo para seguimiento.</p>
              </div>
              <div className="rounded-xl border bg-muted/50 p-4 text-sm">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <Truck className="h-4 w-4 text-primary" /> Próximo paso
                </p>
                <p className="mt-1.5 text-muted-foreground">Coordinación de despacho y contacto postventa.</p>
              </div>
            </div>

            {/* Order detail */}
            {order && (
              <div className="mt-6 rounded-xl border bg-muted/30 p-4 sm:rounded-2xl sm:p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Detalle del pedido
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-background p-3 text-sm shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Cliente</p>
                    <p className="mt-1.5 font-semibold text-foreground">{order.customer?.name || "Sin nombre"}</p>
                    <p className="text-muted-foreground">{order.customer?.email || "Sin email"}</p>
                    {order.customer?.phone && (
                      <p className="text-muted-foreground">{order.customer.phone}</p>
                    )}
                  </div>
                  <div className="rounded-xl bg-background p-3 text-sm shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Estado</p>
                    <p className="mt-1.5 font-semibold text-foreground">{order.status || "Pendiente"}</p>
                    <p className="text-muted-foreground">Creado: {formatDate(order.createdAt)}</p>
                    <p className="font-bold text-foreground">Total: {formatCurrency(order.total)}</p>
                  </div>
                </div>

                {order.items.length > 0 && (
                  <div className="mt-3 rounded-xl bg-background p-3 text-sm shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Productos
                    </p>
                    <div className="mt-2 space-y-2.5">
                      {order.items.map((item) => (
                        <div
                          key={`${item.productId}-${item.productName}`}
                          className="flex items-start justify-between gap-3 border-b border-dashed border-border/60 pb-2.5 last:border-0 last:pb-0"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">{item.productName}</p>
                            <p className="text-muted-foreground">× {item.quantity}</p>
                          </div>
                          <p className="shrink-0 font-bold text-foreground">
                            {formatCurrency(item.productPrice)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {lookup.error && !order && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                <p className="font-semibold">Detalle limitado</p>
                <p className="mt-1.5 leading-5">{lookup.error}</p>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-11 flex-1 rounded-xl sm:rounded-2xl">
                <Link href="/catalog">Seguir comprando</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 flex-1 rounded-xl sm:rounded-2xl">
                <Link href="/cart">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Ver carrito
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
