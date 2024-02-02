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