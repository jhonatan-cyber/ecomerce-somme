"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  User, 
  Camera,
  CheckCircle2,
  AlertCircle,
  Filter
} from "lucide-react"

interface Review {
  id: string
  productId: string
  userName: string
  rating: number
  title: string
  content: string
  verified: boolean
  helpful: number
  date: string
  images?: string[]
  pros?: string[]
  cons?: string[]
}

interface ProductReviewsProps {
  productId: string
  productName: string
  averageRating?: number
  totalReviews?: number
  reviews?: Review[]
  onAddReview?: (review: Omit<Review, 'id' | 'productId' | 'date' | 'verified' | 'helpful' | 'userName'>) => void
}

// Mock data - en producción vendría de API
const mockReviews: Review[] = [
  {
    id: "1",
    productId: "camera-001",
    userName: "Carlos Rodríguez",
    rating: 5,
    title: "Excelente calidad de imagen",
    content: "Instalé 4 de estas cámaras en mi negocio y la calidad es excepcional. La visión nocturna funciona perfectamente y la aplicación móvil es muy intuitiva.",
    verified: true,
    helpful: 12,
    date: "2024-10-15",
    pros: ["Calidad de imagen 4K", "Fácil instalación", "App móvil funcional"],
    cons: ["Precio elevado", "Requiere buena conexión a internet"]
  },
  {
    id: "2", 
    productId: "camera-001",
    userName: "María González",
    rating: 4,
    title: "Muy buen producto",
    content: "Cumple con las expectativas para vigilancia comercial. El soporte técnico fue muy útil durante la instalación.",
    verified: true,
    helpful: 8,
    date: "2024-10-10",
    pros: ["Buen soporte", "Calidad día/noche"],
    cons: ["Configuración inicial compleja"]
  },
  {
    id: "3",
    productId: "camera-001", 
    userName: "Roberto Silva",
    rating: 5,
    title: "Perfecto para proyectos grandes",
    content: "Usamos estas cámaras en un proyecto de 50 unidades y el rendimiento ha sido impecable. Recomendado para instaladores profesionales.",
    verified: true,
    helpful: 15,
    date: "2024-10-05",
    pros: ["Escalable", "Buen precio por volumen", "Confiable"],
    cons: ["Documentación podría ser mejor"]
  }
]

