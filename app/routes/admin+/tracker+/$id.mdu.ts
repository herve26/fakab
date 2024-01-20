import { supabaseClient } from "#app/utils/supa.server.ts";
import { invariantResponse } from "@epic-web/invariant";
import { type ActionFunctionArgs } from "@remix-run/node";

export async function action({params}: ActionFunctionArgs){
    const id = params.id

    invariantResponse(id, "Id is required")

    await supabaseClient.from("customer_connection").update({
        has_mdu: true
    }).eq("so", id)

    return null
}