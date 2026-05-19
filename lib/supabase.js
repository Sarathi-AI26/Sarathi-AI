import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let adminClient = null
let browserClient = null // <-- Added this variable

export const createBrowserSupabaseClient = () => {
  // 1. If the browser client already exists, return it immediately.
  if (browserClient) {
    return browserClient
  }

  // 2. Otherwise, create it for the first time.
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase public environment variables')
  }

  browserClient = createClient(supabaseUrl, supabaseAnonKey)
  return browserClient
}

export const getSupabaseAdmin = () => {
  if (adminClient) {
    return adminClient
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase server environment variables')
  }

  adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'sarathi-nextjs-mvp',
      },
    },
  })

  return adminClient
}
