import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR SUPABASE_URL'
const supabaseAnonKey = 'YOUR SUPABASE_ANonKey'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)