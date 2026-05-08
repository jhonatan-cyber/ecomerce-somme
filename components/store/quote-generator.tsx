"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Building,
  Calculator,
  CheckCircle2,
  Factory,
  FileText,
  Home,
  Package2,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Product, QuoteRequest } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface QuoteGeneratorProps {
  products: Product[]
  selectedProducts?: Array<{ product: Product; quantity: number; notes?: string }>
  onQuoteSubmit?: (quote: QuoteRequest) => void
}

const projectTypes = [
  {
    value: "residential" as const,
    label: "Residencial",
    icon: Home,
    description: "Viviendas, departamentos y pequenas instalaciones.",
  },
  {
    value: "commercial" as const,
    label: "Comercial",
    icon: Building,
    description: "Tiendas, oficinas y negocios con compra recurrente.",
  },
  {
    value: "industrial" as const,
    label: "Industrial",
    icon: Factory,
    description: "Plantas, bodegas y proyectos de alto volumen.",
  },
]

const volumeDiscounts = [
  { min: 1, max: 4, discount: 0 },
  { min: 5, max: 9, discount: 5 },
  { min: 10, max: 24, discount: 10 },
  { min: 25, max: 49, discount: 15 },
  { min: 50, max: Infinity, discount: 20 },
]

const PRODUCT_PAGE_SIZE = 8

function getPrimaryImage(product: Product) {
  return [product.image_url, ...(product.images ?? [])].find(Boolean) ?? null
}

function formatVolumeRange(min: number, max: number) {
  if (max === Infinity) return `${min}+ unidades`
  return `${min}-${max} unidades`
}

