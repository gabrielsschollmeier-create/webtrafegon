import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseSvc = import.meta.env.VITE_SUPABASE_SERVICE_KEY   // bypassa RLS
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

// Ferramenta interna de agência — sem sistema de login.
// Usamos a service key que ja esta exposta no bundle VITE_ de qualquer forma.
// A service key bypassa RLS, garantindo que todos os colaboradores
// lêem e escrevem os mesmos dados sem precisar de autenticação.
const activeKey = supabaseSvc || supabaseAnon

export const supabase = supabaseUrl && activeKey
  ? createClient(supabaseUrl, activeKey, {
      auth: {
        persistSession:    false,   // sem sessão de usuário
        autoRefreshToken:  false,
        detectSessionInUrl: false,
      },
      global: {
        headers: { 'x-client': 'trafegon-suite' },
      },
    })
  : null

export const supabaseReady = !!supabase
