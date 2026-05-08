"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  X, 
  Scale, 
  Camera, 
  Eye, 
  Shield, 
  Wifi, 
  HardDrive,
  Zap,
  Thermometer,
  Monitor
} from "lucide-react"
import type { Product, ProductComparison } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface ProductComparisonProps {
  products: Product[]
  onComparisonChange?: (comparison: ProductComparison) => void
}

const technicalSpecs = [
  { key: "resolution", label: "Resolución", icon: Camera },
  { key: "night_vision", label: "Visión Nocturna", icon: Eye, boolean: true },
  { key: "weather_resistance", label: "Resistencia Climática", icon: Shield },
  { key: "field_of_view", label: "Campo de Visión", icon: Monitor },
  { key: "storage_capacity", label: "Capacidad de Almacenamiento", icon: HardDrive },
  { key: "connectivity", label: "Conectividad", icon: Wifi, array: true },
  { key: "sensor_type", label: "Tipo de Sensor", icon: Camera },
  { key: "lens_focal_length", label: "Distancia Focal", icon: Camera },
  { key: "power_consumption", label: "Consumo de Energía", icon: Zap },
  { key: "operating_temperature", label: "Temperatura Operativa", icon: Thermometer }
]

export function ProductComparison({ products, onComparisonChange }: ProductComparisonProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([
    "resolution", "night_vision", "weather_resistance", "price"
  ])
  const [isExpanded, setIsExpanded] = useState(false)

  const comparedProducts = products.filter(p => selectedProducts.includes(p.id))

  const handleProductToggle = (productId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedProducts, productId]
      : selectedProducts.filter(id => id !== productId)
    
    setSelectedProducts(newSelection)
    
    if (onComparisonChange) {
      onComparisonChange({
        products: products.filter(p => newSelection.includes(p.id)),
        selectedSpecs
      })
    }
  }

  const handleSpecToggle = (spec: string, checked: boolean) => {
    const newSpecs = checked
      ? [...selectedSpecs, spec]
      : selectedSpecs.filter(s => s !== spec)
    
    setSelectedSpecs(newSpecs)
    
    if (onComparisonChange) {
      onComparisonChange({
        products: comparedProducts,
        selectedSpecs: newSpecs
      })
    }
  }

  const removeProduct = (productId: string) => {
    handleProductToggle(productId, false)
  }

  const clearComparison = () => {
    setSelectedProducts([])
    setSelectedSpecs(["resolution", "night_vision", "weather_resistance", "price"])
  }

  const getSpecValue = (product: Product, specKey: string) => {
    if (specKey === "price") return formatPrice(product.price)
    if (specKey === "originalPrice" && product.originalPrice) return formatPrice(product.originalPrice)
    if (specKey === "stock") return product.stock > 0 ? `${product.stock} unidades` : "Agotado"
    
    const spec = technicalSpecs.find(s => s.key === specKey)
    if (!spec) return "N/A"
    
    const value = product[specKey as keyof Product]
    
    if (spec.boolean) {
      return value ? "Sí" : "No"
    }
    
    if (spec.array && Array.isArray(value)) {
      return Array.isArray(value) ? value.join(", ") : "N/A"
    }
    
    return value || "N/A"
  }

  const getBestValue = (specKey: string) => {
    if (comparedProducts.length === 0) return null
    
    const values = comparedProducts.map(p => {
      if (specKey === "price") return p.price
      if (specKey === "stock") return p.stock
      return null
    }).filter(v => v !== null) as number[]
    
    if (values.length === 0) return null
    
    if (specKey === "price") {
      return Math.min(...values)
    }
    
    return Math.max(...values)
  }

  if (comparedProducts.length === 0) {
    return (
      <Card className="border-camera-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-camera-accent" />
            Comparar Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Selecciona productos para comparar sus especificaciones técnicas
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-camera-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-camera-accent" />
              Comparación de Productos ({comparedProducts.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Menos especificaciones" : "Más especificaciones"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearComparison}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Especificación</th>
              {comparedProducts.map((product) => (
                <th key={product.id} className="p-4 min-w-[200px]">
                  <div className="space-y-2">
                    <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                      <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(product.id)}
                        className="w-full mt-1 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Quitar
                      </Button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Basic Info */}
            <tr className="border-b">
              <td className="p-4 font-medium">Marca</td>
              {comparedProducts.map((product) => (
                <td key={product.id} className="p-4">
                  {product.brand || "N/A"}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Categoría</td>
              {comparedProducts.map((product) => (
                <td key={product.id} className="p-4">
                  {product.category || "N/A"}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Precio</td>
              {comparedProducts.map((product) => {
                const bestPrice = getBestValue("price")
                const isBest = bestPrice !== null && product.price === bestPrice
                return (
                  <td key={product.id} className="p-4">
                    <div className={isBest ? "text-green-600 font-bold" : ""}>
                      {formatPrice(product.price)}
                      {isBest && <Badge className="ml-2" variant="secondary">Mejor precio</Badge>}
                    </div>
                  </td>
                )
              })}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Stock</td>
              {comparedProducts.map((product) => {
                const bestStock = getBestValue("stock")
                const isBest = bestStock !== null && product.stock === bestStock
                return (
                  <td key={product.id} className="p-4">
                    <div className={isBest ? "text-green-600 font-bold" : ""}>
                      {product.stock > 0 ? `${product.stock} unidades` : "Agotado"}
                      {isBest && product.stock > 0 && <Badge className="ml-2" variant="secondary">Más stock</Badge>}
                    </div>
                  </td>
                )
              })}
            </tr>

            {/* Technical Specifications */}
            {technicalSpecs
              .filter(spec => selectedSpecs.includes(spec.key) || (isExpanded && selectedSpecs.includes(spec.key)))
              .map((spec) => (
                <tr key={spec.key} className="border-b">
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-2">
                      <spec.icon className="h-4 w-4 text-camera-accent" />
                      {spec.label}
                    </div>
                  </td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4">
                      {getSpecValue(product, spec.key)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Spec Selection */}
      <Card className="border-camera-border">
        <CardHeader>
          <CardTitle className="text-lg">Seleccionar Especificaciones a Mostrar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {technicalSpecs.map((spec) => (
              <div key={spec.key} className="flex items-center space-x-2">
                <Checkbox
                  id={spec.key}
                  checked={selectedSpecs.includes(spec.key)}
                  onCheckedChange={(checked) => handleSpecToggle(spec.key, checked as boolean)}
                />
                <label
                  htmlFor={spec.key}
                  className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                >
                  <spec.icon className="h-4 w-4 text-camera-accent" />
                  {spec.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
