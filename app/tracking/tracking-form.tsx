"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TrackingForm() {
  const [code, setCode] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) return
    setIsSearching(true)
    router.push(`/order-confirmation/${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Ej: ORD-1234567890-abc123"
        className="h-11 text-center text-sm"
        autoFocus
      />
      <Button type="submit" disabled={!code.trim() || isSearching} className="h-11 w-full rounded-xl">
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        Consultar pedido
      </Button>
    </form>
  )
}
