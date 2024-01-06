import { parse } from "@conform-to/zod";
import { invariantResponse } from "@epic-web/invariant";
import { type ActionFunctionArgs, json, unstable_parseMultipartFormData, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, Form } from "@remix-run/react";
import { useId, useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTrigger } from "#app/components/dialog.tsx";
import InputLabel from "#app/components/molecules/input-label.tsx";
import Table from "#app/components/table.tsx";
import { Button } from "#app/components/ui/button.tsx";
import { prisma } from "#app/utils/db.server.ts";
import { uploadStreamToCloudStorage } from "#app/utils/uploader.server.ts";

const schema = z.object({
  name: z.string(),
  tag: z.string(),
  resource: z.string(),

})

export const requiredCCImages = [{id: "router_signal", label: "Router Signal"}, {id: "ATB", label: "ATB"}, {id: "lovage_atb", label: "Lovage ATB"}, {id: "power_reading", label: "Power Reading"}, {id: "path_cable", label: "Path Cable"}]

export async function action({params, request}: ActionFunctionArgs){
  const id = params.id
  if(id === null) return json({message: "Id is required"}, {status: 404})
  
  let path = ""

  const formData = await unstable_parseMultipartFormData(request, unstable_composeUploadHandlers(async ({name, filename, data}) => {
    if(name !== "resource") return undefined;
    path = `${id}/${filename}`
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

  return json({customerConnection, requiredImages: requiredCCImages});
}

export default function TrackerID(){
    const { customerConnection, requiredImages } = useLoaderData<typeof loader>()
    const materials = customerConnection.materialUsed.map(mat => [mat.material.materialCode, mat.material.materialName, mat.quantity])
    const map_1Image = customerConnection.documentResources.find(res => res.tag === "map_1")
    const requiredImagesFile = customerConnection.documentResources.filter(img => requiredImages.map(req => req.id).includes(img.tag ?? ""))
    const imagesToAdd = requiredImages.filter(img => !requiredImagesFile.map(req => req.tag).includes(img.id))
    
    const fetcher = useFetcher()

    const deleteResource = (id: number) => {
      const formData = new FormData()
      formData.append("id", `${id}`)
      fetcher.submit(formData, { method: "POST", action: "/api/delete-resource"})
    }

    return (
        <div className="flex flex-col space-y-4 px-6">
          <h1 className="mb-5 text-3xl font-bold">Customer Connection</h1>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary">
              <h2 className="text-white text-lg leading-6 font-bold">General Information</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">SO</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.so}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Customer Details</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.customer_details}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Contact</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.customer_contact}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.customer_address}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Area</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.area}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Completion Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.completion_date}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Team ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customerConnection.teamId}</dd>
                </div>
              </dl>
            </div>
          </div>
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
          
          <div className="shadow overflow-hidden sm:rounded-lg border border-primary">
            <div className="px-4 py-5 sm:px-6 bg-primary">
              <h2 className="text-lg leading-6 font-medium text-white">Images</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <ImagesUploader
                requiredImages={imagesToAdd}
                showImages={false}
              />
              <div
                className="grid grid-cols-4 gap-x-2"
              >{requiredImagesFile.map(image => 
                <div key={image.id} className="border rounded-md bg-white p-3">
                  <h4>Image of {image.tag}</h4>
                  <img key={image.id} src={image.url ?? ""} alt={image.name}/>
                </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-red-500">
            <div className="px-4 py-5 sm:px-6 bg-primary">
                <h2 className="text-white text-lg leading-6 font-bold">Maps</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-2 gap-x-4">
              {map_1Image ? (<div className="relative border">
                <button
                  className="absolute right-4 top-4 rounded-full bg-primary text-white h-8 w-8"
                  onClick={() => deleteResource(map_1Image.id)}
                >X</button>
                <img src={map_1Image.url ?? ""} alt={`Detailed Map of ${customerConnection.id}`}/>
              </div> ) : <Dialog>
                <DialogTrigger>
                    <Button>Add Resource File</Button>
                </DialogTrigger>
                <DialogContent>
                    <h3 className="w-full mb-4 text-lg font-bold text-center text-primary">Detailed Map Resource</h3>
                    <Form method="POST" encType="multipart/form-data">
                        <InputLabel label="Document's Name" type="text" name="name"/>
                        <InputLabel label="Document 📄 Resource" type="file" name="resource"/>
                        <input type="hidden" value="map_1" name="tag"/>
                        <Button>Create Resource</Button>
                    </Form>
                </DialogContent>
              </Dialog>}
              </div>
            </div>
          </div>
        </div>
      );
}

type ImagesUploaderProps = {
  requiredImages: {id: string, label: string}[],
  showImages?: boolean
}

function ImagesUploader({requiredImages, showImages}: ImagesUploaderProps){
  const [selectedRequired, setSelectedRequired] = useState<string | undefined>(undefined)
  const [imagesUploaded, setImagesUploaded] = useState<string[]>([])
  const imagesLeft = requiredImages.filter(image => !imagesUploaded.includes(image.id))

  const fetcher = useFetcher()

  const handleUpload = ({name, image, tag}: {name: string, image: File, tag: string}) => {
      const formData = new FormData()
      formData.append("resource", image)
      formData.append("tag", tag)
      formData.append("name", name)
      fetcher.submit(formData, { method: "POST", encType: "multipart/form-data"})
  }

  return(
    <div className="">
      <div className="flex">
        <select value={selectedRequired} onChange={(event) => setSelectedRequired(event.target.value)}>
          {imagesLeft.map(image => (
            <option key={image.id} value={image.id}>{image.label}</option>
          ))}
        </select>
        <Button onClick={() => {
          if(selectedRequired) {
            setImagesUploaded([...imagesUploaded, selectedRequired])
            setSelectedRequired(undefined)
          }
        }}>Select</Button>
      </div>
      <div className="flex">
        {imagesUploaded.map(imageStr => (
          <InputFile
            name="resource" 
            key={imageStr}
            show={showImages}
            handleSubmit={(image) => handleUpload({tag: imageStr, image, name: requiredImages.find(img => img.id === imageStr)?.label ?? ""})}
          />
        ))}
      </div>
    </div> 
  )
}

type InputFileProps = {
  name: string
  fullSize?: boolean
  handleSubmit?: (image: File) => void,
  show?: boolean
}

function InputFile({name, fullSize = false, handleSubmit, show}: InputFileProps){
  const id = useId()
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dimension, setDimension] = useState<{width: number, height: number} | null>(null)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update the selected images state
    setSelectedImage(event.target.files ? event.target.files[0] : null);
  };
  const resizeImage:React.ReactEventHandler<HTMLImageElement> = (event) => {
    if(dimension !== null || fullSize) return

    const height = event.currentTarget.offsetHeight
    const width = event.currentTarget.offsetWidth
    const ratio = height / width

    setDimension({width: 300, height: 300 * ratio})
  }

  return (
    <div className="relative border border-primary">
      <div className="flex">
        <label htmlFor={id} className=" block text-sm font-medium text-gray-700">
          Select Image
          <input onChange={handleImageUpload} id={id} type="file" className="sr-only"/>
        </label>
        <Button onClick={() => { 
          if(selectedImage && handleSubmit) handleSubmit(selectedImage)
        }}>Upload Image</Button>
      </div>
      {(selectedImage && show ) && 
        <div className="">
          <img
            onLoad={resizeImage}
            src={URL.createObjectURL(selectedImage)}
            alt="Uploaded"
            className="w-full h-full object-cover"
            style={{
              width: dimension?.width,
              height: dimension?.height
            }}
          />
        </div>}
    </div>
  )
}