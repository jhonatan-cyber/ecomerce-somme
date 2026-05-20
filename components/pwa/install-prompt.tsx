"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

const DISMISSED_KEY = "pwa-install-dismissed"

function isDismissed(): boolean {
  try {
    return !!localStorage.getItem(DISMISSED_KEY)
  } catch {
    return false
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(DISMISSED_KEY, "true")
  } catch {
    // Modo incógnito / localStorage no disponible
  }
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const dismissedRef = useRef(isDismissed())

  useEffect(() => {
    // Si ya fue descartado antes, no escuchar el evento
    if (dismissedRef.current) return

    const handler = (e: Event) => {
      // Doble guardia: si ya se descartó entre medio, ignorar
      if (dismissedRef.current || isDismissed()) return
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const dismiss = () => {
    dismissedRef.current = true
    markDismissed()
    setShowPrompt(false)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice

    if (result.outcome === "accepted") {
      console.log("PWA instalada")
    }

    dismissedRef.current = true
    markDismissed()
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm animate-in slide-in-from-bottom-4">
      <div className="rounded-2xl border bg-card p-4 shadow-lg">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Instalar SommeTech</p>
              <p className="text-xs text-muted-foreground">Accedé rápido desde tu pantalla de inicio</p>
            </div>
          </div>
          <button onClick={dismiss} className="shrink-0" aria-label="Ahora no">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <Button onClick={dismiss} variant="outline" size="sm" className="flex-1 rounded-xl">
            Ahora no
          </Button>
          <Button onClick={handleInstall} size="sm" className="flex-1 rounded-xl">
            Instalar
          </Button>
        </div>
      </div>
    </div>
  )
}
