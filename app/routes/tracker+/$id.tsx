import { parse } from "@conform-to/zod";
import { invariantResponse } from "@epic-web/invariant";
import { type ActionFunctionArgs, json, unstable_parseMultipartFormData, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import CustomerDetailInfo from "#app/components/customer-detail-info.tsx";
import CustomerRequiredImages from "#app/components/customer-images.tsx";
import CustomerMapsUpload, { ResourceUpload } from "#app/components/customer-maps-upload.tsx";
import { Dialog, DialogContent, DialogTrigger } from "#app/components/dialog.tsx";
import Table from "#app/components/table.tsx";
import { prisma } from "#app/utils/db.server.ts";
import { uploadStreamToCloudStorage } from "#app/utils/uploader.server.ts";

const schema = z.object({
  name: z.string(),
  tag: z.string(),
  resource: z.string(),

})

export const requiredCCImages = [
  {id: "router_signal", label: "Router Signal"}, 
  {id: "ATB", label: "ATB"}, 
  {id: "lovage_atb", label: "Lovage ATB"}, 
  {id: "power_reading", label: "Power Reading"}, 
  {id: "path_cable", label: "Path Cable"},
  {id: "labelling", label: "Customer Labelling"},
  {id: "signal_origin", label: "Debut Signal(MDU/JB)"},
  {id: "path_cable_2", label: "Path Cable"},
  {id: "path_cable_3", label: "Path Cable"}
]

export const requiredCCMDUImages = [
  {id: "lovage_mdu", label: "Lovage MDU"},
  {id: "origin_mdu", label: "Poteau(MDU)"},
  {id: "MDU", label: "Image MDU"},
  {id: "lovage_jb", label: "Lovage Join Box"},
  {id: "path_cable_mdu", label: "Path Cable"},
  {id: "path_cable_2_mdu", label: "Path Cable"}
]


export async function action({params, request}: ActionFunctionArgs){
  const id = params.id
  if(id === null) return json({message: "Id is required"}, {status: 404})
  
  let path = ""

  const formData = await unstable_parseMultipartFormData(request, unstable_composeUploadHandlers(async ({name, filename, data}) => {
    if(name !== "resource") return undefined;
    path = `${id}/${Date.now()}_${filename}`
    return await uploadStreamToCloudStorage({filename: path, fileStream: data, makePublic: true})
  }, unstable_createMemoryUploadHandler()));

  const parsedData = parse(formData, { schema })

  if(!parsedData.value){
    return json({status: "error", parsedData}, {status: 404})
  }

  try {
    await prisma.documentResource.create({
      data: {
        name: parsedData.value.name,
        tag: parsedData.value.tag,
        path: path,
        url: parsedData.value.resource,
        customer: {
          connect: {
            id
          }
        }
      }
    })
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
  const id = params.id
  invariantResponse(id, 'Must Provide a connection ID', {status: 404})
  
  const customerConnection = await prisma.customerConnections.findUnique({
    where: { id },
    include: {
      materialUsed: {
        select: {
          quantity: true,
          material: {
            select: {
              materialCode: true,
              materialName: true
            }
          }
        }
      },
      documentResources: true
    }
  })

  invariantResponse(customerConnection, 'Connection Not Found', { status: 404 })

  return json({customerConnection, requiredImages: requiredCCImages, requiredMDUImages: requiredCCMDUImages});
}

export default function TrackerID(){
    const { customerConnection, requiredImages, requiredMDUImages } = useLoaderData<typeof loader>()
    const materials = customerConnection.materialUsed.map(mat => [mat.material.materialCode, mat.material.materialName, mat.quantity])
    const map_1Image = customerConnection.documentResources.find(res => res.tag === "map_1")
    const map_2Image = customerConnection.documentResources.find(res => res.tag === "map_2")
    
    const map_1ImageMDU = customerConnection.documentResources.find(res => res.tag === "map_1_mdu")
    const map_2ImageMDU = customerConnection.documentResources.find(res => res.tag === "map_2_mdu")

    const requiredImagesFile = customerConnection.documentResources.filter(img => requiredImages.map(req => req.id).includes(img.tag ?? ""))
    const imagesToAdd = requiredImages.filter(img => !requiredImagesFile.map(req => req.tag).includes(img.id))

    const requiredImagesFileMDU = customerConnection.documentResources.filter(img => requiredMDUImages.map(req => req.id).includes(img.tag ?? ""))
    const imagesToAddMDU = requiredMDUImages.filter(img => !requiredImagesFileMDU.map(req => req.tag).includes(img.id))

    const survey = customerConnection.documentResources.find(res => res.tag === "survey_sheet")
    const survey_mdu = customerConnection.documentResources.find(res => res.tag === "survey_sheet_mdu")
    
    return (
        <div className="flex flex-col space-y-4 px-6 mb-6">
          <h1 className="mb-5 text-3xl font-bold">Customer Connection</h1>
          <CustomerDetailInfo connection={customerConnection}/>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary">
              <div className="flex space-x-5">
                <h2 className="text-lg leading-6 font-medium text-white">Materials Used</h2>
                <Dialog>
                  <DialogTrigger>+</DialogTrigger>
                  <DialogContent>Add Material Used</DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
			        <Table
                    headers={["Material Code", "Material Name", "Qty Used"]}
                    children={materials}
                />
            </div>
          </div>

          <CustomerMapsUpload 
            maps={[{resource: map_1Image, tag: "map_1"}, {resource: map_2Image, tag: "map_2"}]}
            customerID={customerConnection.id}
          />

          <CustomerRequiredImages imagesToAdd={imagesToAdd} uploadedImagesFile={requiredImagesFile}/>

          {customerConnection.has_mdu && <CustomerMapsUpload
            maps={[{resource: map_1ImageMDU, tag: "map_1_mdu"}, {resource: map_2ImageMDU, tag: "map_2_mdu"}]}
            customerID={customerConnection.id}
            mdu
          />}

          {customerConnection.has_mdu && <CustomerRequiredImages
            imagesToAdd={imagesToAddMDU}
            uploadedImagesFile={requiredImagesFileMDU}
            mdu
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