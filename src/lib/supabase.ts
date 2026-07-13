import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  // Falla ruidosamente en build/runtime si faltan las vars públicas.
  // El `!` del typing ya engaña; lanzamos el error real.
  throw new Error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. Revisa .env.local'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Cliente admin: SOLO para API routes (nunca importar en componentes client).
// Si no hay service role key, hacemos throw explícito en lugar de caer a
// anon key (que antes bypaseaba RLS sin avisar).
function createAdminClient() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRole) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY no está definida. Las rutas API que tocan Supabase con privilegios elevados no pueden operar sin ella.'
    );
  }
  return createClient<Database>(supabaseUrl, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const supabaseAdmin = createAdminClient();