export function QuoteGenerator({
  products,
  selectedProducts = [],
  onQuoteSubmit,
}: QuoteGeneratorProps) {
  const [quoteItems, setQuoteItems] = useState(selectedProducts)
  const [projectType, setProjectType] = useState<QuoteRequest["project_type"]>("commercial")
  const [installationRequired, setInstallationRequired] = useState(true)
  const [productSearch, setProductSearch] = useState("")
  const [productPage, setProductPage] = useState(1)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
  })
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const normalizedProductSearch = productSearch.trim().toLowerCase()
  const availableProducts = products
    .filter((product) => !quoteItems.some((item) => item.product.id === product.id))
    .filter((product) => {
      if (!normalizedProductSearch) return true

      const haystack = [product.name, product.brand, product.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return haystack.includes(normalizedProductSearch)
    })
  const availableProductPages = Math.max(
    1,
    Math.ceil(availableProducts.length / PRODUCT_PAGE_SIZE),
  )
  const safeProductPage = Math.min(productPage, availableProductPages)
  const paginatedAvailableProducts = availableProducts.slice(
    (safeProductPage - 1) * PRODUCT_PAGE_SIZE,
    safeProductPage * PRODUCT_PAGE_SIZE,
  )

  const totalQuantity = quoteItems.reduce((total, item) => total + item.quantity, 0)

  const addProduct = (product: Product) => {
    const existingItem = quoteItems.find((item) => item.product.id === product.id)
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1)
      return
    }

    setQuoteItems([...quoteItems, { product, quantity: 1 }])
  }

  const removeProduct = (productId: string) => {
    setQuoteItems(quoteItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId)
      return
    }

    setQuoteItems(
      quoteItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    )
  }

  const updateNotes = (productId: string, notes: string) => {
    setQuoteItems(
      quoteItems.map((item) =>
        item.product.id === productId ? { ...item, notes } : item,
      ),
    )
  }

  const calculateSubtotal = () =>
    quoteItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  const calculateVolumeDiscount = () => {
    const activeDiscount = volumeDiscounts.find(
      (discount) => totalQuantity >= discount.min && totalQuantity <= discount.max,
    )
    return activeDiscount?.discount ?? 0
  }

  const calculateInstallationCost = () => {
    if (!installationRequired) return 0
    return 150 + totalQuantity * 50
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountPercentage = calculateVolumeDiscount()
    const discountAmount = subtotal * (discountPercentage / 100)

    return subtotal - discountAmount + calculateInstallationCost()
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setQuoteItems([])
    setCustomerInfo({
      name: "",
      email: "",
      phone: "",
      address: "",
      company: "",
    })
    setAdditionalNotes("")
    setProductSearch("")
    setProjectType("commercial")
    setInstallationRequired(true)
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
        phone: customerInfo.phone || null,
        address: customerInfo.address,
        company: customerInfo.company || null,
      },
      products: quoteItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        notes: item.notes,
      })),
      project_type: projectType,
      installation_required: installationRequired,
      notes: additionalNotes.trim() || undefined,
    }

    try {
      if (onQuoteSubmit) {
        await onQuoteSubmit(quoteRequest)
      }
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting quote:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="overflow-hidden rounded-[2rem] border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_55%,#f0fdf4_100%)] shadow-[0_28px_90px_-60px_rgba(16,185,129,0.5)]">
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-emerald-500 text-white shadow-[0_18px_40px_-20px_rgba(16,185,129,0.75)]">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <CardTitle className="pt-3 text-3xl font-black text-emerald-900">
            Cotizacion preparada
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mx-auto max-w-2xl text-sm leading-7 text-emerald-800 sm:text-base">
            Tu solicitud ya quedo registrada para ventas. El equipo comercial ya puede revisarla en dashboard y responder con una propuesta por volumen.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={resetForm}
              className="rounded-full bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-500"
            >
              Crear nueva cotizacion
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
      <div className="space-y-6">
        <Card className="overflow-hidden rounded-[2rem] border-slate-200 bg-white shadow-[0_26px_90px_-62px_rgba(15,23,42,0.45)]">
          <CardHeader className="border-b border-slate-100 bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_100%)] pb-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-orange-500">
                  Seleccion de productos
                </p>
                <CardTitle className="mt-2 text-2xl font-black text-slate-950">
                  Arma la base de tu cotizacion
                </CardTitle>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                  Busca referencias, agrega equipos al pedido y deja una mezcla lista para negociar precio por volumen.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-orange-100 bg-orange-50 px-4 py-3 text-right">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
                  Activos
                </p>
                <p className="mt-1 text-2xl font-black text-slate-950">{quoteItems.length}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={productSearch}
                onChange={(event) => {
                  setProductSearch(event.target.value)
                  setProductPage(1)
                }}
                placeholder="Buscar por producto, marca o categoria"
                className="h-12 rounded-full border-slate-200 pl-11 text-sm"
              />
            </div>

            {availableProducts.length === 0 ? (
              <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                {products.length === quoteItems.length
                  ? "Todos los productos visibles ya estan dentro de la cotizacion."
                  : "No encontramos productos con esa busqueda."}
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                {paginatedAvailableProducts.map((product) => {
                  const image = getPrimaryImage(product)
                  const hasPromotion =
                    Boolean(product.onSale) &&
                    typeof product.originalPrice === "number" &&
                    product.originalPrice > product.price

                  return (
                    <article
                      key={product.id}
                      className={`flex items-center gap-4 rounded-[1.5rem] border p-3 transition ${
                        hasPromotion
                          ? "border-orange-200 bg-[linear-gradient(135deg,#fff7ed_0%,#fffaf5_100%)] hover:border-orange-300"
                          : "border-slate-200 bg-slate-50/80 hover:border-orange-300 hover:bg-orange-50/70"
                      }`}
                    >
                      <div className="relative aspect-square w-18 overflow-hidden rounded-[1rem] bg-white shadow-inner">
                        {hasPromotion ? (
                          <div className="absolute left-2 top-2 z-10 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-black text-white shadow-[0_12px_24px_-12px_rgba(249,115,22,0.9)]">
                            -{product.discountPercent ?? 0}%
                          </div>
                        ) : null}
                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-slate-100 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Somme
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-sm font-bold text-slate-900">
                          {product.name}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500">
                          {[product.brand, product.category].filter(Boolean).join(" • ") || "Producto disponible"}
                        </p>
                        <div className="mt-2">
                          {hasPromotion ? (
                            <p className="text-xs font-semibold text-slate-400 line-through">
                              ${formatPrice(product.originalPrice!)}
                            </p>
                          ) : null}
                          <p className={`text-base font-black ${hasPromotion ? "text-orange-600" : "text-slate-950"}`}>
                            ${formatPrice(product.price)}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={() => addProduct(product)}
                        className="rounded-full bg-slate-950 px-4 text-white hover:bg-orange-500"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar
                      </Button>
                    </article>
                  )
                  })}
                </div>

                {availableProductPages > 1 ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm text-slate-500">
                      Pagina <span className="font-bold text-slate-950">{safeProductPage}</span> de{" "}
                      <span className="font-bold text-slate-950">{availableProductPages}</span>
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setProductPage((current) => Math.max(1, current - 1))}
                        disabled={safeProductPage <= 1}
                        className="rounded-full"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setProductPage((current) =>
                            Math.min(availableProductPages, current + 1),
                          )
                        }
                        disabled={safeProductPage >= availableProductPages}
                        className="rounded-full"
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white shadow-[0_26px_90px_-62px_rgba(15,23,42,0.45)]">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-slate-950 text-white">
                <Package2 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-950">
                  Productos seleccionados
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Ajusta cantidades, deja notas y define la mezcla final.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            {quoteItems.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                <Calculator className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-600">
                  Agrega productos para comenzar la cotizacion.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {quoteItems.map((item) => {
                  const image = getPrimaryImage(item.product)
                  const hasPromotion =
                    Boolean(item.product.onSale) &&
                    typeof item.product.originalPrice === "number" &&
                    item.product.originalPrice > item.product.price

                  return (
                    <article
                      key={item.product.id}
                      className={`rounded-[1.5rem] border p-4 shadow-sm ${
                        hasPromotion
                          ? "border-orange-200 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_100%)]"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                        <div className="flex items-center gap-4">
                          <div className="relative aspect-square w-20 overflow-hidden rounded-[1rem] bg-slate-100">
                            {hasPromotion ? (
                              <div className="absolute left-2 top-2 z-10 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-black text-white shadow-[0_12px_24px_-12px_rgba(249,115,22,0.9)]">
                                -{item.product.discountPercent ?? 0}%
                              </div>
                            ) : null}
                            {image ? (
                              <img
                                src={image}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-slate-950">
                              {item.product.name}
                            </h4>
                            <p className="mt-1 text-xs text-slate-500">
                              {[item.product.brand, item.product.category].filter(Boolean).join(" • ")}
                            </p>
                            <div className="mt-2">
                              {hasPromotion ? (
                                <p className="text-xs font-semibold text-slate-400 line-through">
                                  ${formatPrice(item.product.originalPrice!)} c/u
                                </p>
                              ) : null}
                              <p className={`text-sm font-bold ${hasPromotion ? "text-orange-600" : "text-slate-950"}`}>
                                ${formatPrice(item.product.price)} c/u
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col gap-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="h-8 rounded-full px-3"
                              >
                                -
                              </Button>
                              <span className="min-w-10 px-2 text-center text-sm font-black text-slate-950">
                                {item.quantity}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="h-8 rounded-full px-3"
                              >
                                +
                              </Button>
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeProduct(item.product.id)}
                              className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              Quitar
                            </Button>
                          </div>

                          <Input
                            placeholder="Notas por item: color, ubicacion, prioridad, compatibilidad..."
                            value={item.notes || ""}
                            onChange={(event) => updateNotes(item.product.id, event.target.value)}
                            className="rounded-xl border-slate-200"
                          />
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-200 bg-white shadow-[0_24px_80px_-60px_rgba(15,23,42,0.4)]">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-orange-50 text-orange-600">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-950">
                  Cliente y proyecto
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Completa el contexto comercial y tecnico en un solo paso.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(event) =>
                        setCustomerInfo({ ...customerInfo, name: event.target.value })
                      }
                      placeholder="Nombre del contacto"
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(event) =>
                        setCustomerInfo({ ...customerInfo, email: event.target.value })
                      }
                      placeholder="correo@empresa.com"
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(event) =>
                        setCustomerInfo({ ...customerInfo, phone: event.target.value })
                      }
                      placeholder="+591 ..."
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={customerInfo.company}
                      onChange={(event) =>
                        setCustomerInfo({ ...customerInfo, company: event.target.value })
                      }
                      placeholder="Empresa o integrador"
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Direccion de instalacion *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(event) =>
                      setCustomerInfo({ ...customerInfo, address: event.target.value })
                    }
                    placeholder="Direccion, ciudad, zona y referencias del proyecto"
                    rows={5}
                    className="rounded-[1.25rem] border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="project-type">Tipo de proyecto</Label>
                  <Select
                    value={projectType}
                    onValueChange={(value: QuoteRequest["project_type"]) => setProjectType(value)}
                  >
                    <SelectTrigger id="project-type" className="h-12 rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-start gap-2">
                              <Icon className="mt-0.5 h-4 w-4" />
                              <div>
                                <div className="font-semibold">{type.label}</div>
                                <div className="text-xs text-slate-500">{type.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="installation"
                      checked={installationRequired}
                      onCheckedChange={(checked) => setInstallationRequired(Boolean(checked))}
                      className="mt-1"
                    />
                    <div>
                      <Label
                        htmlFor="installation"
                        className="flex items-center gap-2 text-sm font-bold text-slate-950"
                      >
                        <Wrench className="h-4 w-4 text-orange-500" />
                        Requiero servicio de instalacion
                      </Label>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Ideal para proyectos llave en mano, integracion y puesta en marcha.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    value={additionalNotes}
                    onChange={(event) => setAdditionalNotes(event.target.value)}
                    placeholder="Describe prioridades, volumen estimado, condiciones de entrega o cualquier detalle comercial relevante..."
                    rows={7}
                    className="rounded-[1.25rem] border-slate-200"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <Card className="overflow-hidden rounded-[2rem] border-slate-900 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-white shadow-[0_30px_100px_-55px_rgba(15,23,42,0.95)] xl:max-h-[calc(100vh-7rem)] xl:overflow-hidden">
          <CardHeader className="border-b border-white/10 px-4 pb-3 pt-4 sm:px-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[0.85rem] bg-orange-500 text-white shadow-[0_16px_34px_-18px_rgba(249,115,22,0.8)]">
                <Calculator className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-black text-white">
                  Resumen comercial
                </CardTitle>
                <p className="text-[11px] text-slate-300">
                  Todo lo necesario para enviar una solicitud clara.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent
            className="space-y-5 p-5 sm:p-6 xl:overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(148,163,184,0.45) transparent",
            }}
          >
            <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[0.9rem] border border-white/10 bg-white/5 px-3 py-2.5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">
                  Items
                </p>
                <p className="mt-1 text-xl font-black text-white">{quoteItems.length}</p>
              </div>
              <div className="rounded-[0.9rem] border border-white/10 bg-white/5 px-3 py-2.5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
                  Unidades
                </p>
                <p className="mt-1 text-xl font-black text-white">{totalQuantity}</p>
              </div>
              <div className="rounded-[0.9rem] border border-white/10 bg-white/5 px-3 py-2.5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                  Descuento
                </p>
                <p className="mt-1 text-xl font-black text-white">{calculateVolumeDiscount()}%</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-300">Subtotal</span>
                  <span className="font-bold text-white">${formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-300">Descuento por volumen</span>
                  <span className="font-bold text-emerald-300">
                    -${formatPrice(calculateSubtotal() * (calculateVolumeDiscount() / 100))}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-300">Instalacion</span>
                  <span className="font-bold text-white">
                    ${formatPrice(installationRequired ? calculateInstallationCost() : 0)}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-black uppercase tracking-[0.16em] text-orange-200">
                      Total referencial
                    </span>
                    <span className="text-2xl font-black text-white">
                      ${formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-300">
                Tramos de volumen
              </p>
              <div className="mt-3 space-y-2">
                {volumeDiscounts.map((discount) => {
                  const isActive = totalQuantity >= discount.min && totalQuantity <= discount.max

                  return (
                    <div
                      key={`${discount.min}-${discount.max}`}
                      className={`flex items-center justify-between rounded-full px-3 py-2 text-xs font-bold transition ${
                        isActive
                          ? "bg-orange-500 text-white"
                          : "bg-white/5 text-slate-300"
                      }`}
                    >
                      <span>{formatVolumeRange(discount.min, discount.max)}</span>
                      <span>{discount.discount}%</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={
                quoteItems.length === 0 ||
                !customerInfo.name ||
                !customerInfo.email ||
                !customerInfo.address ||
                isSubmitting
              }
              className="h-12 w-full rounded-full bg-orange-500 text-sm font-black text-white shadow-[0_18px_40px_-18px_rgba(249,115,22,0.85)] hover:bg-orange-400 disabled:opacity-50"
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Preparando solicitud...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Realizar solicitud
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
