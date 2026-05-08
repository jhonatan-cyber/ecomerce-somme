"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  Calculator, 
  Building, 
  Home, 
  Factory, 
  Wrench, 
  Mail, 
  Phone, 
  MapPin,
  Plus,
  Trash2,
  FileText,
  CheckCircle
} from "lucide-react"
import type { Product, QuoteRequest } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface QuoteGeneratorProps {
  products: Product[]
  selectedProducts?: Array<{ product: Product; quantity: number; notes?: string }>
  onQuoteSubmit?: (quote: QuoteRequest) => void
}

const projectTypes = [
  { value: 'residential', label: 'Residencial', icon: Home, description: 'Viviendas y departamentos' },
  { value: 'commercial', label: 'Comercial', icon: Building, description: 'Oficinas, tiendas y negocios' },
  { value: 'industrial', label: 'Industrial', icon: Factory, description: 'Fábricas y plantas industriales' }
]

const volumeDiscounts = [
  { min: 1, max: 4, discount: 0 },
  { min: 5, max: 9, discount: 5 },
  { min: 10, max: 24, discount: 10 },
  { min: 25, max: 49, discount: 15 },
  { min: 50, max: Infinity, discount: 20 }
]

export function QuoteGenerator({ products, selectedProducts = [], onQuoteSubmit }: QuoteGeneratorProps) {
  const [quoteItems, setQuoteItems] = useState(selectedProducts)
  const [projectType, setProjectType] = useState<'residential' | 'commercial' | 'industrial'>('commercial')
  const [installationRequired, setInstallationRequired] = useState(true)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  })
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const addProduct = (product: Product) => {
    const existingItem = quoteItems.find(item => item.product.id === product.id)
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      setQuoteItems([...quoteItems, { product, quantity: 1 }])
    }
  }

  const removeProduct = (productId: string) => {
    setQuoteItems(quoteItems.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId)
      return
    }
    setQuoteItems(quoteItems.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ))
  }

  const updateNotes = (productId: string, notes: string) => {
    setQuoteItems(quoteItems.map(item => 
      item.product.id === productId ? { ...item, notes } : item
    ))
  }

  const calculateSubtotal = () => {
    return quoteItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const calculateVolumeDiscount = () => {
    const totalQuantity = quoteItems.reduce((total, item) => total + item.quantity, 0)
    const discount = volumeDiscounts.find(d => totalQuantity >= d.min && totalQuantity <= d.max)
    return discount ? discount.discount : 0
  }

  const calculateInstallationCost = () => {
    if (!installationRequired) return 0
    const baseCost = 150 // Costo base por instalación
    const perCameraCost = 50 // Costo adicional por cámara
    const totalCameras = quoteItems.reduce((total, item) => total + item.quantity, 0)
    return baseCost + (totalCameras * perCameraCost)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountPercentage = calculateVolumeDiscount()
    const discountAmount = subtotal * (discountPercentage / 100)
    const installationCost = calculateInstallationCost()
    return subtotal - discountAmount + installationCost
  }

  const handleSubmit = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      return
    }

    setIsSubmitting(true)
    
    const quoteRequest: QuoteRequest = {
      customer: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address
      },
      products: quoteItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        notes: item.notes
      })),
      project_type: projectType,
      installation_required: installationRequired
    }

    try {
      if (onQuoteSubmit) {
        await onQuoteSubmit(quoteRequest)
      }
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting quote:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-green-800">¡Cotización Enviada!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-green-700 mb-6">
            Hemos recibido tu solicitud de cotización. Nuestro equipo de ventas te contactará en las próximas 24 horas hábiles.
          </p>
          <Button 
            onClick={() => {
              setIsSubmitted(false)
              setQuoteItems([])
              setCustomerInfo({ name: '', email: '', phone: '', address: '', company: '' })
              setAdditionalNotes('')
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            Crear Nueva Cotización
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-camera-accent" />
            Generador de Cotizaciones B2B
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Products Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Productos Seleccionados</CardTitle>
            </CardHeader>
            <CardContent>
              {quoteItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Agrega productos para generar tu cotización</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quoteItems.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="aspect-square w-16 rounded-md overflow-hidden bg-muted">
                        {item.product.image_url && (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.product.price)} c/u
                        </p>
                        <Input
                          placeholder="Notas adicionales (opcional)"
                          value={item.notes || ''}
                          onChange={(e) => updateNotes(item.product.id, e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProduct(item.product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="juan@empresa.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="+52 55 1234 5678"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={customerInfo.company}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                    placeholder="Empresa S.A. de C.V."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Dirección de Instalación *</Label>
                <Textarea
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  placeholder="Calle Principal #123, Colonia Centro, Ciudad, CP 12345"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="project-type">Tipo de Proyecto</Label>
                <Select value={projectType} onValueChange={(value: any) => setProjectType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="installation"
                  checked={installationRequired}
                  onCheckedChange={(checked) => setInstallationRequired(checked as boolean)}
                />
                <Label htmlFor="installation" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Requiero servicio de instalación
                </Label>
              </div>

              <div>
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Describe cualquier requisito especial o consideración adicional para tu proyecto..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quote Summary */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Cotización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                
                {calculateVolumeDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento por volumen ({calculateVolumeDiscount()}%):</span>
                    <span>-{formatPrice(calculateSubtotal() * (calculateVolumeDiscount() / 100))}</span>
                  </div>
                )}
                
                {installationRequired && (
                  <div className="flex justify-between">
                    <span>Instalación:</span>
                    <span>{formatPrice(calculateInstallationCost())}</span>
                  </div>
                )}
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-camera-accent">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              {/* Volume Discounts Info */}
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Descuentos por volumen:</p>
                <div className="space-y-1">
                  {volumeDiscounts.map((discount, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{discount.min === 1 ? '1-4 unidades' : `${discount.min}-${discount.max === Infinity ? '+' : discount.max} unidades`}:</span>
                      <span>{discount.discount}% descuento</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={quoteItems.length === 0 || !customerInfo.name || !customerInfo.email || !customerInfo.address || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Enviando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Enviar Cotización
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
