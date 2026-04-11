import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function getSupabaseServerClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: {
        getItem: (key: string) => {
          const cookie = cookieStore.get(key)
          return cookie?.value ?? null
        },
        setItem: (key: string, value: string) => {
          try {
            cookieStore.set(key, value, {
              maxAge: 60 * 60 * 24 * 7, // 1 week
              path: "/",
            })
          } catch (error) {
            // Ignore errors from Server Components
          }
        },
        removeItem: (key: string) => {
          try {
            cookieStore.delete(key)
          } catch (error) {
            // Ignore errors from Server Components
          }
        },
      },
    },
  })
}
