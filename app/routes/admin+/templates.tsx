import { parse } from "@conform-to/zod";
import { type ActionFunctionArgs, json, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData, unstable_createFileUploadHandler, NodeOnDiskFile } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTrigger } from "#app/components/dialog.tsx";
import InputLabel from "#app/components/molecules/input-label.tsx";
import ScreenView from "#app/components/screen-view.tsx";
import { Button } from "#app/components/ui/button.tsx";
import { uploadStreamToCloudStorage } from "#app/utils/uploader.server.ts";
import { supabaseClient } from "#app/utils/supa.server.ts";
import p from "node:path";
import { nanoid } from "nanoid";

const schema = z.object({
    resourceName: z.string(),
    resource: z.string(),
    templateId: z.number()
})

export async function action({request}: ActionFunctionArgs){
    let path = ""

    const regex = new RegExp(/^resource$/);

  const formData = await unstable_parseMultipartFormData(request, unstable_composeUploadHandlers(process.env["NODE_ENV"] === "production" ? async ({name, filename, data, contentType}) => {
    if(!regex.test(name) || !filename) return undefined;
    const pt = `Templates/${nanoid()}${p.extname(filename)}` 
    path = pt
    return await uploadStreamToCloudStorage({name, filename:pt, data, contentType})
  } : async ({name, filename, data, contentType}) => { 
    if(!regex.test(name)) return undefined
    const handler = unstable_createFileUploadHandler({directory: p.join(process.cwd(), "public", "resources", "templates")})
    const file = await handler({name, filename, data, contentType}) as NodeOnDiskFile
    if(!file) return undefined
    return `/resources/templates/${file.name}`
  }, unstable_createMemoryUploadHandler()));

      const parsedData = parse(formData, { schema })

      if(!parsedData.value){
        return json({status: "error", parsedData}, {status: 404})
      }

      try {
        const {error} = await supabaseClient.from("document_resource").insert({
            path: path,
            url: parsedData.value.resource,
            document_templateid: parsedData.value.templateId
        })

        console.log(error)

        return json({status: "Success" })

    } catch (error) {
        if (error instanceof z.ZodError) {
          return json({ errors: error.issues }, { status: 422 }); // Unprocessable Entity
        } else {
          console.error('Error creating document template:', error);
          return json({ error: 'Failed to create document template' }, { status: 500 });
        }
    }
}

export async function loader(){
    const { data } = await supabaseClient.from("document_template").select("*, document_resource(path)")
  
    return json({templates: data ?? []})
}

export default function TemplateIndex(){
    const { templates } = useLoaderData<typeof loader>()
    return (
        <ScreenView link="new" heading="Document Template" className="px-8 py-4 flex flex-col h-full">
            <div className="flex space-x-4 h-full">
                <div className="h-full w-full grid grid-cols-4 gap-4 py-4">
                    
                    {templates.map(template => 
                        <div
                            key={template.documentid}
                            className="border hover:shadow-md bg-white rounded-lg max-h-48 flex flex-col items-center space-y-3 py-4"
                        >
                            <h3 className="text-primary text-lg w-full text-center uppercase">{template.document_name}</h3>
                            {template.document_resource.length > 0 && <div className="">
                                <span className="inline-block">Resource</span>
                                <h4>{template.document_resource[0].path}</h4>
                            </div>}
                            <Dialog>
                                <DialogTrigger>
                                    <Button>Add Resource File</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <h3 className="w-full mb-4 text-lg font-bold text-center text-primary">{template.document_name}&apos;s Resource</h3>
                                    <Form method="POST" encType="multipart/form-data">
                                        <InputLabel label="Document's Name" type="text" name="resourceName"/>
                                        <InputLabel label="Document 📄 Resource" type="file" name="resource"/>
                                        <input type="hidden" value={template.documentid} name="templateId"/>
                                        <Button>Create Resource</Button>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
                <Outlet/>
            </div>
        </ScreenView>
    )
}