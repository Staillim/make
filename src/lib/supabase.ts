import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Clientes lazy: NO se crean en module-load, porque Next 16 recolecta page data
// durante `next build` y eso ejecuta los top-levels. Si los envs faltan en
// build, antes esto reventaba el build entero. Ahora la validación ocurre
// sólo cuando alguien realmente llama al cliente (runtime).
//
// Patrón recomendado por el equipo de Next + Supabase para builds sin envs.

function requirePublicEnv(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Configúralas en Netlify (Site settings → Environment variables) o en .env.local.'
    );
  }
  return { url, key };
}

// Singleton lazy: se crea la primera vez que se usa, no antes.
// Cliente tipado con el Database completo: en @supabase/supabase-js 2.98 la
// inferencia de tablas funciona con createClient<Database>(...) directo.
// Tipar la variable con SupabaseClient<Database, "public"> rompía la
// inferencia y daba "Argument of type X is not assignable to parameter of type 'never'".
let _supabase: SupabaseClient<Database> | null = null;
export function getSupabase(): SupabaseClient<Database> {
  if (!_supabase) {
    const { url, key } = requirePublicEnv();
    _supabase = createClient<Database>(url, key);
  }
  return _supabase;
}

// Cliente admin: SOLO para API routes (nunca importar en componentes client).
// SERVICE_ROLE_KEY NO es NEXT_PUBLIC_, así que no se expone al bundle del cliente.
// Si no está definida, hacemos throw explícito en lugar de caer a anon key
// (que antes bypaseaba RLS sin avisar).
let _supabaseAdmin: SupabaseClient<Database> | null = null;
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!_supabaseAdmin) {
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRole) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY no está definida. Las rutas API que tocan ' +
        'Supabase con privilegios elevados no pueden operar sin ella.'
      );
    }
    const { url } = requirePublicEnv();
    _supabaseAdmin = createClient<Database>(url, serviceRole, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _supabaseAdmin;
}
