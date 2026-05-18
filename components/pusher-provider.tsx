"use client"

import { useEffect, useRef } from "react"

export function PusherProvider() {
  const cleanupRef = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "us2"

    if (!key) return

    let cancelled = false

    ;(async () => {
      const PusherModule = await import("pusher-js")
      if (cancelled) return
      const Pusher = PusherModule.default
      const pusher = new Pusher(key, { cluster })
      const syncChannel = pusher.subscribe("storefront-sync-channel")

      const handler = (payload: { resource?: string }) => {
        if (cancelled) return
        if (
          !payload?.resource ||
          ["products", "categories", "brands", "promotions", "slides", "ads"].includes(payload.resource)
        ) {
          window.location.reload()
        }
      }

      syncChannel.bind("storefront-content-updated", handler)

      cleanupRef.current = () => {
        syncChannel.unbind("storefront-content-updated", handler)
        pusher.unsubscribe("storefront-sync-channel")
        pusher.disconnect()
      }
    })()

    return () => {
      cancelled = true
      cleanupRef.current?.()
    }
  }, [])

  return null
}
