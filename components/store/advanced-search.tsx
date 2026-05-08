"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  Camera, 
  Eye, 
  Shield, 
  Wifi, 
  HardDrive,
  Zap,
  Star,
  TrendingUp,
  Clock
} from "lucide-react"
import type { Product } from "@/lib/types"

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
  categories?: string[]
  brands?: string[]
}

interface SearchFilters {
  categories: string[]
  brands: string[]
  resolutionRange: [number, number]
  priceRange: [number, number]
  features: string[]
  connectivity: string[]
  weatherResistance: string[]
  inStock: boolean
  onSale: boolean
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest'
}

function toRangeTuple(value: number[], fallback: [number, number]): [number, number] {
  const [start = fallback[0], end = fallback[1]] = value
  return [start, end]
}

function toBooleanChecked(value: unknown): boolean {
  return value === true
}

const resolutionOptions = [
  { value: '720p', label: '720p HD' },
  { value: '1080p', label: '1080p Full HD' },
  { value: '2K', label: '2K QHD' },
  { value: '4K', label: '4K Ultra HD' },
  { value: '8K', label: '8K Ultra HD' }
]

const featuresOptions = [
  { value: 'night_vision', label: 'Visión Nocturna', icon: Eye },
  { value: 'weather_resistance', label: 'Resistencia Climática', icon: Shield },
  { value: 'wifi', label: 'Conectividad WiFi', icon: Wifi },
  { value: 'poe', label: 'PoE (Power over Ethernet)', icon: Zap },
  { value: 'motion_detection', label: 'Detección de Movimiento', icon: Camera },
  { value: 'audio_recording', label: 'Grabación de Audio', icon: HardDrive }
]

const connectivityOptions = [
  { value: 'wifi', label: 'WiFi' },
  { value: 'ethernet', label: 'Ethernet' },
  { value: 'poe', label: 'PoE' },
  { value: 'cellular', label: '4G/5G' },
  { value: 'bluetooth', label: 'Bluetooth' }
]

const weatherResistanceOptions = [
  { value: 'indoor', label: 'Interior' },
  { value: 'outdoor', label: 'Exterior' },
  { value: 'waterproof', label: 'Impermeable (IP67)' },
  { value: 'vandal_resistant', label: 'Antivandálico (IK10)' },
  { value: 'explosion_proof', label: 'A prueba de explosiones' }
]

