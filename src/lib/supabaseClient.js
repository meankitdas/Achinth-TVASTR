import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client — initialized from Vite environment variables.
 *
 * Required .env variables:
 *   VITE_SUPABASE_URL      — Supabase project URL
 *   VITE_SUPABASE_ANON_KEY — Supabase anon/public key
 *
 * Both values: Supabase Dashboard → Project Settings → API
 *
 * NOTE: This file is named supabaseClient.js (canonical name).
 * src/lib/supabase.js re-exports from here for backwards compatibility.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Tvastr] Supabase credentials missing. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  )
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)
