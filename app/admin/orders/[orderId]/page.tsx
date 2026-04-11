import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

async function getOrderDetails(orderId: string) {
  const supabase = await getSupabaseServerClient()

  const [orderResult, itemsResult] = await Promise.all([
    supabase.from("orders").select("*").eq("id", orderId).single(),
    supabase.from("order_items").select("*").eq("order_id", orderId),
  ])

  if (orderResult.error || !orderResult.data) {
    return null
  }

  return {
    order: orderResult.data,
    items: itemsResult.data || [],
  }
}

export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const data = await getOrderDetails(params.orderId)

  if (!data) {
    notFound()
  }

  const { order, items } = data

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Pedidos
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pedido #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
                  <Badge variant={order.status === "pending" ? "secondary" : "default"}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha</p>
                    <p className="font-medium">{format(new Date(order.created_at), "PPP 'a las' p", { locale: es })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm">{order.customer_email}</p>
                    {order.customer_phone && <p className="text-sm">{order.customer_phone}</p>}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Dirección de Envío</p>
                    <p className="text-sm">{order.customer_address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${Number(item.product_price).toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">${Number(item.subtotal).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${Number(order.total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span>Gratis</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