export function AdvancedSearch({ onSearch, categories = [], brands = [] }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    brands: [],
    resolutionRange: [720, 3840],
    priceRange: [0, 50000],
    features: [],
    connectivity: [],
    weatherResistance: [],
    inStock: false,
    onSale: false,
    sortBy: 'relevance'
  })

  const [savedSearches, setSavedSearches] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('savedSearches')
    if (saved) {
      setSavedSearches(JSON.parse(saved))
    }
  }, [])

  const handleSearch = () => {
    onSearch(query, filters)
    
    // Guardar búsqueda reciente
    if (query.trim()) {
      const newSavedSearches = [query, ...savedSearches.filter(s => s !== query)].slice(0, 5)
      setSavedSearches(newSavedSearches)
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedSearches', JSON.stringify(newSavedSearches))
      }
    }
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      resolutionRange: [720, 3840],
      priceRange: [0, 50000],
      features: [],
      connectivity: [],
      weatherResistance: [],
      inStock: false,
      onSale: false,
      sortBy: 'relevance'
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.brands.length > 0) count++
    if (filters.features.length > 0) count++
    if (filters.connectivity.length > 0) count++
    if (filters.weatherResistance.length > 0) count++
    if (filters.inStock) count++
    if (filters.onSale) count++
    if (filters.resolutionRange[0] > 720 || filters.resolutionRange[1] < 3840) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) count++
    return count
  }

  const getFeatureIcon = (feature: string) => {
    const option = featuresOptions.find(opt => opt.value === feature)
    return option?.icon || Star
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cámaras, marcas, especificaciones..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                className="pl-10 pr-4"
              />
              
              {/* Clear Button */}
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery('')}
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Button onClick={handleSearch} className="bg-camera-accent hover:bg-camera-accent/90">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>

          {/* Recent Searches */}
          {savedSearches.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Recientes:</span>
              {savedSearches.map((search, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-muted-80"
                  onClick={() => {
                    setQuery(search)
                    handleSearch()
                  }}
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {search}
                </Badge>
              ))}
            </div>
          )}

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-2"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {showAdvanced ? 'Ocultar' : 'Filtros avanzados'}
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-camera-accent" />
                Filtros Avanzados
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                <X className="mr-1 h-4 w-4" />
                Limpiar filtros
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Categories */}
              <div>
                <Label className="text-sm font-medium">Categorías</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => {
                          setFilters(prev => ({
                            ...prev,
                            categories: checked 
                              ? [...prev.categories, category]
                              : prev.categories.filter((c: string) => c !== category)
                          }))
                        }}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <Label className="text-sm font-medium">Marcas</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={filters.brands.includes(brand)}
                        onCheckedChange={(checked) => {
                          setFilters(prev => ({
                            ...prev,
                            brands: checked 
                              ? [...prev.brands, brand]
                              : prev.brands.filter((b: string) => b !== brand)
                          }))
                        }}
                      />
                      <Label htmlFor={`brand-${brand}`} className="text-sm">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Range */}
              <div>
                <Label className="text-sm font-medium">Rango de Resolución</Label>
                <div className="mt-4 space-y-3">
                  <Select
                    value={resolutionOptions.find(opt => opt.value === filters.resolutionRange[0].toString())?.value || ''}
                    onValueChange={(value) => {
                      const minRes = parseInt(value) || 720
                      setFilters(prev => ({
                        ...prev,
                        resolutionRange: [minRes, Math.max(prev.resolutionRange[1], minRes)]
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Mínimo" />
                    </SelectTrigger>
                    <SelectContent>
                      {resolutionOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={resolutionOptions.find(opt => opt.value === filters.resolutionRange[1].toString())?.value || ''}
                    onValueChange={(value) => {
                      const maxRes = parseInt(value) || 3840
                      setFilters(prev => ({
                        ...prev,
                        resolutionRange: [Math.min(prev.resolutionRange[0], maxRes), maxRes]
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Máximo" />
                    </SelectTrigger>
                    <SelectContent>
                      {resolutionOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium">
                  Rango de Precio: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </Label>
                <div className="mt-4">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) =>
                      setFilters(prev => ({ ...prev, priceRange: toRangeTuple(value, prev.priceRange) }))
                    }
                    max={50000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <Label className="text-sm font-medium">Características</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {featuresOptions.map(feature => {
                    const Icon = feature.icon
                    return (
                      <div key={feature.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature-${feature.value}`}
                          checked={filters.features.includes(feature.value)}
                          onCheckedChange={(checked) => {
                            setFilters(prev => ({
                              ...prev,
                              features: checked 
                                ? [...prev.features, feature.value]
                                : prev.features.filter((f: string) => f !== feature.value)
                            }))
                          }}
                        />
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={`feature-${feature.value}`} className="text-sm">
                          {feature.label}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Connectivity */}
              <div>
                <Label className="text-sm font-medium">Conectividad</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {connectivityOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`connectivity-${option.value}`}
                        checked={filters.connectivity.includes(option.value)}
                        onCheckedChange={(checked) => {
                          setFilters(prev => ({
                            ...prev,
                            connectivity: checked 
                              ? [...prev.connectivity, option.value]
                              : prev.connectivity.filter((c: string) => c !== option.value)
                            }))
                        }}
                      />
                      <Label htmlFor={`connectivity-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Resistance */}
              <div>
                <Label className="text-sm font-medium">Resistencia Climática</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {weatherResistanceOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`weather-${option.value}`}
                        checked={filters.weatherResistance.includes(option.value)}
                        onCheckedChange={(checked) => {
                          setFilters(prev => ({
                            ...prev,
                            weatherResistance: checked 
                              ? [...prev.weatherResistance, option.value]
                              : prev.weatherResistance.filter((w: string) => w !== option.value)
                            }))
                        }}
                      />
                      <Label htmlFor={`weather-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) =>
                    setFilters(prev => ({ ...prev, inStock: toBooleanChecked(checked) }))
                  }
                />
                <Label htmlFor="in-stock" className="text-sm">
                  Solo disponibles
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="on-sale"
                  checked={filters.onSale}
                  onCheckedChange={(checked) =>
                    setFilters(prev => ({ ...prev, onSale: toBooleanChecked(checked) }))
                  }
                />
                <Label htmlFor="on-sale" className="text-sm">
                  En oferta
                </Label>
              </div>

              {/* Sort By */}
              <div>
                <Label className="text-sm font-medium">Ordenar por</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Relevancia
                    </SelectItem>
                    <SelectItem value="price-low">
                      Precio: Menor a mayor
                    </SelectItem>
                    <SelectItem value="price-high">
                      Precio: Mayor a menor
                    </SelectItem>
                    <SelectItem value="rating">
                      <Star className="mr-2 h-4 w-4" />
                      Mejor calificados
                    </SelectItem>
                    <SelectItem value="newest">
                      Más recientes
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSearch} className="bg-camera-accent hover:bg-camera-accent/90">
                Aplicar filtros y buscar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
