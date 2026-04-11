import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: {
        getItem: (key: string) => {
          return request.cookies.get(key)?.value ?? null
        },
        setItem: (key: string, value: string) => {
          response.cookies.set(key, value, {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
          })
        },
        removeItem: (key: string) => {
          response.cookies.delete(key)
        },
      },
    },
  })

  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Proteger rutas del admin
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  // Redirigir si ya está autenticado y trata de acceder al login
  if (request.nextUrl.pathname === "/admin/login" && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
