import { supabaseClient } from "#app/utils/supa.server.ts"
import { uploadStreamToCloudStorage } from "#app/utils/uploader.server.ts"
import { getUUID } from "#app/utils/uuid.server.ts"
import { parse } from "@conform-to/zod"
import { ActionFunctionArgs, NodeOnDiskFile, json, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node"
import { z } from "zod"
import p from "node:path";
import shortUUID from "short-uuid"

const schema = z.object({
    names: z.string().array(),
    tags: z.string().array(),
    resources: z.string().array(),
  })

export async function action({request, params}: ActionFunctionArgs){
const shortid = params.id
console.log(shortid)
  if(!shortid) return json({message: "Id is required"}, {status: 404})
  
  const id = getUUID(shortid)
  const paths: string[] = []

  const regex = new RegExp(/^resources\[(\d+)\]$/);

  const formData = await unstable_parseMultipartFormData(request, unstable_composeUploadHandlers(process.env["NODE_ENV"] === "production" ? async ({name, filename, data, contentType}) => {
    if(!regex.test(name) || !filename) return undefined;
    const path = `${id}/${Date.now()}_${filename}` 
    paths.push(path)
    return await uploadStreamToCloudStorage({name, filename, data, contentType})
  } : async ({name, filename, data, contentType}) => { 
    if(!regex.test(name)) return undefined
    const handler = unstable_createFileUploadHandler({directory: p.join(process.cwd(), "public", "resources")})
    const file = await handler({name, filename, data, contentType}) as NodeOnDiskFile
    if(!file) return undefined
    return `/resources/${file.name}`
  }, unstable_createMemoryUploadHandler()));

    const parsedData = parse(formData, { schema })

    console.log(parsedData)

    if(!parsedData.value){
        return json({status: "error", parsedData}, {status: 404})
    }

    try {
            const data = parsedData.value.tags.map((tag, idx) => {
              const path = paths.at(idx)
              const url = parsedData.value?.resources[idx]

              if(!url) return undefined
              
              return {
                tag: tag,
                path: path ?? null,
                url,
                customerid: id
              }
            }).filter(value => value !== undefined) as {
              tag: string;
              path: string | null;
              url: string;
              customerid: shortUUID.UUID;
          }[]

          console.log(data)


        const bulk = await supabaseClient.from("document_resource").insert(data).select()

        console.log(bulk)
    
        return json({message: "Success"}, {status: 200})
        
    } catch (error) {
      console.log(error)
        if (error instanceof z.ZodError) {
          return json({ errors: error.issues }, { status: 422 }); // Unprocessable Entity
        } else {
          console.error('Error creating document template:', error);
          return json({ error: 'Failed to create document template' }, { status: 500 });
        }
    }
}