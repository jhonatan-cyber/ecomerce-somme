import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

async function getStats() {
  const supabase = await getSupabaseServerClient()

  const [productsResult, ordersResult, customersResult] = await Promise.all([
    supabase.from("products").select("*", { count: "exact" }),
    supabase.from("orders").select("total", { count: "exact" }),
    supabase.from("customers").select("*", { count: "exact" }),
  ])

  const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + Number(order.total), 0) || 0

  return {
    totalProducts: productsResult.count || 0,
    totalOrders: ordersResult.count || 0,
    totalCustomers: customersResult.count || 0,
    totalRevenue,
  }
}

async function getRecentOrders() {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5)

  return data || []
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentOrders = await getRecentOrders()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Resumen de tu tienda</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Productos"
            value={stats.totalProducts}
            icon={Package}
            description="Productos en inventario"
          />
          <StatsCard
            title="Total Pedidos"
            value={stats.totalOrders}
            icon={ShoppingCart}
            description="Pedidos realizados"
          />
          <StatsCard
            title="Total Clientes"
            value={stats.totalCustomers}
            icon={Users}
            description="Clientes registrados"
          />
          <StatsCard
            title="Ingresos Totales"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            description="Ingresos generados"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-2 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Pedidos Recientes
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/orders">Ver Todos</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No hay pedidos aún</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 hover:bg-accent/5 -mx-2 px-2 rounded transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-lg">${Number(order.total).toFixed(2)}</p>
                        <Badge variant={order.status === "pending" ? "secondary" : "default"}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <Button
                asChild
                className="w-full justify-start h-12 text-base hover:bg-primary/10 bg-transparent"
                variant="outline"
              >
                <Link href="/admin/products">
                  <Package className="mr-3 h-5 w-5" />
                  Gestionar Productos
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start h-12 text-base hover:bg-primary/10 bg-transparent"
                variant="outline"
              >
                <Link href="/admin/orders">
                  <ShoppingCart className="mr-3 h-5 w-5" />
                  Ver Pedidos
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start h-12 text-base hover:bg-primary/10 bg-transparent"
                variant="outline"
              >
                <Link href="/admin/customers">
                  <Users className="mr-3 h-5 w-5" />
                  Ver Clientes
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
