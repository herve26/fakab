import { type ActionFunctionArgs, unstable_parseMultipartFormData, json } from "@remix-run/node";
import { cloudStorageUploaderHandler } from "#app/utils/uploader.server.ts";
import { supabaseClient } from "#app/utils/supa.server.ts";
import { invariantResponse } from "@epic-web/invariant";

export async function action({params, request}: ActionFunctionArgs){
    const id = params.id
    if(!id){
        return json({status: 400, message: 'id is required', data: {}})
    }

    const { data } = await supabaseClient.from("customer_connection").select("so").eq("so", id).single()

    invariantResponse(data, "Unable to Get Customer Data")

    // upload file to cloud storage
    const formData = await unstable_parseMultipartFormData(request, cloudStorageUploaderHandler);
    const filename = formData.get(`${data.so}`);

    return json({status: 200, message: 'success', data: {filename}})
}