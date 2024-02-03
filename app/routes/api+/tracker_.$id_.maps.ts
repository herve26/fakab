import { type ActionFunctionArgs, unstable_parseMultipartFormData, json, unstable_composeUploadHandlers, unstable_createFileUploadHandler, NodeOnDiskFile, unstable_createMemoryUploadHandler } from "@remix-run/node";
import { uploadStreamToCloudStorage } from "#app/utils/uploader.server.ts";
import { supabaseClient } from "#app/utils/supa.server.ts";
import { invariantResponse } from "@epic-web/invariant";
import { getUUID } from "#app/utils/uuid.server.ts";
import { z } from "zod";
import { nanoid } from "nanoid";
import p from "node:path"
import { parse } from "@conform-to/zod";

const schema = z.object({
    name: z.string(),
    tag: z.string(),
    resource: z.string(),
  })
  
  export async function action({params, request}: ActionFunctionArgs){
    const shortid = params.id
    if(!shortid) return json({message: "Id is required"}, {status: 404})
    
    const id = getUUID(shortid)
    let path = ""
  
    const regex = new RegExp(/^resource$/);
  
    const formData = await unstable_parseMultipartFormData(request, unstable_composeUploadHandlers(process.env["NODE_ENV"] === "production" ? async ({name, filename, data, contentType}) => {
      if(!regex.test(name) || !filename) return undefined;
      const pt = `CustomerConnections/${id}/Documents/${nanoid()}.${p.extname(filename)}`
      path = pt 
      return await uploadStreamToCloudStorage({name, filename: pt, data, contentType})
    } : async ({name, filename, data, contentType}) => { 
      if(!regex.test(name)) return undefined
      const handler = unstable_createFileUploadHandler({directory: p.join(process.cwd(), "public", "resources")})
      const file = await handler({name, filename, data, contentType}) as NodeOnDiskFile
      if(!file) return undefined
      return `/resources/${file.name}`
    }, unstable_createMemoryUploadHandler()));
  
    const parsedData = parse(formData, { schema })
  
    if(!parsedData.value){
      console.log(parsedData)
      return json({status: "error", parsedData}, {status: 404})
    }
  
    
  
    try {
      const { data: document } = await supabaseClient.from("document_resource").insert({
        tag: parsedData.value.tag,
        path,
        url: parsedData.value.resource,
        customerid: id
      }).select()
      
      invariantResponse(document, "Unable to Add document in DB")
  
      return json({message: "Success"}, {status: 200})
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return json({ errors: error.issues }, { status: 422 }); // Unprocessable Entity
      } else {
        console.error('Error creating document template:', error);
        return json({ error: 'Failed to create document template' }, { status: 500 });
      }
    }
  }