"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  RefreshCw, 
  Download, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Package,
} from "lucide-react"
import { LocalOrderManager } from "@/lib/local-orders"
import type { LocalOrder } from "@/lib/local-orders"

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<LocalOrder[]>([])
  const [stats, setStats] = useState<ReturnType<typeof LocalOrderManager.getOrderStats>>({
    total: 0,
    pending: 0,
    synced: 0,
    error: 0,
    lastSync: null
  })
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    const allOrders = LocalOrderManager.getStoredOrders()
    setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    setStats(LocalOrderManager.getOrderStats())
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await LocalOrderManager.syncPendingOrders()
      loadOrders()
    } catch (error) {
      console.error('Error en sincronización:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(orders, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `somme-orders-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleCleanup = () => {
    if (confirm('¿Estás seguro de limpiar pedidos antiguos? Se eliminarán los pedidos de más de 30 días que no estén pendientes.')) {
      LocalOrderManager.cleanupOldOrders()
      loadOrders()
    }
  }

  const getStatusBadge = (status: LocalOrder['status']) => {
    switch (status) {
      case 'synced':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Sincronizado</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Administración de Pedidos</h1>
          <p className="text-muted-foreground">
            Gestiona y sincroniza pedidos locales con el sistema backend
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pedidos</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sincronizados</p>
                  <p className="text-2xl font-bold text-green-600">{stats.synced}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Con Error</p>
                  <p className="text-2xl font-bold text-red-600">{stats.error}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Última Sinc.</p>
                  <p className="text-sm font-bold">
                    {stats.lastSync ? formatDate(stats.lastSync) : 'Nunca'}
                  </p>
                </div>
                <RefreshCw className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button 
            onClick={handleSync} 
            disabled={isSyncing || stats.pending === 0}
            className="bg-camera-accent hover:bg-camera-accent/90"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : `Sincronizar (${stats.pending})`}
          </Button>

          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Pedidos
          </Button>

          <Button variant="outline" onClick={handleCleanup}>
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar Antiguos
          </Button>

          <Button variant="outline" onClick={loadOrders}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lista de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay pedidos registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Entrega</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Creación</TableHead>
                      <TableHead>Intentos</TableHead>
                      <TableHead>Último Intento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(order.total)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {order.deliveryMethod === 'delivery' ? 'Envío' : 'Retiro'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{order.syncAttempts}</span>
                            {order.syncAttempts > 3 && (
                              <AlertCircle className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {order.lastSyncAttempt ? formatDate(order.lastSyncAttempt) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Instrucciones de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Modo Offline</p>
                <p className="text-sm text-muted-foreground">
                  Cuando el backend no está disponible, los pedidos se guardan automáticamente en el navegador.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Sincronización</p>
                <p className="text-sm text-muted-foreground">
                  Usa el botón "Sincronizar" para enviar los pedidos pendientes al backend cuando esté disponible.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Reintentos Automáticos</p>
                <p className="text-sm text-muted-foreground">
                  El sistema intenta sincronizar automáticamente cada vez que se crea un nuevo pedido.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Pedidos con Error</p>
                <p className="text-sm text-muted-foreground">
                  Si un pedido falla después de 3 intentos, se marca como error y debe ser revisado manualmente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
