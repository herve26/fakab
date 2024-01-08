import { Form, useFetcher } from "@remix-run/react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog.tsx";
import InputLabel from "./molecules/input-label.tsx";
import { Button } from "./ui/button.tsx";

type Map = {
    resource: {
        id: number;
        name: string;
        contentType: string | null;
        size: number | null;
        tag: string | null;
        url: string | null;
        path: string;
        createdAt: string;
        updatedAt: string;
        customerId: string | null;
        documentTemplateId: number | null;
    } | null | undefined,
    tag: string
}

function MapUpload({map, customerID}: {map: Map, customerID: string}){
    const fetcher = useFetcher()

    const deleteResource = (id: number) => {
      const formData = new FormData()
      formData.append("id", `${id}`)
      fetcher.submit(formData, { method: "POST", action: "/api/delete-resource"})
    }

    return (
        <div>
            {map.resource && (<div className="relative border">
                <button
                    className="absolute right-4 top-4 rounded-full bg-primary text-white h-8 w-8"
                    onClick={() => map.resource && deleteResource(map.resource.id)}
                >X</button>
                {map.resource.url && <img src={map.resource.url} alt={`Detailed Map of ${customerID}`}/>}
            </div> )}
            {!map.resource && <Dialog>
                <DialogTrigger>
                    <Button>Add Resource File</Button>
                </DialogTrigger>
                <DialogContent>
                    <h3 className="w-full mb-4 text-lg font-bold text-center text-primary">Detailed Map Resource</h3>
                    <Form method="POST" encType="multipart/form-data">
                        <InputLabel label="Document's Name" type="text" name="name"/>
                        <InputLabel label="Document 📄 Resource" type="file" name="resource"/>
                        <input type="hidden" value={map.tag} name="tag"/>
                        <Button>Create Resource</Button>
                    </Form>
                </DialogContent>
            </Dialog>}
        </div>
    )
}


type Props = {
    maps: Map[];
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
                    <MapUpload map={maps[0]} customerID={customerID}/>
                    <MapUpload map={maps[1]} customerID={customerID}/>
              </div>
            </div>
          </div>
    )
}