export function ProductReviews({ 
  productId, 
  productName, 
  averageRating = 4.5, 
  totalReviews = 127,
  reviews = mockReviews,
  onAddReview 
}: ProductReviewsProps) {
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: '',
    pros: ['', '', ''],
    cons: ['', '', '']
  })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent')

  const filteredReviews = reviews.filter(review => 
    filterRating === null || review.rating === filterRating
  ).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'helpful':
        return b.helpful - a.helpful
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const renderStars = (rating: number, size = 'sm') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]
    reviews.forEach(review => {
      distribution[review.rating - 1]++
    })
    const total = reviews.length
    return distribution.map((count, index) => ({
      rating: index + 1,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }))
  }

  const handleSubmitReview = () => {
    if (onAddReview && newReview.rating > 0 && newReview.title && newReview.content) {
      onAddReview(newReview)
      setNewReview({
        rating: 0,
        title: '',
        content: '',
        pros: ['', '', ''],
        cons: ['', '', '']
      })
      setShowReviewForm(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-camera-accent" />
            Reseñas de {productName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Average Rating */}
            <div className="text-center">
              <div className="mb-2">
                <div className="text-3xl font-bold text-camera-charcoal">
                  {averageRating.toFixed(1)}
                </div>
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-muted-foreground">
                {totalReviews} reseñas
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2">
              <h4 className="mb-3 font-semibold">Distribución de Calificación</h4>
              <div className="space-y-2">
                {getRatingDistribution().map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm w-3">{rating}</span>
                      {renderStars(rating, 'xs')}
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtrar:</span>
          <Button
            variant={filterRating === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRating(null)}
          >
            Todas
          </Button>
          {[5, 4, 3, 2, 1].map(rating => (
            <Button
              key={rating}
              variant={filterRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRating(rating)}
            >
              {rating} {renderStars(rating, 'xs')}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ordenar:</span>
          <Button
            variant={sortBy === 'recent' ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy('recent')}
          >
            Recientes
          </Button>
          <Button
            variant={sortBy === 'helpful' ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy('helpful')}
          >
            Útiles
          </Button>
          <Button
            variant={sortBy === 'rating' ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy('rating')}
          >
            Mejor valoradas
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* User Info */}
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 rounded-full bg-camera-accent/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-camera-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.userName}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground ml-1">
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <h4 className="mb-2 font-semibold">{review.title}</h4>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {review.content}
                </p>

                {/* Pros and Cons */}
                {(review.pros?.length || review.cons?.length) && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {review.pros && review.pros.length > 0 && (
                      <div>
                        <h5 className="mb-2 font-medium text-green-700">
                          <ThumbsUp className="inline h-4 w-4 mr-1" />
                          Puntos Fuertes
                        </h5>
                        <ul className="space-y-1 text-sm">
                          {review.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">•</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {review.cons && review.cons.length > 0 && (
                      <div>
                        <h5 className="mb-2 font-medium text-red-700">
                          <AlertCircle className="inline h-4 w-4 mr-1" />
                          A Mejorar
                        </h5>
                        <ul className="space-y-1 text-sm">
                          {review.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-600 mt-0.5">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-2 font-medium">Fotos del Cliente</h5>
                    <div className="flex gap-2 overflow-x-auto">
                      {review.images.map((image, index) => (
                        <div key={index} className="flex-shrink-0">
                          <img
                            src={image}
                            alt={`Foto de instalación ${index + 1}`}
                            className="h-20 w-20 rounded-lg object-cover border cursor-pointer transition-transform hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Helpful Button */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    Útil ({review.helpful})
                  </Button>

                  {/* Report Review */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Reportar reseña
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Review Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={() => setShowReviewForm(true)}
          className="bg-camera-accent hover:bg-camera-accent/90"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Escribir una Reseña
        </Button>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Escribir una Reseña para {productName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rating */}
              <div>
                <Label>Calificación *</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <Button
                      key={rating}
                      variant={newReview.rating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewReview({ ...newReview, rating })}
                      className="p-2"
                    >
                      {renderStars(rating, 'xs')}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="review-title">Título *</Label>
                <Input
                  id="review-title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Resume tu experiencia en una frase..."
                  maxLength={100}
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="review-content">Reseña *</Label>
                <Textarea
                  id="review-content"
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  placeholder="Cuéntanos más sobre tu experiencia con este producto..."
                  rows={4}
                  maxLength={1000}
                />
              </div>

              {/* Pros */}
              <div>
                <Label>Puntos Fuertes (opcional)</Label>
                <div className="space-y-2">
                  {[1, 2, 3].map(index => (
                    <Input
                      key={index}
                      value={newReview.pros[index]}
                      onChange={(e) => {
                        const newPros = [...newReview.pros]
                        newPros[index] = e.target.value
                        setNewReview({ ...newReview, pros: newPros })
                      }}
                      placeholder={`Punto fuerte ${index + 1}...`}
                      maxLength={100}
                    />
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div>
                <Label>A Mejorar (opcional)</Label>
                <div className="space-y-2">
                  {[1, 2].map(index => (
                    <Input
                      key={index}
                      value={newReview.cons[index]}
                      onChange={(e) => {
                        const newCons = [...newReview.cons]
                        newCons[index] = e.target.value
                        setNewReview({ ...newReview, cons: newCons })
                      }}
                      placeholder={`Aspecto a mejorar ${index + 1}...`}
                      maxLength={100}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={newReview.rating === 0 || !newReview.title.trim() || !newReview.content.trim()}
                >
                  Publicar Reseña
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
