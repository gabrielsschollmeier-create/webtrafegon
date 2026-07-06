import { createClient } from '@supabase/supabase-js'

// SOMENTE a chave anon (publishable), que é pública por design. O acesso aos
// dados é protegido pelo RLS: cada usuário loga via Supabase Auth (role
// authenticated) e as políticas liberam o acesso. A service_role NUNCA vai para
// o bundle do navegador — ela ignoraria o RLS e daria admin total a qualquer um.
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL      || 'https://bfyshboqvisnuefeyqdv.supabase.co'
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZNp8LfPIbyYay1bsF3F4gw_ZCxVQPxl'

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
