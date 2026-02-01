import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Check if we're in build time (no environment variables)
const isBuildTime = !supabaseUrl || !supabaseAnonKey

// Client-side Supabase client (voor gebruik in React components)
export function createClientComponentClient() {
  if (isBuildTime) {
    // Return a dummy client during build time that will throw on actual usage
    // This prevents build errors while still failing at runtime if env vars are missing
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client (voor gebruik in API routes en Server Components)
export function createServerClient() {
  if (isBuildTime || !supabaseServiceKey) {
    // Return a dummy client during build time
    return createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
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
