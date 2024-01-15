import { Form, useFetcher } from "@remix-run/react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog.tsx";
import InputLabel from "./molecules/input-label.tsx";
import { Button } from "./ui/button.tsx";

type ResourceUploadProp = {
    resource: {
        id: number;
        name: string;
        content_type: string | null;
        size: number | null;
        tag: string | null;
        url: string | null;
        path: string;
        created_at: string;
        updated_at: string;
        customerid: string | null;
        document_templateid: number | null;
    } | null | undefined,
    tag: string,
}

export function ResourceUpload({doc, customerID, title}: {doc: ResourceUploadProp, customerID: string, title: string}){
    const fetcher = useFetcher()

    const deleteResource = (id: number) => {
      const formData = new FormData()
      formData.append("id", `${id}`)
      fetcher.submit(formData, { method: "POST", action: "/api/delete-resource"})
    }

    return (
        <div>
            {doc.resource && (<div className="relative border">
                <button
                    className="absolute right-4 top-4 rounded-full bg-primary text-white h-8 w-8"
                    onClick={() => doc.resource && deleteResource(doc.resource.id)}
                >X</button>
                {doc.resource.url && <img src={doc.resource.url} alt={title}/>}
            </div> )}
            {!doc.resource && <Dialog>
                <DialogTrigger>
                    <Button>Add Resource File</Button>
                </DialogTrigger>
                <DialogContent>
                    <h3 className="w-full mb-4 text-lg font-bold text-center text-primary">Detailed doc Resource</h3>
                    <Form method="POST" encType="multipart/form-data">
                        <InputLabel label="Document's Name" type="text" name="name"/>
                        <InputLabel label="Document 📄 Resource" type="file" name="resource"/>
                        <input type="hidden" value={doc.tag} name="tag"/>
                        <Button>Create Resource</Button>
                    </Form>
                </DialogContent>
            </Dialog>}
        </div>
    )
}


type Props = {
    maps: ResourceUploadProp[];
    customerID: string;
    mdu?: boolean;
}

export default function CustomerMapsUpload({maps, customerID, mdu=false}: Props){

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary">
                <h2 className="text-white text-lg leading-6 font-bold">Maps {mdu ? "MDU" : ""}</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="grid grid-cols-2 gap-x-4">
                    <ResourceUpload doc={maps[0]} customerID={customerID} title={"Detailed Customer Map"}/>
                    <ResourceUpload doc={maps[1]} customerID={customerID} title="Drawn Customer Map"/>
              </div>
            </div>
          </div>
    )
}