"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Camera, 
  Eye, 
  Shield, 
  Wifi, 
  HardDrive,
  Zap,
  Thermometer,
  Monitor,
  Cpu,
  Search,
  Info
} from "lucide-react"
import type { Product } from "@/lib/types"

interface TechnicalSpecsProps {
  product: Product
}

const specDescriptions = {
  resolution: "Resolución máxima que puede capturar la cámara, medida en megapíxeles (MP). Mayor resolución = más detalles.",
  night_vision: "Capacidad de la cámara para capturar imágenes en condiciones de poca luz o completa oscuridad.",
  weather_resistance: "Nivel de protección contra condiciones climáticas como lluvia, polvo y temperaturas extremas.",
  field_of_view: "Área de cobertura que puede capturar la cámara, medido en grados.",
  storage_capacity: "Capacidad de almacenamiento interno o compatibilidad con tarjetas de memoria.",
  connectivity: "Opciones de conexión disponibles para integración con redes y dispositivos.",
  sensor_type: "Tipo de sensor de imagen utilizado. CMOS es común en cámaras modernas por su eficiencia energética.",
  lens_focal_length: "Distancia focal del lente que determina el campo de visión y nivel de zoom.",
  power_consumption: "Consumo eléctrico de la cámara en condiciones normales de operación.",
  operating_temperature: "Rango de temperaturas en el que la cámara puede funcionar correctamente."
}

const specIcons = {
  resolution: Camera,
  night_vision: Eye,
  weather_resistance: Shield,
  field_of_view: Monitor,
  storage_capacity: HardDrive,
  connectivity: Wifi,
  sensor_type: Cpu,
  lens_focal_length: Search,
  power_consumption: Zap,
  operating_temperature: Thermometer
}

export function TechnicalSpecs({ product }: TechnicalSpecsProps) {
  const [expandedSpec, setExpandedSpec] = useState<string | null>(null)

  const specs = [
    { key: 'resolution', label: 'Resolución', value: product.resolution },
    { key: 'night_vision', label: 'Visión Nocturna', value: product.night_vision, boolean: true },
    { key: 'weather_resistance', label: 'Resistencia Climática', value: product.weather_resistance },
    { key: 'field_of_view', label: 'Campo de Visión', value: product.field_of_view },
    { key: 'storage_capacity', label: 'Almacenamiento', value: product.storage_capacity },
    { key: 'connectivity', label: 'Conectividad', value: product.connectivity, array: true },
    { key: 'sensor_type', label: 'Tipo de Sensor', value: product.sensor_type },
    { key: 'lens_focal_length', label: 'Distancia Focal', value: product.lens_focal_length },
    { key: 'power_consumption', label: 'Consumo Energético', value: product.power_consumption },
    { key: 'operating_temperature', label: 'Temperatura Operativa', value: product.operating_temperature }
  ].filter(spec => spec.value !== undefined && spec.value !== null && spec.value !== '')

  const getSpecValue = (spec: any) => {
    if (spec.boolean) {
      return spec.value ? 'Sí' : 'No'
    }
    if (spec.array && Array.isArray(spec.value)) {
      return spec.value.join(', ')
    }
    return spec.value
  }

  if (specs.length === 0) {
    return null
  }

  return (
    <TooltipProvider>
      <Card className="border-camera-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-camera-accent" />
            Especificaciones Técnicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {specs.map((spec) => {
              const Icon = specIcons[spec.key as keyof typeof specIcons]
              const description = specDescriptions[spec.key as keyof typeof specDescriptions]
              const value = getSpecValue(spec)
              
              return (
                <div 
                  key={spec.key}
                  className="group rounded-lg border p-4 transition-all hover:border-camera-accent/30 hover:bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {Icon && (
                        <Icon className="h-4 w-4 text-camera-accent shrink-0" />
                      )}
                      <span className="font-medium text-sm">{spec.label}</span>
                    </div>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="shrink-0 rounded-full p-1 hover:bg-muted/50 transition-colors"
                        >
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">{description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="mt-2">
                    <div className="font-semibold text-foreground">
                      {value}
                    </div>
                    
                    {/* Additional details for certain specs */}
                    {spec.key === 'resolution' && typeof value === 'string' && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {value.includes('4K') && (
                          <Badge variant="secondary" className="mr-1">4K Ultra HD</Badge>
                        )}
                        {value.includes('2K') && (
                          <Badge variant="secondary" className="mr-1">2K QHD</Badge>
                        )}
                        {value.includes('1080p') && (
                          <Badge variant="secondary" className="mr-1">Full HD</Badge>
                        )}
                      </div>
                    )}
                    
                    {spec.key === 'night_vision' && spec.value === true && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="mr-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Visión nocturna infrarroja
                        </Badge>
                      </div>
                    )}
                    
                    {spec.key === 'weather_resistance' && typeof value === 'string' && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {value.toLowerCase().includes('ip67') && (
                          <Badge variant="secondary" className="mr-1">IP67 Polvo/Agua</Badge>
                        )}
                        {value.toLowerCase().includes('vandálico') && (
                          <Badge variant="secondary" className="mr-1">Antivandálico IK10</Badge>
                        )}
                      </div>
                    )}
                    
                    {spec.key === 'connectivity' && Array.isArray(value) && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {value.includes('WiFi') && (
                          <Badge variant="secondary" className="mr-1">
                            <Wifi className="h-3 w-3 mr-1" />
                            WiFi
                          </Badge>
                        )}
                        {value.includes('PoE') && (
                          <Badge variant="secondary" className="mr-1">PoE</Badge>
                        )}
                        {value.includes('Ethernet') && (
                          <Badge variant="secondary" className="mr-1">Ethernet</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Performance indicators */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-3 text-camera-charcoal">Indicadores de Rendimiento</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {product.resolution && (
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <span className="text-sm text-muted-foreground">Calidad de imagen</span>
                  <Badge 
                    variant={
                      product.resolution.includes('4K') ? 'default' :
                      product.resolution.includes('2K') ? 'secondary' : 'outline'
                    }
                  >
                    {product.resolution.includes('4K') ? 'Premium' :
                     product.resolution.includes('2K') ? 'Alta' : 'Estándar'}
                  </Badge>
                </div>
              )}
              
              {product.night_vision !== undefined && (
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <span className="text-sm text-muted-foreground">Operación 24/7</span>
                  <Badge variant={product.night_vision ? 'default' : 'outline'}>
                    {product.night_vision ? 'Disponible' : 'Diurna'}
                  </Badge>
                </div>
              )}
              
              {product.weather_resistance && (
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <span className="text-sm text-muted-foreground">Instalación</span>
                  <Badge 
                    variant={
                      product.weather_resistance.toLowerCase().includes('exterior') ? 'default' : 'outline'
                    }
                  >
                    {product.weather_resistance.toLowerCase().includes('exterior') ? 'Exterior' : 'Interior'}
                  </Badge>
                </div>
              )}
              
              {product.connectivity && product.connectivity.includes('WiFi') && (
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <span className="text-sm text-muted-foreground">Acceso remoto</span>
                  <Badge variant="default">
                    <Wifi className="h-3 w-3 mr-1" />
                    Disponible
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
