import { useFetcher } from "@remix-run/react";
import FileSelectUpload from "./file-select-upload.tsx";
import { DocumentResource } from "./customer-images.tsx";

type ResourceUploadProp = {
    resource: DocumentResource | null | undefined,
    tag: string,
}

export function ResourceUpload({doc, title}: {doc: ResourceUploadProp, customerID: string, title: string}){
    const fetcher = useFetcher()

    const deleteResource = (id: number) => {
      const formData = new FormData()
      formData.append("id", `${id}`)
      fetcher.submit(formData, { method: "POST", action: "/api/delete-resource"})
    }
    
    const isSubmitting = fetcher.state === "submitting"

    const handleSubmit = (files: File[], name: string, tag: string) => {
        if(files.length > 0){
            const formData = new FormData()

            formData.append("name", name)
            formData.append("tag", tag)
            formData.append("resource", files[0])

            fetcher.submit(formData, { method: "POST", encType: "multipart/form-data"})
        }
        
    }

    return (
        <div className="min-h-[80vh] flex flex-col">
            {doc.resource && (<div className="relative border">
                <button
                    className="absolute right-4 top-4 rounded-full bg-primary text-white h-8 w-8"
                    onClick={() => doc.resource && deleteResource(doc.resource.id)}
                >X</button>
                {doc.resource.url && <img src={doc.resource.url} alt={title}/>}
            </div> )}
            {!doc.resource && <FileSelectUpload
                title={title}
                submitting={isSubmitting} 
                onSubmit={(files) => handleSubmit(files, title, doc.tag)}
            />}
        </div>
    )
}


type Props = {
    maps: ResourceUploadProp[];
    customerID: string;
    mdu?: boolean;
}

export default function CustomerMapsUpload({maps, mdu=false, customerID}: Props){

    const fetcher = useFetcher()
    const isSubmitting = fetcher.state === "submitting"

    const handleSubmit = (files: File[], name: string, tag: string) => {
        if(files.length > 0){
            const formData = new FormData()

            formData.append("name", name)
            formData.append("tag", tag)
            formData.append("resource", files[0])

            fetcher.submit(formData, { method: "POST", encType: "multipart/form-data", action:`/api/tracker/${customerID}/maps`})
        }
        
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary">
                <h2 className="text-white text-lg leading-6 font-bold">Maps {mdu ? "MDU" : ""}</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="grid grid-cols-2 gap-x-4 min-h-[80vh]">
                    {(maps[0].resource && maps[0].resource.url) ? 
                        <img src={maps[0].resource.url} alt={maps[0].tag}/>
                    : <FileSelectUpload
                        title="Detailed Map" 
                        submitting={isSubmitting}
                        onSubmit={(files) => handleSubmit(files, "Detailed Map", maps[0].tag)}
                    />}
                    {(maps[1].resource && maps[1].resource.url) ?
                    <img src={maps[1].resource.url} alt={maps[1].tag}/>
                    :
                    <FileSelectUpload
                        title="Drawn Map"
                        submitting={isSubmitting} 
                        onSubmit={(files) => handleSubmit(files, "Detailed Map", maps[1].tag)}
                    />}
              </div>
            </div>
        </div>
    )
}