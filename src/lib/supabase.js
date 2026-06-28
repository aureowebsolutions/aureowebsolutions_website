import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Returns null when env vars are not configured (dev without Supabase setup).
// All consumers must guard: if (!supabase) return early.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
