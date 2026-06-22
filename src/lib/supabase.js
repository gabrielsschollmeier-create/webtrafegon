import { createClient } from '@supabase/supabase-js'

// Fallback embutido: a chave anon (publishable) é pública por design e o RLS
// protege os dados. Garante conexão mesmo se as env vars faltarem no deploy.
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL      || 'https://bfyshboqvisnuefeyqdv.supabase.co'
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZNp8LfPIbyYay1bsF3F4gw_ZCxVQPxl'

export const supabase = supabaseUrl && supabaseAnon
  ? createClient(supabaseUrl, supabaseAnon, {
      auth: {
        persistSession:     true,
        autoRefreshToken:   true,
        detectSessionInUrl: true,
        storageKey:         'trafegon_auth',
      },
      global: {
        headers: { 'x-client': 'trafegon-suite' },
      },
    })
  : null

export const supabaseReady = !!supabase
