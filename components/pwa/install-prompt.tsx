"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

const DISMISSED_KEY = "pwa-install-dismissed"

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Si ya fue descartado antes, no mostrar nunca más
    if (localStorage.getItem(DISMISSED_KEY)) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true")
    setShowPrompt(false)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice

    if (result.outcome === "accepted") {
      console.log("PWA instalada")
    }

    // Si instaló o no, no volvemos a mostrar
    localStorage.setItem(DISMISSED_KEY, "true")
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
        <Button onClick={handleInstall} size="sm" className="mt-3 w-full rounded-xl">
          Instalar aplicación
        </Button>
      </div>
    </div>
  )
}
