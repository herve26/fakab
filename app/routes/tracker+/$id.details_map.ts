import { type ActionFunctionArgs, unstable_parseMultipartFormData, json } from "@remix-run/node";
import { prisma } from "#app/utils/db.server.ts";
import { cloudStorageUploaderHandler } from "#app/utils/uploader.server.ts";

export async function action({params, request}: ActionFunctionArgs){
    const id = params.id
    if(!id){
        return json({status: 400, message: 'id is required', data: {}})
    }
    const connection = await prisma.customerConnections.findUnique({
        where: {
            id: id
        },
        select: {
            id: true
        }
    })
    
    if(!connection){
        return json({status: 404, message: 'connection not found', data: {}})
    }

    // upload file to cloud storage
    const formData = await unstable_parseMultipartFormData(request, cloudStorageUploaderHandler);
    const filename = formData.get(`${connection.id}`);

    return json({status: 200, message: 'success', data: {filename}})
}