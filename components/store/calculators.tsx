"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { 
  Calculator, 
  HardDrive, 
  Monitor, 
  Camera, 
  Clock,
  Database,
  TrendingUp,
  Info
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface CalculatorsProps {
  className?: string
}

// Storage Calculator
export function StorageCalculator({ className }: { className?: string }) {
  const [cameraCount, setCameraCount] = useState(4)
  const [resolution, setResolution] = useState('1080p')
  const [frameRate, setFrameRate] = useState(15)
  const [recordingHours, setRecordingHours] = useState(24)
  const [compression, setCompression] = useState('H.265')

  const getBitrate = (res: string, fps: number, comp: string) => {
    const baseBitrates = {
      '720p': { 'H.264': 2, 'H.265': 1.5 },
      '1080p': { 'H.264': 4, 'H.265': 3 },
      '4K': { 'H.264': 8, 'H.265': 6 }
    }
    
    const baseBitrate = baseBitrates[res as keyof typeof baseBitrates]?.[comp as keyof typeof baseBitrates['720p']] || 4
    return baseBitrate * (fps / 15) // Base is 15 FPS
  }

  const calculateStorage = () => {
    const bitrate = getBitrate(resolution, frameRate, compression)
    const bitrateMBps = bitrate * 1024 / 8 // Convert Mbps to MB/s
    const storagePerDayGB = (bitrateMBps * recordingHours * 3600) / 1024 / 1024
    const totalStorageGB = storagePerDayGB * 30 // 30 days
    const totalStorageTB = totalStorageGB / 1024
    
    return {
      dailyGB: storagePerDayGB.toFixed(1),
      monthlyGB: totalStorageGB.toFixed(0),
      monthlyTB: totalStorageTB.toFixed(2),
      bitrate: bitrate
    }
  }

  const storage = calculateStorage()

  const getRecommendedStorage = () => {
    const tb = parseFloat(storage.monthlyTB)
    if (tb <= 1) return "1 TB"
    if (tb <= 2) return "2 TB"
    if (tb <= 4) return "4 TB"
    if (tb <= 8) return "8 TB"
    return `${Math.ceil(tb / 2) * 2} TB`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-camera-accent" />
          Calculadora de Almacenamiento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="cameras">Número de Cámaras</Label>
            <Input
              id="cameras"
              type="number"
              value={cameraCount}
              onChange={(e) => setCameraCount(parseInt(e.target.value) || 1)}
              min="1"
              max="100"
            />
          </div>
          
          <div>
            <Label htmlFor="resolution">Resolución</Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="720p">720p (HD)</SelectItem>
                <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                <SelectItem value="4K">4K (Ultra HD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="framerate">Frames por Segundo (FPS)</Label>
            <Slider
              value={[frameRate]}
              onValueChange={(value) => setFrameRate(value[0])}
              max={30}
              min={7.5}
              step={7.5}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>7.5 FPS</span>
              <span>{frameRate} FPS</span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="compression">Compresión</Label>
            <Select value={compression} onValueChange={setCompression}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="H.264">H.264 (Estándar)</SelectItem>
                <SelectItem value="H.265">H.265 (Eficiente)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="hours">Horas de Grabación por Día</Label>
            <Slider
              value={[recordingHours]}
              onValueChange={(value) => setRecordingHours(value[0])}
              max={24}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>1 hora</span>
              <span>{recordingHours} horas</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-4">
          <h4 className="font-semibold text-camera-charcoal">Resultados del Cálculo</h4>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bitrate total:</span>
                <span className="font-medium">{storage.bitrate} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Almacenamiento diario:</span>
                <span className="font-medium">{storage.dailyGB} GB</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Almacenamiento mensual:</span>
                <span className="font-medium">{storage.monthlyGB} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Almacenamiento mensual:</span>
                <span className="font-medium">{storage.monthlyTB} TB</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-camera-charcoal">Capacidad recomendada:</span>
              <Badge variant="default" className="text-base px-3 py-1">
                {getRecommendedStorage()}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Field of View Calculator
export function FieldOfViewCalculator({ className }: { className?: string }) {
  const [sensorSize, setSensorSize] = useState('1/2.8')
  const [focalLength, setFocalLength] = useState(4)
  const [distance, setDistance] = useState(10)
  const [aspectRatio, setAspectRatio] = useState('16:9')

  const calculateFOV = () => {
    const [sensorWidth, sensorHeight] = sensorSize.split('/').map(Number)
    const focalMM = focalLength
    
    // Calculate horizontal FOV in degrees
    const hFOV = 2 * Math.atan(sensorWidth / (2 * focalMM)) * (180 / Math.PI)
    
    // Calculate vertical FOV based on aspect ratio
    const [w, h] = aspectRatio.split(':').map(Number)
    const vFOV = hFOV * (h / w)
    
    // Calculate scene dimensions at distance
    const sceneWidth = 2 * distance * Math.tan((hFOV * Math.PI / 180) / 2)
    const sceneHeight = 2 * distance * Math.tan((vFOV * Math.PI / 180) / 2)
    const sceneArea = sceneWidth * sceneHeight
    
    return {
      horizontalFOV: hFOV.toFixed(1),
      verticalFOV: vFOV.toFixed(1),
      sceneWidth: sceneWidth.toFixed(1),
      sceneHeight: sceneHeight.toFixed(1),
      sceneArea: sceneArea.toFixed(1),
      diagonalFOV: Math.sqrt(hFOV * hFOV + vFOV * vFOV).toFixed(1)
    }
  }

  const fov = calculateFOV()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-camera-accent" />
          Calculadora de Campo de Visión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="sensor">Tamaño del Sensor (pulgadas)</Label>
            <Select value={sensorSize} onValueChange={setSensorSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1/2.8">1/2.8" (Común)</SelectItem>
                <SelectItem value="1/3">1/3" (Estándar)</SelectItem>
                <SelectItem value="2/3">2/3" (Grande)</SelectItem>
                <SelectItem value="1/1.8">1/1.8" (Compacto)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="focal">Distancia Focal (mm)</Label>
            <Slider
              value={[focalLength]}
              onValueChange={(value) => setFocalLength(value[0])}
              max={16}
              min={2}
              step={0.5}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>2mm</span>
              <span>{focalLength}mm</span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="distance">Distancia al Objeto (m)</Label>
            <Slider
              value={[distance]}
              onValueChange={(value) => setDistance(value[0])}
              max={50}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>1m</span>
              <span>{distance}m</span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="aspect">Relación de Aspecto</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="4:3">4:3 (Estándar)</SelectItem>
                <SelectItem value="1:1">1:1 (Cuadrado)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-4">
          <h4 className="font-semibold text-camera-charcoal">Campo de Visión Calculado</h4>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">FOV Horizontal:</span>
                  <span className="font-medium">{fov.horizontalFOV}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">FOV Vertical:</span>
                  <span className="font-medium">{fov.verticalFOV}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">FOV Diagonal:</span>
                  <span className="font-medium">{fov.diagonalFOV}°</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ancho de escena a {distance}m:</span>
                  <span className="font-medium">{fov.sceneWidth}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Alto de escena a {distance}m:</span>
                  <span className="font-medium">{fov.sceneHeight}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Área de cobertura:</span>
                  <span className="font-medium">{fov.sceneArea}m²</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual representation */}
          <div className="pt-2 border-t">
            <div className="text-sm text-muted-foreground mb-2">Representación visual:</div>
            <div className="relative h-32 bg-muted rounded-lg overflow-hidden">
              <div 
                className="absolute border-2 border-camera-accent bg-camera-accent/10"
                style={{
                  width: `${Math.min(100, (parseFloat(fov.sceneWidth) / distance) * 20)}%`,
                  height: `${Math.min(100, (parseFloat(fov.sceneHeight) / distance) * 20)}%`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-camera-accent" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 text-xs text-muted-foreground">
                {distance}m de distancia
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Combined Calculators Component
export function Calculators({ className }: CalculatorsProps) {
  const [activeTab, setActiveTab] = useState<'storage' | 'fov'>('storage')

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('storage')}
          className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'storage'
              ? 'border-camera-accent text-camera-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Database className="inline h-4 w-4 mr-2" />
          Almacenamiento
        </button>
        <button
          onClick={() => setActiveTab('fov')}
          className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'fov'
              ? 'border-camera-accent text-camera-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Monitor className="inline h-4 w-4 mr-2" />
          Campo de Visión
        </button>
      </div>

      {activeTab === 'storage' && <StorageCalculator />}
      {activeTab === 'fov' && <FieldOfViewCalculator />}
    </div>
  )
}
