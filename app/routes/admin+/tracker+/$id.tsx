import { parse } from "@conform-to/zod";
import { invariantResponse } from "@epic-web/invariant";
import { type ActionFunctionArgs, json, unstable_parseMultipartFormData, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, type LoaderFunctionArgs, unstable_createFileUploadHandler, NodeOnDiskFile } from "@remix-run/node";
import { type UIMatch, useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import CustomerDetailInfo from "#app/components/customer-detail-info.tsx";
import CustomerRequiredImages from "#app/components/customer-images.tsx";
import CustomerMapsUpload, { ResourceUpload } from "#app/components/customer-maps-upload.tsx";
import { Dialog, DialogContent, DialogTrigger } from "#app/components/dialog.tsx";
import Table from "#app/components/table.tsx";
import { uploadStreamToCloudStorage } from "#app/utils/uploader.server.ts";
import { supabaseClient } from "#app/utils/supa.server.ts";
import { requiredCCImages, requiredCCMDUImages } from "#app/utils/documents-tags.server.ts";
import MaterialAdd from "#app/components/molecules/material-add.tsx";
import { Button } from "#app/components/ui/button.tsx";
import { getShortID, getUUID } from "#app/utils/uuid.server.ts";
import p from "node:path";
import { nanoid } from "nanoid";

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
    const pt = `CustomerConnections/${id}/Images/${nanoid()}.${p.extname(filename)}`
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

export async function loader({params}: LoaderFunctionArgs) {
  const shortid = params.id
  invariantResponse(shortid, 'Must Provide a connection ID', {status: 404})

  const id = getUUID(shortid)

  const {data } = await supabaseClient.from("customer_connection").select(`
    *,
    documents:document_resource(*),
    materials:material_used(quantity, material(material_code, material_name))
  `).eq("id", id).single()

  const {data: materials} = await supabaseClient.from("material").select("material_name, material_code, materialid")
  
  invariantResponse(data, 'Connection Not Found', { status: 404 })

  return json({customerConnection: {...data, id: getShortID(data.id)}, requiredImages: requiredCCImages, requiredMDUImages: requiredCCMDUImages, materials: materials ?? []});
}

export const handle = {
	breadcrumb: (match: UIMatch<typeof loader, unknown>) => ({route: `/admin/tracker/${match.data.customerConnection.id}`, text: match.data.customerConnection.id}),
};

export default function TrackerID(){
    const fetcher = useFetcher()
    const { customerConnection, requiredImages, requiredMDUImages, materials: materialsList } = useLoaderData<typeof loader>()
    const materials = customerConnection.materials.map(mat => [mat.material?.material_code, mat.material?.material_name, mat.quantity])
    const map_1Image = customerConnection.documents.find(res => res.tag === "map_1")
    const map_2Image = customerConnection.documents.find(res => res.tag === "map_2")
    
    const map_1ImageMDU = customerConnection.documents.find(res => res.tag === "map_1_mdu")
    const map_2ImageMDU = customerConnection.documents.find(res => res.tag === "map_2_mdu")

    const requiredImagesFile = customerConnection.documents.filter(img => requiredImages.map(req => req.id).includes(img.tag ?? ""))
    const imagesToAdd = requiredImages
    // .filter(img => !requiredImagesFile.map(req => req.tag).includes(img.id))

    const requiredImagesFileMDU = customerConnection.documents.filter(img => requiredMDUImages.map(req => req.id).includes(img.tag ?? ""))
    const imagesToAddMDU = requiredMDUImages
    // .filter(img => !requiredImagesFileMDU.map(req => req.tag).includes(img.id))

    const survey = customerConnection.documents.find(res => res.tag === "survey_sheet")
    const survey_mdu = customerConnection.documents.find(res => res.tag === "survey_sheet_mdu")
    
    return (
        <div className="flex flex-col space-y-4 px-2 md:px-6 mb-6">
          <CustomerDetailInfo connection={customerConnection}/>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary">
              <div className="flex items-center justify-between space-x-5">
                <h2 className="text-lg leading-6 font-medium text-white">Materials Used</h2>
                <Dialog>
								<DialogTrigger asChild>
									<button className='bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>+</button>
								</DialogTrigger>
								<DialogContent>
									<fetcher.Form className="flex flex-col min-h-[30vh] justify-between" method="POST">
										<input type="hidden" name="id" value={customerConnection.id}/>
										<MaterialAdd materials={materialsList}/>
										<Button className="place-items-end" type='submit'>Add Material</Button>
									</fetcher.Form>
								</DialogContent>
							</Dialog>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <Table
                    headers={["Material Code", "Material Name", "Qty Used"]}
                >{materials}</Table>
            </div>
          </div>

          <CustomerMapsUpload 
            maps={[{resource: map_1Image, tag: "map_1"}, {resource: map_2Image, tag: "map_2"}]}
            customerID={customerConnection.id}
          />

          <CustomerRequiredImages
            imagesToAdd={imagesToAdd}
            uploadedImagesFile={requiredImagesFile}
            customerID={customerConnection.id}
            requiredImages={requiredImages}
          />

          {customerConnection.has_mdu && <CustomerMapsUpload
            maps={[{resource: map_1ImageMDU, tag: "map_1_mdu"}, {resource: map_2ImageMDU, tag: "map_2_mdu"}]}
            customerID={customerConnection.id}
            mdu
          />}

          {customerConnection.has_mdu && <CustomerRequiredImages
            imagesToAdd={imagesToAddMDU}
            uploadedImagesFile={requiredImagesFileMDU}
            mdu
            customerID={customerConnection.id}
            requiredImages={requiredMDUImages}
          />}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 bg-primary">
              <div className="flex space-x-5">
                <h2 className="text-lg leading-6 font-medium text-white">Survey Sheet</h2>
              </div>
            </div>
            <div className="p-4">
            <ResourceUpload
                doc={{resource: survey, tag: "survey_sheet"}}
                customerID={customerConnection.id}
                title="Survey Sheet"
              />
            </div>
          </div>

          {customerConnection.has_mdu && <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 bg-primary">
              <div className="flex space-x-5">
                <h2 className="text-lg leading-6 font-medium text-white">Survey Sheet MDU</h2>
              </div>
            </div>
            <div className="p-4">
            <ResourceUpload
                doc={{resource: survey_mdu, tag: "survey_sheet_mdu"}}
                customerID={customerConnection.id}
                title="Survey Sheet MDU"
              />
            </div>
          </div>}
        </div>
      );
}