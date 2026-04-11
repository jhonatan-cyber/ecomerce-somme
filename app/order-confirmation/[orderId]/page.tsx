import { StoreHeader } from "@/components/store/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string }
}) {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">¡Pedido Confirmado!</h1>
            <p className="text-muted-foreground mb-6">Tu pedido ha sido recibido y está siendo procesado</p>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground mb-1">Número de Pedido</p>
              <p className="font-mono font-bold text-lg">#{params.orderId.slice(0, 8).toUpperCase()}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Recibirás un email de confirmación con los detalles de tu pedido
            </p>
            <Button asChild>
              <Link href="/">Volver a la Tienda</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
