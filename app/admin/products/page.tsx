import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

async function getProducts(): Promise<Product[]> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  return data || []
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Productos
            </h1>
            <p className="text-muted-foreground text-lg">Gestiona tu inventario</p>
          </div>
          <Button asChild className="h-11 bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-5 w-5" />
              Nuevo Producto
            </Link>
          </Button>
        </div>

        {products.length === 0 ? (
          <Card className="border-2 shadow-lg">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4 text-lg">No hay productos aún</p>
              <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Link href="/admin/products/new">Crear Primer Producto</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id} className="border-2 hover:shadow-xl transition-all hover:scale-[1.01]">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden border-2">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Precio:</span>
                          <span className="font-bold text-lg text-primary">${product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Stock:</span>
                          <Badge variant={product.stock > 10 ? "default" : "destructive"}>
                            {product.stock} unidades
                          </Badge>
                        </div>
                        {product.category && (
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button asChild variant="outline" size="lg" className="hover:bg-primary/10 bg-transparent">
                        <Link href={`/admin/products/${product.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
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
