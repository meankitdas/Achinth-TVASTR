import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client — initialized from Vite environment variables.
 *
 * Required .env variables:
 *   VITE_SUPABASE_URL      — your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY — your Supabase anon/public key
 *
 * Both values are found in: Supabase Dashboard → Project Settings → API
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Tvastr] Supabase credentials missing. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      // Persist session in localStorage so users stay logged in across refreshes
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)
