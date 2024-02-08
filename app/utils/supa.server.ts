import { type Database } from "../../types/supabase.ts"
import { createServerClient, parse, serialize } from "@supabase/ssr"
import { SupabaseClient, createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY

console.log(url)

if(!url || !key) throw new Error("Unable to Initialize Client")

export function getSupabaseClient(cookie: string, headers: Headers): SupabaseClient {
    
    const cookies = parse(cookie)

    return createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        cookies: {
          get(key) {
            return cookies[key]
          },
          set(key, value, options) {
            headers.append('Set-Cookie', serialize(key, value, options))
          },
          remove(key, options) {
            headers.append('Set-Cookie', serialize(key, '', options))
          },
        },
    })

}



export const supabaseClient = createClient<Database>(url,key)