import { createClient } from '@supabase/supabase-js'
import { type Database } from "../../types/supabase.ts"

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY

if(!url || !key) throw new Error("Unable to Initialize Client")

export const supabaseClient = createClient<Database>(url,key)