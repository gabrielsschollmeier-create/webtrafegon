import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

// Service key bypassa RLS — permite que todos os usuários vejam/escrevam todos os dados
// Configurada como VITE_SUPABASE_SERVICE_KEY nas env vars do Vercel
// Fallback para anon key em dev local (sem service key)
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || supabaseAnon

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
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
