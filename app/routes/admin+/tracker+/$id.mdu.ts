import { supabaseClient } from "#app/utils/supa.server.ts";
import { getUUID } from "#app/utils/uuid.server.ts";
import { invariantResponse } from "@epic-web/invariant";
import { type ActionFunctionArgs } from "@remix-run/node";

/**
 * The action function for the MDU route.
 * It updates a customer connection to indicate that it has an MDU.
 *
 * @param {ActionFunctionArgs} args - The action function arguments.
 * @returns {Promise<null>} A promise that resolves with null.
 */
export async function action({params}: ActionFunctionArgs){
    const shortid = params.id

    invariantResponse(shortid, "Id is required")

    const id = getUUID(shortid)

    await supabaseClient.from("customer_connection").update({
        has_mdu: true
    }).eq("so", id)

    return null
}