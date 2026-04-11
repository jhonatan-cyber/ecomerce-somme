import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Order } from "@/lib/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const dynamic = "force-dynamic"

async function getOrders(): Promise<Order[]> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  return data || []
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pedidos</h1>
          <p className="text-muted-foreground">Gestiona todos los pedidos</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No hay pedidos aún</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold">#{order.id.slice(0, 8).toUpperCase()}</span>
                        <Badge variant={order.status === "pending" ? "secondary" : "default"}>{order.status}</Badge>
                      </div>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                        {order.customer_phone && (
                          <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer_address}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.created_at), "PPP 'a las' p", { locale: es })}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-2xl font-bold">${Number(order.total).toFixed(2)}</p>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/orders/${order.id}`}>Ver Detalles</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
