import { invariantResponse } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, type FetcherWithComponents } from "@remix-run/react";
import { useId, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "#app/components/dialog.tsx";
import Table from "#app/components/table.tsx";
import { Button } from "#app/components/ui/button.tsx";
import { prisma } from "#app/utils/db.server.ts";

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
      }
    }
  })

  const requiredImages = [{id: "router_signal", label: "Router Signal"}, {id: "ATB", label: "ATB"}, {id: "lovage_atb", label: "Lovage ATB"}, {id: "power_reading", label: "Power Reading"}, {id: "path_cable", label: "Path Cable"}]

  invariantResponse(customerConnection, 'Connection Not Found', { status: 404 })

  return json({customerConnection, requiredImages});
}

export default function TrackerID(){
    const { customerConnection, requiredImages } = useLoaderData<typeof loader>()
    const materials = customerConnection.materialUsed.map(mat => [mat.material.materialCode, mat.material.materialName, mat.quantity])
    const fetcher = useFetcher()
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
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-red-500">
            <div className="px-4 py-5 sm:px-6 bg-primary">
              <h2 className="text-lg leading-6 font-medium text-white">Images</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <ImagesUploader requiredImages={requiredImages}/>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-red-500">
            <div className="px-4 py-5 sm:px-6 bg-primary">
                <h2 className="text-white text-lg leading-6 font-bold">Maps</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <InputFile
                name={customerConnection.id}
                fetcher={fetcher} 
                fullSize
              />
            </div>
          </div>
        </div>
      );
}

type ImagesUploaderProps = {
  requiredImages: {id: string, label: string}[]
}

function ImagesUploader({requiredImages}: ImagesUploaderProps){
  const [selectedRequired, setSelectedRequired] = useState<string | undefined>(undefined)
  const [imagesUploaded, setImagesUploaded] = useState<string[]>([])
  const imagesLeft = requiredImages.filter(image => !imagesUploaded.includes(image.id))

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
        {imagesUploaded.map(image => (<InputFile name="" key={image}/>))}
      </div>
    </div> 
  )
}

type InputFileProps = {
  name: string
  fullSize?: boolean
  fetcher?: FetcherWithComponents<unknown>
}

function InputFile({name, fullSize = false, fetcher}: InputFileProps){
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

  const handleUpload = () => {
    if(selectedImage && fetcher){
      const formData = new FormData()
      formData.append(name, selectedImage)
      fetcher.submit(formData, {action: "details_map", method: "POST", encType: "multipart/form-data"})
    }
  }

  return (
    <div className="relative border border-primary">
      <div className="flex">
        <label htmlFor={id} className=" block text-sm font-medium text-gray-700">
          Select Image
          <input onChange={handleImageUpload} id={id} type="file" className="sr-only"/>
        </label>
        <Button onClick={handleUpload} >Upload Image</Button>
      </div>
      {selectedImage && 
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