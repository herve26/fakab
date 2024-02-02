import { type ActionFunctionArgs, unstable_parseMultipartFormData, json } from "@remix-run/node";
import { uploadStreamToCloudStorage } from "#app/utils/uploader.server.ts";
import { supabaseClient } from "#app/utils/supa.server.ts";
import { invariantResponse } from "@epic-web/invariant";
import { getUUID } from "#app/utils/uuid.server.ts";

export async function action({params, request}: ActionFunctionArgs){
    const shortid = params.id
    if(!shortid){
        return json({status: 400, message: 'id is required', data: {}})
    }

    const id = getUUID(shortid)

    const { data } = await supabaseClient.from("customer_connection").select("so").eq("id", id).single()

    invariantResponse(data, "Unable to Get Customer Data")

    // upload file to cloud storage
    const formData = await unstable_parseMultipartFormData(request, uploadStreamToCloudStorage);
    const filename = formData.get(`${data.so}`);

    return json({status: 200, message: 'success', data: {filename}})
}