import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// CSP en modo Report-Only: observa violaciones sin romper nada.
// next-themes inyecta un script inline sin nonce y el registro del SW también
// es inline (app/layout.tsx), así que un CSP enforcing los tumbaría.
// Endurecer cuando los reportes confirmen 0 violaciones: quitar
// 'unsafe-inline'/'unsafe-eval', agregar nonces y pasar a
// Content-Security-Policy.
function buildReportOnlyCsp(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.pusher.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ")
}

export default function proxy(_request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set("Content-Security-Policy-Report-Only", buildReportOnlyCsp())
  return response
}

export const config = {
  // Fuera: API, estáticos, SW e imágenes optimizadas (ruido en reportes).
  matcher: ["/((?!api|_next/static|_next/image|sw.js|workbox-.*|manifest.json|icons|img).*)"],
}
