"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { CameraFilter } from "@/lib/types"
import { Filter, X, Camera, Eye, Shield, Wifi } from "lucide-react"

interface CameraFiltersProps {
  filters: CameraFilter
  onFiltersChange: (filters: CameraFilter) => void
}

export function CameraFilters({ filters, onFiltersChange }: CameraFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category)
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    })
  }

  const handleResolutionChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      resolutionRange: [value[0], value[1]] as [number, number]
    })
  }

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number]
    })
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const newFeatures = checked
      ? [...filters.features, feature]
      : filters.features.filter(f => f !== feature)
    
    onFiltersChange({
      ...filters,
      features: newFeatures
    })
  }

  const handleNightVisionChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      nightVision: checked
    })
  }

  const handleWeatherResistanceChange = (resistance: string, checked: boolean) => {
    const newWeatherResistance = checked
      ? [...filters.weatherResistance, resistance]
      : filters.weatherResistance.filter(r => r !== resistance)
    
    onFiltersChange({
      ...filters,
      weatherResistance: newWeatherResistance
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      resolutionRange: [0, 100],
      features: [],
      priceRange: [0, 10000],
      nightVision: false,
      weatherResistance: []
    })
  }

  const categories = [
    { id: 'cctv', label: 'CCTV', icon: Camera },
    { id: 'ip', label: 'IP Cameras', icon: Wifi },
    { id: 'dome', label: 'Dome Cameras', icon: Camera },
    { id: 'bullet', label: 'Bullet Cameras', icon: Camera },
    { id: 'ptz', label: 'PTZ Cameras', icon: Camera }
  ]

  const features = [
    { id: 'motion-detection', label: 'Detección de movimiento' },
    { id: 'face-recognition', label: 'Reconocimiento facial' },
    { id: 'audio-recording', label: 'Grabación de audio' },
    { id: 'remote-access', label: 'Acceso remoto' },
    { id: 'cloud-storage', label: 'Almacenamiento en la nube' }
  ]

  const weatherResistance = [
    { id: 'indoor', label: 'Interior' },
    { id: 'outdoor', label: 'Exterior' },
    { id: 'waterproof', label: 'Impermeable' },
    { id: 'vandal-proof', label: 'Antivandálico' }
  ]

  const activeFiltersCount = 
    filters.categories.length + 
    (filters.resolutionRange[0] > 0 || filters.resolutionRange[1] < 100 ? 1 : 0) +
    filters.features.length +
    (filters.nightVision ? 1 : 0) +
    filters.weatherResistance.length

  return (
    <Card className="border-camera-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-camera-accent" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Categories */}
          <div>
            <h4 className="font-medium mb-3 text-camera-charcoal">Categorías</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <label
                    htmlFor={category.id}
                    className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    <category.icon className="h-4 w-4 text-camera-accent" />
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Range */}
          <div>
            <h4 className="font-medium mb-3 text-camera-charcoal">Rango de Resolución (MP)</h4>
            <div className="px-2">
              <Slider
                value={filters.resolutionRange}
                onValueChange={handleResolutionChange}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{filters.resolutionRange[0]} MP</span>
                <span>{filters.resolutionRange[1]} MP</span>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-3 text-camera-charcoal">Rango de Precio</h4>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>BOB {filters.priceRange[0].toLocaleString()}</span>
                <span>BOB {filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-medium mb-3 text-camera-charcoal">Características</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature.id}
                    checked={filters.features.includes(feature.id)}
                    onCheckedChange={(checked) => handleFeatureChange(feature.id, checked as boolean)}
                  />
                  <label
                    htmlFor={feature.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {feature.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Night Vision */}
          <div>
            <h4 className="font-medium mb-3 text-camera-charcoal">Visión Nocturna</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="night-vision"
                checked={filters.nightVision}
                onCheckedChange={handleNightVisionChange}
              />
              <label
                htmlFor="night-vision"
                className="flex items-center gap-2 text-sm font-medium cursor-pointer"
              >
                <Eye className="h-4 w-4 text-camera-accent" />
                Cámaras con visión nocturna
              </label>
            </div>
          </div>

          {/* Weather Resistance */}
          <div>
            <h4 className="font-medium mb-3 text-camera-charcoal">Resistencia Climática</h4>
            <div className="grid grid-cols-2 gap-3">
              {weatherResistance.map((resistance) => (
                <div key={resistance.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={resistance.id}
                    checked={filters.weatherResistance.includes(resistance.id)}
                    onCheckedChange={(checked) => handleWeatherResistanceChange(resistance.id, checked as boolean)}
                  />
                  <label
                    htmlFor={resistance.id}
                    className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    <Shield className="h-4 w-4 text-camera-accent" />
                    {resistance.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
