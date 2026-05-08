import { NextResponse } from "next/server"

export async function proxyStoreGet(remoteUrl: string, errorMessage: string) {
  try {
    const response = await fetch(remoteUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    })

    const payload = await response.text()

    return new NextResponse(payload, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
        "Cache-Control": response.headers.get("cache-control") ?? "no-store",
      },
    })
  } catch (error) {
    console.error(errorMessage, error)
    return NextResponse.json({ error: errorMessage }, { status: 502 })
  }
}
