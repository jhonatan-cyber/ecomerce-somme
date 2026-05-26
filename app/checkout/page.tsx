"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CreditCard, Loader2, MessageCircle, ShieldCheck, Store, Truck } from "lucide-react"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createOrder } from "@/lib/api-create-order"
import { rewriteImageUrl } from "@/lib/api"
import { useCartStore } from "@/lib/store/cart-store"
import { useToast } from "@/hooks/use-toast"

type CheckoutFormValues = {
  name: string
  email?: string
  phone: string
  address: string
  deliveryMethod: "pickup" | "delivery"
  branchId?: string
  notes?: string
}

const checkoutSchema = z
  .object({
    name: z.string().min(1, "Nombre requerido"),
    email: z.union([z.string().email("Email inválido"), z.literal("")]).optional(),
    phone: z.string().min(1, "Teléfono requerido"),
    address: z.string().optional(),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    branchId: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === "delivery" && !data.address?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Dirección requerida para envíos",
      })
    }

    if (data.deliveryMethod === "pickup" && !data.branchId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["branchId"],
        message: "Selecciona una sucursal para recoger tu pedido",
      })
    }
  })

type StoreBranch = {
  id: string
  name: string
  address?: string | null
  phone?: string | null
  email?: string | null
  type: string
}

type PickupConfirmationNotice = {
  orderId: string
  branchName: string
  branchAddress: string
  mapsUrl: string
  mapsEmbedUrl: string
  requiresPayment: boolean
}

