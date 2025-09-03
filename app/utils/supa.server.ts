/**
 * @file This file is responsible for initializing the Supabase client.
 * It reads the Supabase URL and anonymous key from the environment variables and creates a new Supabase client instance.
 * This client can be used to interact with the Supabase database and other Supabase services.
 */
import { createClient } from '@supabase/supabase-js'
import { type Database } from "../../types/supabase.ts"

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY

console.log(url)

if(!url || !key) throw new Error("Unable to Initialize Client")

/**
 * The Supabase client instance.
 * @type {import('@supabase/supabase-js').SupabaseClient<Database>}
 */
export const supabaseClient = createClient<Database>(url,key)