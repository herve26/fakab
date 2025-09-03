import { PathData, createKMLDocument } from "#app/utils/generate-kml.ts";
import { supabaseClient } from "#app/utils/supa.server.ts";
import { getUUID } from "#app/utils/uuid.server.ts";
import { invariantResponse } from "@epic-web/invariant";
import { LoaderFunctionArgs } from "@remix-run/node";

/**
 * The loader function for the KML route.
 * It generates a KML file for a customer's path.
 *
 * @param {LoaderFunctionArgs} args - The loader function arguments.
 * @returns {Promise<Response>} A promise that resolves with a response.
 * @throws {Error} If the ID is not provided.
 */
export async function loader({params}: LoaderFunctionArgs){
    const shortid = params.id
    if(!shortid) {
        throw new Error("ID is mandatory")
    }

    const id = getUUID(shortid)

    const { data } = await supabaseClient.from("customer_connection").select("customer_details, path").eq("id", id).single()

    invariantResponse(data, "Unable to Fetch Path")
    invariantResponse(data.path, "Unable to get Path")

    const path  = data.path as PathData


    const kmlDocument = createKMLDocument(path)

    return new Response(kmlDocument, {
        status: 200,
        headers: {
            "Content-Disposition": `attachment;filename=${data.customer_details.replace(" ", "_")}.kml`,
            'Content-Type': 'application/vnd.google-earth.kml+xml',
        }
    })
}