type DeliveryConfirmationNotice = {
  orderId: string
  orderCode: string
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      const [, base64Payload = ""] = result.split(",", 2)
      resolve(base64Payload)
    }
    reader.onerror = () => reject(new Error("No se pudo leer el voucher"))
    reader.readAsDataURL(file)
  })
}

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const router = useRouter()
  const { toast } = useToast()
  const [branches, setBranches] = useState<StoreBranch[]>([])
  const [isLoadingBranches, setIsLoadingBranches] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [pendingCheckoutData, setPendingCheckoutData] = useState<CheckoutFormValues | null>(null)
  const [createdOrderDeliveryMethod, setCreatedOrderDeliveryMethod] = useState<"pickup" | "delivery" | null>(null)
  const [qrReadDetected, setQrReadDetected] = useState(false)
  const [voucherFile, setVoucherFile] = useState<File | null>(null)
  const [voucherPreviewUrl, setVoucherPreviewUrl] = useState<string | null>(null)
  const [isDraggingVoucher, setIsDraggingVoucher] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [pickupNotice, setPickupNotice] = useState<PickupConfirmationNotice | null>(null)
  const [deliveryNotice, setDeliveryNotice] = useState<DeliveryConfirmationNotice | null>(null)
  const [checkoutQrImageUrl, setCheckoutQrImageUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      deliveryMethod: "pickup",
      branchId: "",
    },
  })

  const deliveryMethod = watch("deliveryMethod")
  const selectedBranchId = watch("branchId")

  useEffect(() => {
    if (items.length === 0) router.push("/cart")
  }, [items.length, router])

  useEffect(() => {
    if (deliveryMethod !== "pickup") {
      setValue("branchId", "")
      return
    }

    let isMounted = true
    setIsLoadingBranches(true)

    void fetch("/api/store/branches", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            typeof payload?.error === "string"
              ? payload.error
              : "No se pudieron cargar las sucursales",
          )
        }

        return Array.isArray(payload?.data) ? (payload.data as StoreBranch[]) : []
      })
      .then((data) => {
        if (!isMounted) return
        setBranches(data)
      })
      .catch((error) => {
        if (!isMounted) return
        setBranches([])
        toast({
          title: "No se pudieron cargar las sucursales",
          description: error instanceof Error ? error.message : "Intentá nuevamente.",
          variant: "destructive",
        })
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingBranches(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [deliveryMethod, setValue, toast])

  useEffect(() => {
    let isMounted = true

    void fetch("/api/store/settings", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json().catch(() => null)
        if (!response.ok) return null
        const configuredUrl = payload?.data?.checkoutQrImageUrl
        if (typeof configuredUrl !== "string" || !configuredUrl.trim()) return null
        return rewriteImageUrl(configuredUrl.trim())
      })
      .then((configuredUrl) => {
        if (!isMounted || !configuredUrl) return
        setCheckoutQrImageUrl(configuredUrl)
      })
      .catch(() => {
        // Keep null when there is no configured QR.
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!qrModalOpen) {
      setQrReadDetected(false)
      setVoucherFile(null)
      if (voucherPreviewUrl) {
        URL.revokeObjectURL(voucherPreviewUrl)
      }
      setVoucherPreviewUrl(null)
    }
  }, [qrModalOpen, voucherPreviewUrl])

  if (items.length === 0) return null

  const subtotal = getTotal()
  const shippingFee = deliveryMethod === "delivery" ? 0 : 0 // Envío a coordinar, sin costo automático
  const finalTotal = subtotal + shippingFee

  const onSubmit = async (data: CheckoutFormValues) => {
    setPendingCheckoutData(data)
    setCreatedOrderDeliveryMethod(data.deliveryMethod)
    setQrModalOpen(true)
  }

  const finalizeOrder = async (options: { allowWithoutPayment: boolean }) => {
    if (!pendingCheckoutData) return

    setIsCreatingOrder(true)
    try {
      let voucherImagePayload: {
        fileName: string
        mimeType: string
        size: number
        dataBase64: string
      } | null = null

      if (!options.allowWithoutPayment && voucherFile) {
        voucherImagePayload = {
          fileName: voucherFile.name,
          mimeType: voucherFile.type || "application/octet-stream",
          size: voucherFile.size,
          dataBase64: await fileToBase64(voucherFile),
        }
      }

      const selectedBranch = branches.find((branch) => branch.id === pendingCheckoutData.branchId)
      const pickupBranchLabel =
        selectedBranch?.address?.trim()
          ? `${selectedBranch.name} - ${selectedBranch.address.trim()}`
          : selectedBranch?.name ?? "Recoger en tienda"

      const paymentNote = options.allowWithoutPayment
        ? "Pago pendiente: cliente continuó sin pagar desde checkout."
        : voucherFile
          ? `Voucher adjunto en checkout: ${voucherFile.name}`
          : "Pago confirmado por cliente desde checkout."

      const result = await createOrder({
        customer: {
          name: pendingCheckoutData.name.trim(),
          email: pendingCheckoutData.email?.trim() ?? "",
          phone: pendingCheckoutData.phone.trim(),
          address:
            pendingCheckoutData.deliveryMethod === "delivery"
              ? (pendingCheckoutData.address?.trim() ?? "")
              : pickupBranchLabel,
        },
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
        })),
        total: finalTotal,
        tax: shippingFee,
        deliveryMethod: pendingCheckoutData.deliveryMethod,
        paymentMethod: "qr",
        voucherImage: voucherImagePayload,
        notes:
          pendingCheckoutData.deliveryMethod === "delivery"
            ? `Metodo de entrega: envio - Costo a coordinar con cliente | ${paymentNote}`
            : `Metodo de entrega: recoger en tienda${selectedBranch ? ` - Sucursal: ${selectedBranch.name}` : ""}${selectedBranch ? ` [pickup_branch_id:${selectedBranch.id}] [pickup_branch_name:${selectedBranch.name}]` : ""} | ${paymentNote}`,
      })

      if (!result.success || !result.orderId) {
        throw new Error(result.message || "Error al crear el pedido")
      }

      setQrModalOpen(false)

      if (pendingCheckoutData.deliveryMethod === "pickup") {
        const branchName = selectedBranch?.name ?? "Sucursal seleccionada"
        const branchAddress =
          selectedBranch?.address?.trim() ||
          "Dirección no disponible. Nuestro equipo te la compartirá por WhatsApp."
        const normalizedBranchName = branchName.toLowerCase()
        const mapsUrl =
          normalizedBranchName.includes("panamerica") || normalizedBranchName.includes("panamericana")
            ? "https://maps.app.goo.gl/PQKkvfRkdFt88pcGA"
            : normalizedBranchName.includes("norte")
              ? "https://maps.app.goo.gl/znq76fQwKiCmvY8u7"
              : selectedBranch?.address?.trim()
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBranch.address)}`
                : "https://www.google.com/maps"
        const mapsEmbedUrl =
          normalizedBranchName.includes("panamerica") || normalizedBranchName.includes("panamericana")
            ? "https://www.google.com/maps?q=-17.41924438418252,-66.15812486112041&z=16&output=embed"
            : normalizedBranchName.includes("norte")
              ? "https://www.google.com/maps?q=-17.364017653023595,-66.16585241128982&z=16&output=embed"
              : selectedBranch?.address?.trim()
                ? `https://www.google.com/maps?q=${encodeURIComponent(selectedBranch.address)}&output=embed`
                : "https://www.google.com/maps?q=Cochabamba&output=embed"

        setPickupNotice({
          orderId: result.orderId,
          branchName,
          branchAddress,
          mapsUrl,
          mapsEmbedUrl,
          requiresPayment: options.allowWithoutPayment,
        })
      } else {
        setDeliveryNotice({
          orderId: result.orderId,
          orderCode: (result.orderCode ?? result.orderId.slice(0, 8)).toUpperCase(),
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo procesar tu pedido. Intentá nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handleAcknowledgePickupNotice = () => {
    if (!pickupNotice) return
    const orderId = pickupNotice.orderId
    setPickupNotice(null)
    clearCart()
    router.push(`/order-confirmation/${orderId}`)
  }

  const handleAcknowledgeDeliveryNotice = () => {
    if (!deliveryNotice) return
    const orderId = deliveryNotice.orderId
    setDeliveryNotice(null)
    clearCart()
    router.push(`/order-confirmation/${orderId}`)
  }

  const handleVoucherFileSelect = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Archivo no válido",
        description: "Subí una imagen para el voucher (JPG, PNG, WEBP, etc).",
        variant: "destructive",
      })
      return
    }

    if (voucherPreviewUrl) {
      URL.revokeObjectURL(voucherPreviewUrl)
    }

    const previewUrl = URL.createObjectURL(file)
    setVoucherFile(file)
    setVoucherPreviewUrl(previewUrl)
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Checkout</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Finalizar compra</h1>
          <p className="mt-2 text-muted-foreground">
            Completá tus datos y cerrá la operación con una experiencia más premium.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[2rem] border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-black tracking-tight">
                Informacion del pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
                {/* Delivery method */}
                <div className="space-y-3">
                  <Label>Metodo de entrega</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label
                      className={`cursor-pointer rounded-[1.5rem] border p-4 text-left transition ${
                        deliveryMethod === "pickup"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/70 bg-background hover:border-primary/30"
                      }`}
                    >
                      <input
                        type="radio"
                        value="pickup"
                        className="sr-only"
                        {...register("deliveryMethod")}
                      />
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Store className="h-4 w-4 text-primary" />
                        Recoger en tienda
                      </span>
                      <p className="mt-2 text-sm text-muted-foreground">
                        El cliente pasa a recoger sus productos.
                      </p>
                    </label>
                    <label
                      className={`cursor-pointer rounded-[1.5rem] border p-4 text-left transition ${
                        deliveryMethod === "delivery"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/70 bg-background hover:border-primary/30"
                      }`}
                    >
                      <input
                        type="radio"
                        value="delivery"
                        className="sr-only"
                        {...register("deliveryMethod")}
                      />
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Truck className="h-4 w-4 text-primary" />
                        Envio
                      </span>
                      <p className="mt-2 text-sm text-muted-foreground">
                        El costo de envío se coordina directamente con el cliente.
                      </p>
                    </label>
                  </div>
                </div>

                {/* Name + Email */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      placeholder="Juan Pérez"
                      className="h-12 rounded-full"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan@ejemplo.com"
                      className="h-12 rounded-full"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone + Branch/Address */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+54 11 5555 0000"
                      className="h-12 rounded-full"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                  {deliveryMethod === "delivery" ? (
                    <div className="space-y-2">
                      <Label htmlFor="address">Direccion de envio *</Label>
                      <Textarea
                        id="address"
                        placeholder="Calle Principal 123, ciudad, provincia"
                        rows={4}
                        className="rounded-2xl"
                        {...register("address")}
                      />
                      {errors.address && (
                        <p className="text-xs text-destructive">{errors.address.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Sucursal para recoger *</Label>
                      <Select
                        value={selectedBranchId || ""}
                        onValueChange={(value) => setValue("branchId", value, { shouldValidate: true })}
                      >
                        <SelectTrigger className="h-12 w-full rounded-full">
                          <SelectValue
                            placeholder={isLoadingBranches ? "Cargando sucursales..." : "Selecciona una sucursal"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedBranchId ? (
                        <p className="text-xs text-muted-foreground">
                          {branches.find((branch) => branch.id === selectedBranchId)?.address || "Sucursal seleccionada"}
                        </p>
                      ) : null}
                      {errors.branchId && (
                        <p className="text-xs text-destructive">{errors.branchId.message}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Trust badges */}
                <div className="rounded-[1.6rem] border bg-slate-950 p-5 text-sm text-slate-200">
                  <p className="inline-flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4 text-cyan-300" /> Tus datos se usan solo para
                    procesar el pedido.
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 font-semibold">
                    <Truck className="h-4 w-4 text-cyan-300" /> Te contactamos para coordinar envio
                    o entrega.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-full bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] text-white hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando pedido...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" /> Confirmar pedido
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order summary */}
          <Card className="h-fit rounded-[2rem] border-border/70 shadow-xl shadow-slate-950/5 xl:sticky xl:top-32">
            <CardHeader>
              <CardTitle className="text-2xl font-black tracking-tight">
                Resumen del pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 rounded-2xl bg-muted/60 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <span className="font-bold">
                      BOB {(item.price * item.quantity).toLocaleString("es-BO")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border bg-background px-4 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">BOB {subtotal.toLocaleString("es-BO")}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Entrega</span>
                  <span className="font-semibold">
                    {deliveryMethod === "delivery" ? "Con envio" : "Recoge el cliente"}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cargo por envio</span>
                  <span className="font-semibold text-amber-600">
                    {deliveryMethod === "delivery" ? "A coordinar" : "Sin recargo"}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-2xl font-black">BOB {finalTotal.toLocaleString("es-BO")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <StoreFooter />

      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-lg">
          <div className="overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle>Escaneá el QR para pagar</DialogTitle>
              <DialogDescription>
                Realizá el pago y luego continuá para ver el detalle de tu pedido.
              </DialogDescription>
            </DialogHeader>

            {!qrReadDetected && checkoutQrImageUrl ? (
              <Image
                src={checkoutQrImageUrl}
                alt="QR de pago"
                width={720}
                height={1102}
                className="mx-auto mt-4 h-auto w-full max-w-[340px]"
                priority
                unoptimized
              />
            ) : !qrReadDetected ? (
              <div className="mt-4 rounded-2xl border bg-muted/30 p-4 text-center">
                <p className="text-base font-semibold">Próximamente</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  El pago con QR estará disponible en breve.
                </p>
              </div>
            ) : null}

            {qrReadDetected ? (
              <div className="mt-5 space-y-2">
                <Label htmlFor="voucher-upload">Subir voucher de pago</Label>
                <label
                  htmlFor="voucher-upload"
                  onDragOver={(event) => {
                    event.preventDefault()
                    setIsDraggingVoucher(true)
                  }}
                  onDragLeave={() => setIsDraggingVoucher(false)}
                  onDrop={(event) => {
                    event.preventDefault()
                    setIsDraggingVoucher(false)
                    handleVoucherFileSelect(event.dataTransfer.files?.[0] ?? null)
                  }}
                  className={`flex min-h-28 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed px-4 py-5 text-center transition ${
                    isDraggingVoucher
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Arrastrá tu imagen aquí
                    </p>
                    <p className="text-xs text-muted-foreground">
                      o hacé clic para seleccionar desde tu dispositivo
                    </p>
                  </div>
                </label>
                <Input
                  id="voucher-upload"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleVoucherFileSelect(event.target.files?.[0] ?? null)}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  {voucherFile ? `Imagen seleccionada: ${voucherFile.name}` : "Adjuntá una imagen del pago."}
                </p>
                {voucherPreviewUrl ? (
                  <div className="rounded-2xl border bg-card p-2">
                    <Image
                      src={voucherPreviewUrl}
                      alt="Previsualización del voucher"
                      width={1200}
                      height={900}
                      className="h-auto max-h-64 w-full rounded-xl object-contain"
                      unoptimized
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">
                Escaneá el QR y presioná <span className="font-semibold">Ya pagué</span> para cargar tu voucher.
              </p>
            )}
          </div>

          <DialogFooter className="justify-center border-t px-6 py-4 sm:justify-center">
            {!qrReadDetected ? (
              <>
                {createdOrderDeliveryMethod === "pickup" ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isCreatingOrder}
                    className="w-full border-transparent bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] text-white hover:opacity-90 sm:w-auto"
                    onClick={() => void finalizeOrder({ allowWithoutPayment: true })}
                  >
                    Continuar sin pagar
                  </Button>
                ) : null}
                {checkoutQrImageUrl ? (
                  <Button
                    type="button"
                    disabled={isCreatingOrder}
                    className="w-full bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] text-white hover:opacity-90 sm:w-auto"
                    onClick={() => setQrReadDetected(true)}
                  >
                    Ya pagué
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-full sm:w-auto"
                    onClick={() => setQrModalOpen(false)}
                  >
                    Entendido
                  </Button>
                )}
              </>
            ) : (
              <Button
                type="button"
                disabled={isCreatingOrder || !voucherFile}
                className="w-full bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                onClick={() => void finalizeOrder({ allowWithoutPayment: false })}
              >
                {isCreatingOrder ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                  </>
                ) : (
                  "Confirmar"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={pickupNotice !== null} onOpenChange={() => {}}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-lg"
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Compra realizada</DialogTitle>
            <DialogDescription>
              {pickupNotice?.requiresPayment
                ? "Tu pedido fue registrado. Pasá a pagar y recoger en la sucursal seleccionada."
                : "Tu pedido fue registrado para recojo en sucursal."}
            </DialogDescription>
          </DialogHeader>

          {pickupNotice ? (
            <div className="space-y-4">
              <div className="rounded-2xl border bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">{pickupNotice.branchName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{pickupNotice.branchAddress}</p>
              </div>

              <div className="overflow-hidden rounded-2xl border">
                <iframe
                  title={`Mapa de ${pickupNotice.branchName}`}
                  src={pickupNotice.mapsEmbedUrl}
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <Button
                type="button"
                className="w-full bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] text-white hover:opacity-90"
                onClick={() => window.open(pickupNotice.mapsUrl, "_blank", "noopener,noreferrer")}
              >
                Abrir en Google Maps
              </Button>
            </div>
          ) : null}

          <DialogFooter className="justify-center sm:justify-center">
            <Button
              type="button"
              className="w-full bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] text-white hover:opacity-90 sm:w-auto"
              onClick={handleAcknowledgePickupNotice}
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deliveryNotice !== null} onOpenChange={() => {}}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-lg"
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Compra registrada</DialogTitle>
            <DialogDescription>
              Tu compra fue generada correctamente. Nos pondremos en contacto para coordinar la entrega.
            </DialogDescription>
          </DialogHeader>

          {deliveryNotice ? (
            <div className="space-y-4">
              <div className="rounded-2xl border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">
                  Pedido: <span className="font-semibold text-foreground">#{deliveryNotice.orderCode}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  También podés escribirnos para coordinar tu entrega.
                </p>
              </div>

              <Button
                type="button"
                className="w-full bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] text-white hover:opacity-90"
                onClick={() => {
                  window.open(
                    `https://wa.me/59179960578?text=${encodeURIComponent(`Hola, realicé la compra #${deliveryNotice.orderCode} y deseo coordinar la entrega.`)}`,
                    "_blank",
                    "noopener,noreferrer",
                  )
                  handleAcknowledgeDeliveryNotice()
                }}
              >
                <MessageCircle className="h-4 w-4" /> Escribir por WhatsApp
              </Button>
            </div>
          ) : null}

          <DialogFooter className="justify-center sm:justify-center">
            <Button
              type="button"
              className="w-full bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] text-white hover:opacity-90 sm:w-auto"
              onClick={handleAcknowledgeDeliveryNotice}
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
