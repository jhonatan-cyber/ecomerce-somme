"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CreditCard, Loader2, ShieldCheck, Store, Truck } from "lucide-react"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createOrder } from "@/lib/api-create-order"
import { useCartStore } from "@/lib/store/cart-store"
import { useToast } from "@/hooks/use-toast"

type CheckoutFormValues = {
  name: string
  email: string
  phone: string
  address: string
  deliveryMethod: "pickup" | "delivery"
  branchId?: string
  notes?: string
}

const checkoutSchema = z
  .object({
    name: z.string().min(1, "Nombre requerido"),
    email: z.string().email("Email inválido"),
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

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const router = useRouter()
  const { toast } = useToast()
  const [branches, setBranches] = useState<StoreBranch[]>([])
  const [isLoadingBranches, setIsLoadingBranches] = useState(false)

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

  if (items.length === 0) return null

  const subtotal = getTotal()
  const shippingFee = deliveryMethod === "delivery" ? 0 : 0 // Envío a coordinar, sin costo automático
  const finalTotal = subtotal + shippingFee

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      const selectedBranch = branches.find((branch) => branch.id === data.branchId)
      const pickupBranchLabel =
        selectedBranch?.address?.trim()
          ? `${selectedBranch.name} - ${selectedBranch.address.trim()}`
          : selectedBranch?.name ?? "Recoger en tienda"

      const result = await createOrder({
        customer: {
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          address:
            data.deliveryMethod === "delivery"
              ? (data.address?.trim() ?? "")
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
        deliveryMethod: data.deliveryMethod,
        paymentMethod: "qr",
        notes:
          data.deliveryMethod === "delivery"
            ? "Metodo de entrega: envio - Costo a coordinar con cliente"
            : `Metodo de entrega: recoger en tienda${selectedBranch ? ` - Sucursal: ${selectedBranch.name}` : ""}${selectedBranch ? ` [pickup_branch_id:${selectedBranch.id}] [pickup_branch_name:${selectedBranch.name}]` : ""}`,
      })

      if (!result.success || !result.orderId) {
        throw new Error(result.message || "Error al crear el pedido")
      }

      clearCart()
      
      // Determinar si el pedido se guardó localmente
      const isLocalOrder = result.message?.includes('guardado localmente')
      
      toast({
        title: "Pedido pendiente registrado",
        description: `Tu pedido #${result.orderId.slice(0, 8)} quedó pendiente. ${isLocalOrder ? "Lo guardamos temporalmente" : "Lo registramos correctamente"} y te contactaremos por WhatsApp.`,
        variant: isLocalOrder ? "default" : "default",
      })
      
      router.push(`/order-confirmation/${result.orderId}`)
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo procesar tu pedido. Intentá nuevamente.",
        variant: "destructive",
      })
    }
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
                      className="h-12 rounded-2xl"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan@ejemplo.com"
                      className="h-12 rounded-2xl"
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
                      className="h-12 rounded-2xl"
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
                        <SelectTrigger className="h-12 rounded-2xl">
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

                <Button type="submit" className="h-12 rounded-2xl" disabled={isSubmitting}>
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
                      BOB {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border bg-background px-4 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">BOB {subtotal.toLocaleString()}</span>
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
                  <span className="text-2xl font-black">BOB {finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
