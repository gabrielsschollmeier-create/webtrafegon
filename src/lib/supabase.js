import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ⚠️ NUNCA adicionar service role key aqui — use Edge Functions para operações admin.
// A service role key bypassa RLS. Qualquer variável VITE_ fica exposta no bundle JS.

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export const supabaseAdmin = null // Removido — operações admin vão via Edge Functions

export const supabaseReady = !!supabase
