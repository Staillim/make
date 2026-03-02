import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Database types are manually defined and missing Relationships[] required by
// @supabase/supabase-js v2.98+. Using untyped client until types are regenerated
// with `npx supabase gen types typescript`.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role (for API routes)
export const supabaseAdmin = createSupabaseClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
)

// Export createClient helper for server components
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}