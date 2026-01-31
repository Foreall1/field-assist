import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client (voor gebruik in React components)
export function createClientComponentClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server-side Supabase client (voor gebruik in API routes en Server Components)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Singleton instance voor client-side gebruik
let clientInstance: ReturnType<typeof createClientComponentClient> | null = null

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side: altijd nieuwe instance
    return createServerClient()
  }

  // Client-side: hergebruik bestaande instance
  if (!clientInstance) {
    clientInstance = createClientComponentClient()
  }
  return clientInstance
}
