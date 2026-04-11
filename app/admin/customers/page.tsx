import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import type { Customer } from "@/lib/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const dynamic = "force-dynamic"

async function getCustomers(): Promise<Customer[]> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  return data || []
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Clientes</h1>
          <p className="text-muted-foreground">Lista de todos los clientes</p>
        </div>

        {customers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No hay clientes registrados aún</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {customers.map((customer) => (
              <Card key={customer.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
                      {customer.address && <p className="text-sm text-muted-foreground">{customer.address}</p>}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {format(new Date(customer.created_at), "PPP", { locale: es })}
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
