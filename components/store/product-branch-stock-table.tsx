"use client"

import { useEffect, useMemo, useState } from "react"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"

type StoreBranch = {
  id: string
  name: string
  type: "Sucursal" | "Deposito"
}

function QuantityControls({
  branchId,
  branchName,
  stock,
  quantity,
  onIncrement,
  onDecrement,
}: {
  branchId: string
  branchName: string
  stock: number
  quantity: number
  onIncrement: (branchId: string, stock: number) => void
  onDecrement: (branchId: string) => void
}) {
  const hasStock = stock > 0

  return (
    <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 sm:flex sm:gap-1.5">
      <button
        type="button"
        onClick={() => onDecrement(branchId)}
        disabled={quantity <= 0}
        className="h-10 rounded-md border border-border bg-background text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 sm:h-8 sm:w-8"
        aria-label={`Restar cantidad en ${branchName}`}
      >
        -
      </button>
      <input
        type="number"
        value={quantity}
        readOnly
        className="h-10 min-w-0 rounded-md border border-border bg-background px-2 text-center text-sm font-semibold sm:h-8 sm:w-14 sm:text-xs"
      />
      <button
        type="button"
        onClick={() => onIncrement(branchId, stock)}
        disabled={!hasStock || quantity >= stock}
        className="h-10 rounded-md border border-border bg-background text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 sm:h-8 sm:w-8"
        aria-label={`Sumar cantidad en ${branchName}`}
      >
        +
      </button>
    </div>
  )
}

export function ProductBranchStockTable({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const [branches, setBranches] = useState<StoreBranch[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    let mounted = true

    const readLocations = async () => {
      const endpoints: Array<{ url: string; type: "Sucursal" | "Deposito" }> = [
        { url: "/api/store/branches", type: "Sucursal" },
        { url: "/api/store/deposits", type: "Deposito" },
        { url: "/api/store/warehouses", type: "Deposito" },
      ]
      const results = await Promise.all(
        endpoints.map(async ({ url, type }) => {
          try {
            const response = await fetch(url, { cache: "no-store" })
            const payload = (await response.json().catch(() => null)) as {
              data?: Array<{ id: string; name: string }>
            } | null
            if (!response.ok || !Array.isArray(payload?.data)) return []
            return payload.data.map((item) => ({ id: item.id, name: item.name, type }))
          } catch {
            return []
          }
        }),
      )

      if (!mounted) return

      const merged = results.flat()
      const unique = merged.filter(
        (row, index, arr) =>
          index === arr.findIndex((item) => (item.id === row.id || item.name === row.name) && item.type === row.type),
      )
      setBranches(unique)
    }

    void readLocations()

    return () => {
      mounted = false
    }
  }, [])

  const rows = useMemo(() => {
    const branchStockMap = new Map((product.branchStocks ?? []).map((row) => [row.branchId, row.stock]))

    if (branches.length > 0) {
      return branches.map((branch) => ({
        branchId: branch.id,
        branchName: branch.name,
        stock: branchStockMap.get(branch.id) ?? 0,
        type: branch.type,
      }))
    }

    if (product.branchStocks && product.branchStocks.length > 0) {
      return product.branchStocks.map((row) => ({
        branchId: row.branchId,
        branchName: row.branchName,
        stock: row.stock,
        type:
          row.branchType === "warehouse"
            ? ("Deposito" as const)
            : row.branchType === "branch"
              ? ("Sucursal" as const)
              : row.branchName.toLowerCase().includes("dep")
                ? ("Deposito" as const)
                : ("Sucursal" as const),
      }))
    }

    return [
      {
        branchId: "general",
        branchName: "Sucursal principal",
        stock: Math.max(0, product.stock),
        type: "Sucursal" as const,
      },
    ]
  }, [branches, product.branchStocks, product.stock])

  const increment = (branchId: string, stock: number) => {
    const current = quantities[branchId] ?? 0
    const next = Math.min(stock, current + 1)
    if (next === current) return
    setQuantities((prev) => ({ ...prev, [branchId]: next }))
    addItem(product)
  }

  const decrement = (branchId: string) => {
    const current = quantities[branchId] ?? 0
    const next = Math.max(0, current - 1)
    if (next === current) return
    setQuantities((prev) => ({ ...prev, [branchId]: next }))

    const cartItem = items.find((item) => item.id === product.id)
    if (!cartItem) return
    if (cartItem.quantity <= 1) {
      removeItem(product.id)
      return
    }
    updateQuantity(product.id, cartItem.quantity - 1)
  }

  return (
    <div className="mt-4 rounded-xl border border-border/70 bg-background p-3 sm:rounded-2xl sm:p-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Stock por sucursal
      </p>

      <div className="space-y-2 sm:hidden">
        {rows.map((row) => (
          <div key={row.branchId} className="rounded-lg border border-border/70 bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-foreground">{row.branchName}</p>
                <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{row.type}</p>
              </div>
              <p className="shrink-0 text-sm font-black text-foreground">{Math.max(0, row.stock)}</p>
            </div>
            <div className="mt-3">
              <QuantityControls
                branchId={row.branchId}
                branchName={row.branchName}
                stock={row.stock}
                quantity={quantities[row.branchId] ?? 0}
                onIncrement={increment}
                onDecrement={decrement}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left">
              <th className="w-[38%] px-2 py-2 font-semibold text-foreground">Sucursal / Deposito</th>
              <th className="w-[18%] px-2 py-2 font-semibold text-foreground">Tipo</th>
              <th className="w-[18%] px-2 py-2 font-semibold text-foreground">Stock</th>
              <th className="w-[26%] px-2 py-2 font-semibold text-foreground">Agregar</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.branchId} className="border-b border-border/50 last:border-b-0">
                <td className="break-words px-2 py-2 text-foreground">{row.branchName}</td>
                <td className="px-2 py-2 text-xs font-semibold text-muted-foreground">{row.type}</td>
                <td className="px-2 py-2 font-semibold">{`${Math.max(0, row.stock)} unidades`}</td>
                <td className="px-2 py-2">
                  <QuantityControls
                    branchId={row.branchId}
                    branchName={row.branchName}
                    stock={row.stock}
                    quantity={quantities[row.branchId] ?? 0}
                    onIncrement={increment}
                    onDecrement={decrement}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
