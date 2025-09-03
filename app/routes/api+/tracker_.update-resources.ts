import { supabaseClient } from "#app/utils/supa.server.ts";
import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";

const dataShape = z.object({
    id: z.number(),
    for_report: z.boolean()
})

const schema = z.object({
    data: dataShape.array()    
})

/**
 * The action function for the update resources route.
 * It handles the updating of document resources.
 *
 * @param {ActionFunctionArgs} args - The action function arguments.
 * @returns {Promise<boolean | null>} A promise that resolves with a boolean or null.
 */
export async function action({request}: ActionFunctionArgs){
    // const { data } = await request.json<{data: {id: number, for_report: boolean}[]}>()

    const { data } = schema.parse(await request.json())

    try{
        await supabaseClient.from("document_resource").upsert(data)
        return true
    }
    catch(e){
        return null
    }
}