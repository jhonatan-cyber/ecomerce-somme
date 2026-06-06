import { NextResponse } from "next/server"

export async function proxyStoreGet(remoteUrl: string, errorMessage: string) {
  console.log(`[proxyStoreGet] Fetching from: ${remoteUrl}`)
  try {
    const response = await fetch(remoteUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    })

    console.log(`[proxyStoreGet] Response status: ${response.status}`)

    const payload = await response.text()

    return new NextResponse(payload, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
        "Cache-Control": response.headers.get("cache-control") ?? "no-store",
      },
    })
  } catch (error) {
    console.error(`[proxyStoreGet] ${errorMessage}`, error)
    return NextResponse.json({ error: errorMessage }, { status: 502 })
  }
}
